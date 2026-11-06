import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  X, 
  Terminal, 
  Table as TableIcon, 
  Download, 
  Plus, 
  Trash2, 
  Play, 
  Copy, 
  Check, 
  RefreshCw, 
  Search,
  Key,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { sqlDb, type SqlUserRecord, type SqlQueryResult } from '../services/sqlDatabase';

interface SqlDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSelect?: (user: SqlUserRecord) => void;
}

export const SqlDatabaseModal: React.FC<SqlDatabaseModalProps> = ({
  isOpen,
  onClose,
  onUserSelect,
}) => {
  const [activeTab, setActiveTab] = useState<'table' | 'query' | 'export' | 'insert'>('table');
  const [users, setUsers] = useState<SqlUserRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedDump, setCopiedDump] = useState(false);
  const [sqlDump, setSqlDump] = useState('');

  // SQL Query Console state
  const [rawQuery, setRawQuery] = useState('SELECT * FROM users ORDER BY created_at DESC;');
  const [queryResult, setQueryResult] = useState<SqlQueryResult | null>(null);

  // Manual Insert Form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPartner, setNewPartner] = useState('');
  const [insertMessage, setInsertMessage] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await sqlDb.selectAllUsers();
      setUsers(data);
      const dump = await sqlDb.exportSqlDump();
      setSqlDump(dump);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    sqlDb.selectAllUsers().then((data) => {
      if (isMounted) {
        setUsers(data);
      }
    }).catch(console.error);

    sqlDb.exportSqlDump().then((dump) => {
      if (isMounted) {
        setSqlDump(dump);
      }
    }).catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleDeleteUser = async (id: string, name: string) => {
    if (window.confirm(`Deseja realmente excluir o registro de "${name}" do banco de dados SQL?`)) {
      await sqlDb.deleteUser(id);
      await loadData();
    }
  };

  const handleExecuteQuery = async () => {
    setIsLoading(true);
    try {
      const res = await sqlDb.executeRawSql(rawQuery);
      setQueryResult(res);
      await loadData();
    } catch (err: unknown) {
      setQueryResult({
        success: false,
        query: rawQuery,
        command: 'OTHER',
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: err instanceof Error ? err.message : 'Erro ao processar SQL',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInsertMessage('');
    if (!newName || !newEmail || !newPassword) {
      setInsertMessage('Preencha Nome, E-mail e Senha.');
      return;
    }

    try {
      await sqlDb.insertUser({
        name: newName,
        email: newEmail,
        passwordHash: newPassword,
        partnerName: newPartner || undefined,
      });
      setInsertMessage('✅ Registro inserido com sucesso via INSERT INTO users!');
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewPartner('');
      await loadData();
      setActiveTab('table');
    } catch (err: unknown) {
      setInsertMessage(`❌ ${err instanceof Error ? err.message : 'Erro na inserção SQL'}`);
    }
  };

  const handleCopyDump = () => {
    navigator.clipboard.writeText(sqlDump);
    setCopiedDump(true);
    setTimeout(() => setCopiedDump(false), 2500);
  };

  const handleDownloadDump = () => {
    const blob = new Blob([sqlDump], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cartorio_sql_dump_${new Date().toISOString().split('T')[0]}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.partner_name && u.partner_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-5xl h-[90vh] max-h-[780px] bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden text-stone-900 dark:text-stone-100"
      >
        {/* ================= MODAL HEADER ================= */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#72092c] to-[#9e1b45] text-amber-200 flex items-center justify-center shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-stone-900 dark:text-stone-100">
                  Banco de Dados SQL — Studio & Admin
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40">
                  SQL Conectado
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Gerenciador completo de tabelas, consultas SQL e exportação de dados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              title="Recarregar dados SQL"
              className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= TABS NAVIGATION ================= */}
        <div className="px-6 border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-850/50 flex items-center gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'table'
                ? 'border-[#72092c] text-[#72092c] dark:border-rose-400 dark:text-rose-400 bg-white/60 dark:bg-stone-800/60'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Tabela `users` ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('query')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'query'
                ? 'border-[#72092c] text-[#72092c] dark:border-rose-400 dark:text-rose-400 bg-white/60 dark:bg-stone-800/60'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Terminal SQL (Queries)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'export'
                ? 'border-[#72092c] text-[#72092c] dark:border-rose-400 dark:text-rose-400 bg-white/60 dark:bg-stone-800/60'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Dump SQL (.sql)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('insert')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'insert'
                ? 'border-[#72092c] text-[#72092c] dark:border-rose-400 dark:text-rose-400 bg-white/60 dark:bg-stone-800/60'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Novo Registro</span>
          </button>
        </div>

        {/* ================= TAB CONTENT BODY ================= */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: TABLE USERS LIST */}
          {activeTab === 'table' && (
            <div className="space-y-4">
              {/* Search Bar & Quick Stats */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filtrar por nome, e-mail ou parceiro(a)..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#72092c]"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <Layers className="w-4 h-4" />
                  <span>Total de Registros SQL: <strong>{users.length}</strong></span>
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-stone-900 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 dark:bg-stone-800/80 uppercase text-[10px] font-bold text-stone-600 dark:text-stone-400 border-b border-stone-200 dark:border-stone-700">
                      <tr>
                        <th className="py-3 px-4">ID (Primary Key)</th>
                        <th className="py-3 px-4">Nome</th>
                        <th className="py-3 px-4">E-mail</th>
                        <th className="py-3 px-4">Senha / Hash</th>
                        <th className="py-3 px-4">Nome do Amor</th>
                        <th className="py-3 px-4">Certidões</th>
                        <th className="py-3 px-4">Data Registro</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-stone-400">
                            Nenhum registro encontrado na tabela `users`.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors">
                            <td className="py-3 px-4 font-mono text-[11px] text-stone-500 dark:text-stone-400">
                              {u.id}
                            </td>
                            <td className="py-3 px-4 font-bold text-stone-900 dark:text-stone-100">
                              {u.name}
                            </td>
                            <td className="py-3 px-4 text-stone-600 dark:text-stone-300">
                              {u.email}
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-amber-600 dark:text-amber-400">
                              <span className="flex items-center gap-1">
                                <Key className="w-3 h-3" />
                                {u.password_hash}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-stone-500 dark:text-stone-400">
                              {u.partner_name || '—'}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#72092c] dark:bg-rose-950/60 dark:text-rose-300 font-bold text-[10px]">
                                {u.saved_certificates_count || 0}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-[11px] text-stone-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(u.created_at).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="py-3 px-4 text-right space-x-1">
                              {onUserSelect && (
                                <button
                                  type="button"
                                  onClick={() => onUserSelect(u)}
                                  className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-[#72092c] dark:text-rose-400 hover:bg-[#72092c] hover:text-white dark:hover:bg-rose-600 font-bold text-[10px] transition-all"
                                >
                                  Usar Sessão
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                title="Excluir linha SQL"
                                className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SQL QUERY CONSOLE */}
          {activeTab === 'query' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 text-stone-400 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    SQL Query Editor
                  </span>
                  <span>Dialeto: PostgreSQL / SQLite</span>
                </div>

                <textarea
                  rows={4}
                  value={rawQuery}
                  onChange={(e) => setRawQuery(e.target.value)}
                  className="w-full bg-transparent text-emerald-400 font-mono text-xs focus:outline-none resize-none"
                  placeholder="Escreva sua consulta SQL aqui (ex: SELECT * FROM users;)"
                />

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-stone-800">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRawQuery('SELECT * FROM users;')}
                      className="px-2 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-[10px] text-stone-300"
                    >
                      SELECT ALL
                    </button>
                    <button
                      type="button"
                      onClick={() => setRawQuery("SELECT * FROM users WHERE email LIKE '%gmail%';")}
                      className="px-2 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-[10px] text-stone-300"
                    >
                      FILTER GMAIL
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleExecuteQuery}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Executar Query (F5)</span>
                  </button>
                </div>
              </div>

              {/* Query Result Output */}
              {queryResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>
                      Status: <strong>{queryResult.success ? 'Sucesso' : 'Falha'}</strong> • Tempo:{' '}
                      {queryResult.executionTimeMs}ms • Linhas: {queryResult.rowCount}
                    </span>
                  </div>

                  <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-stone-900 p-4 font-mono text-xs">
                    {queryResult.error ? (
                      <div className="text-red-500 font-semibold">{queryResult.error}</div>
                    ) : (
                      <pre className="overflow-x-auto text-[11px] text-stone-800 dark:text-stone-200 max-h-64">
                        {JSON.stringify(queryResult.rows, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EXPORT SQL DUMP */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Backup Completo do Banco de Dados SQL</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Exporta o schema DDL completo com todas as instruções `INSERT INTO`
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyDump}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedDump ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDump ? 'Copiado!' : 'Copiar SQL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadDump}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#72092c] to-[#9e1b45] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-95 active:scale-95 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Arquivo .sql</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-stone-900 p-4 border border-stone-800 font-mono text-[11px] text-amber-300 overflow-x-auto max-h-[400px]">
                <pre>{sqlDump}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: MANUAL INSERT INTO USERS */}
          {activeTab === 'insert' && (
            <form onSubmit={handleInsertSubmit} className="max-w-md mx-auto space-y-4 py-2">
              <div className="text-center mb-4">
                <h4 className="font-bold text-sm">Inserir Novo Registro SQL Manualmente</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Executa `INSERT INTO users (...) VALUES (...)`
                </p>
              </div>

              {insertMessage && (
                <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold">
                  {insertMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase mb-1">
                  Nome do Usuário *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: João Silva"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#72092c]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase mb-1">
                  Endereço de E-mail *
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="joao@exemplo.com"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#72092c]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase mb-1">
                  Senha *
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Senha123"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#72092c]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase mb-1">
                  Nome do Parceiro(a) (Opcional)
                </label>
                <input
                  type="text"
                  value={newPartner}
                  onChange={(e) => setNewPartner(e.target.value)}
                  placeholder="Ex: Maria Santos"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#72092c]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#72092c] to-[#9e1b45] text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Executar INSERT INTO users</span>
              </button>
            </form>
          )}

        </div>
      </motion.div>
    </div>
  );
};
