import React, { useState, useEffect } from 'react';
import { 
  Database, 
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
  ArrowLeft,
  Sun,
  Moon,
  Lock,
  Heart,
  Star,
  Crown,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldAlert,
  Wrench,
  ExternalLink
} from 'lucide-react';
import { sqlDb, type SqlUserRecord, type SqlQueryResult, type SqlFeedbackRecord } from '../services/sqlDatabase';
import { hashPassword } from '../utils/cryptoUtils';
import { CHECKOUT_PLANS, type CheckoutPlan } from '../constants/plansData';
import { type TrialStatus } from '../utils/trialManager';

interface AdminDatabasePageProps {
  onBackToApp: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  activePlan?: CheckoutPlan | null;
  onSetActivePlan?: (plan: CheckoutPlan | null) => void;
  trialStatus?: TrialStatus;
  onSimulateExpireTrial?: () => void;
  onResetTrial?: () => void;
  onOpenPlansPage?: () => void;
  onOpenCouplePage?: () => void;
}

export const AdminDatabasePage: React.FC<AdminDatabasePageProps> = ({
  onBackToApp,
  darkMode = false,
  onToggleDarkMode,
  activePlan = null,
  onSetActivePlan,
  trialStatus,
  onSimulateExpireTrial,
  onResetTrial,
  onOpenPlansPage,
  onOpenCouplePage,
}) => {
  const [activeTab, setActiveTab] = useState<'table' | 'feedbacks' | 'query' | 'export' | 'insert' | 'test_plans'>('table');
  const [users, setUsers] = useState<SqlUserRecord[]>([]);
  const [feedbacks, setFeedbacks] = useState<SqlFeedbackRecord[]>([]);
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
      const fbData = await sqlDb.selectAllFeedbacks();
      setFeedbacks(fbData);
      const dump = await sqlDb.exportSqlDump();
      setSqlDump(dump);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    sqlDb.selectAllUsers().then((data) => {
      if (isMounted) setUsers(data);
    }).catch(console.error);

    sqlDb.selectAllFeedbacks().then((data) => {
      if (isMounted) setFeedbacks(data);
    }).catch(console.error);

    sqlDb.exportSqlDump().then((dump) => {
      if (isMounted) setSqlDump(dump);
    }).catch(console.error);

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteUser = async (id: string, name: string) => {
    if (window.confirm(`Deseja realmente excluir o registro de "${name}" do banco de dados SQL?`)) {
      await sqlDb.deleteUser(id);
      await loadData();
    }
  };

  const handleDeleteFeedback = async (id: string, names: string) => {
    if (window.confirm(`Deseja realmente excluir o depoimento de "${names}" do banco de dados?`)) {
      await sqlDb.deleteFeedback(id);
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
      const securePasswordHash = await hashPassword(newPassword);
      await sqlDb.insertUser({
        name: newName,
        email: newEmail,
        passwordHash: securePasswordHash,
        partnerName: newPartner || undefined,
      });
      setInsertMessage('✅ Registro inserido com sucesso via INSERT INTO users (com Hash Criptográfico SHA-256)!');
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

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-stone-800 bg-stone-950/90 backdrop-blur px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/40">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Painel do Banco de Dados SQL
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-900/60 text-emerald-300 border border-emerald-600/40">
                SQL Engine Ativo
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Cartório do Amor • Gestão Externa de Dados, Queries & Dumps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-stone-400 hover:text-white bg-stone-900 border border-stone-800 hover:border-stone-700 transition-colors"
              title="Alternar Tema"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-300" />}
            </button>
          )}

          <button
            type="button"
            onClick={onBackToApp}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Cartório</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'table'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Tabela: users ({users.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('feedbacks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'feedbacks'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
              <span>Tabela: feedbacks ({feedbacks.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('query')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'query'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Console SQL Interativo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'export'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Exportar Dump SQL (.sql)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('insert')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'insert'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Inserir Registro Manual</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('test_plans')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'test_plans'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/40 ring-2 ring-amber-400/50'
                  : 'bg-stone-800/80 text-amber-400/90 hover:text-amber-300 hover:bg-stone-800 border border-amber-500/30'
              }`}
            >
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>🛠️ Testes & Simulador de Planos</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors"
              title="Recarregar dados do banco"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Atualizar Dados</span>
            </button>
          </div>
        </div>

        {/* TAB 1: USERS TABLE */}
        {activeTab === 'table' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-950 p-3.5 rounded-2xl border border-stone-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome, e-mail ou parceiro..."
                  className="w-full pl-9 pr-4 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 text-xs text-stone-400">
                <span>Total de registros: <strong className="text-white">{filteredUsers.length}</strong></span>
                <span className="text-stone-700">•</span>
                <span>Tabela primária: <code className="text-emerald-400 font-mono">public.users</code></span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-stone-800 bg-stone-950 shadow-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-800 bg-stone-900/80 text-stone-400 font-mono uppercase tracking-wider text-[11px]">
                    <th className="p-3 pl-4">ID (UUID)</th>
                    <th className="p-3">Nome do Usuário</th>
                    <th className="p-3">E-mail (Unique)</th>
                    <th className="p-3">Hash da Senha</th>
                    <th className="p-3">Cônjuge / Parceiro</th>
                    <th className="p-3">Data de Criação</th>
                    <th className="p-3 text-right pr-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-sans">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-stone-500">
                        Nenhum registro encontrado na tabela <code className="font-mono text-stone-400">users</code>.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-stone-900/50 transition-colors">
                        <td className="p-3 pl-4 font-mono text-[11px] text-stone-400 select-all">
                          {user.id}
                        </td>
                        <td className="p-3 font-semibold text-white">
                          {user.name}
                        </td>
                        <td className="p-3 font-mono text-emerald-400 select-all">
                          {user.email}
                        </td>
                        <td className="p-3 font-mono text-stone-300">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900 border border-emerald-950 text-[11px] text-emerald-400 font-mono tracking-tight select-all">
                            <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span title={user.password_hash}>
                              {user.password_hash.startsWith('$sha256$')
                                ? user.password_hash.substring(0, 20) + '...'
                                : '$sha256$' + user.password_hash.substring(0, 12) + '...'}
                            </span>
                          </span>
                        </td>
                        <td className="p-3 text-stone-300">
                          {user.partner_name || <span className="text-stone-600 italic">Não informado</span>}
                        </td>
                        <td className="p-3 font-mono text-stone-400 text-[11px]">
                          {user.created_at ? new Date(user.created_at).toLocaleString('pt-BR') : '-'}
                        </td>
                        <td className="p-3 text-right pr-4">
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/50 transition-colors"
                            title="Deletar registro via DELETE FROM users WHERE id = ..."
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 1.5: FEEDBACKS TABLE */}
        {activeTab === 'feedbacks' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-950 p-3.5 rounded-2xl border border-stone-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por casal, cidade ou depoimento..."
                  className="w-full pl-9 pr-4 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-3 text-xs text-stone-400">
                <span>Total de avaliações: <strong className="text-white">{feedbacks.length}</strong></span>
                <span className="text-stone-700">•</span>
                <span>Tabela: <code className="text-rose-400 font-mono">public.feedbacks</code></span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-stone-800 bg-stone-950 shadow-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-800 bg-stone-900/80 text-stone-400 font-mono uppercase tracking-wider text-[11px]">
                    <th className="p-3 pl-4">ID</th>
                    <th className="p-3">Casal</th>
                    <th className="p-3">Cidade / Tempo</th>
                    <th className="p-3">Nota</th>
                    <th className="p-3">Depoimento Oficial</th>
                    <th className="p-3">Plano</th>
                    <th className="p-3">Curtidas</th>
                    <th className="p-3 text-right pr-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-sans">
                  {feedbacks.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-stone-500">
                        Nenhum depoimento encontrado na tabela <code className="font-mono text-stone-400">feedbacks</code>.
                      </td>
                    </tr>
                  ) : (
                    feedbacks
                      .filter(
                        (f) =>
                          f.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.comment.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((fb) => (
                        <tr key={fb.id} className="hover:bg-stone-900/50 transition-colors">
                          <td className="p-3 pl-4 font-mono text-[11px] text-stone-400 select-all">
                            {fb.id}
                          </td>
                          <td className="p-3 font-bold text-white">
                            {fb.names}
                          </td>
                          <td className="p-3 text-stone-300">
                            <div>{fb.city}</div>
                            <span className="text-[10px] text-stone-500">{fb.time}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex text-amber-400">
                              {[...Array(fb.stars || 5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                              ))}
                            </div>
                          </td>
                          <td className="p-3 text-stone-300 max-w-xs truncate italic" title={fb.comment}>
                            "{fb.comment}"
                          </td>
                          <td className="p-3 text-[11px] text-stone-400">
                            {fb.plan || 'Membro VIP'}
                          </td>
                          <td className="p-3 font-bold text-rose-400">
                            ❤️ {fb.likes || 1}
                          </td>
                          <td className="p-3 text-right pr-4">
                            <button
                              type="button"
                              onClick={() => handleDeleteFeedback(fb.id, fb.names)}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/50 transition-colors cursor-pointer"
                              title="Deletar depoimento via DELETE FROM feedbacks WHERE id = ..."
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SQL QUERY CONSOLE */}
        {activeTab === 'query' && (
          <div className="flex flex-col gap-4">
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Editor de Consultas SQL</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRawQuery('SELECT * FROM users ORDER BY created_at DESC;')}
                    className="text-[11px] font-mono px-2 py-1 rounded bg-stone-900 text-stone-300 hover:bg-stone-800"
                  >
                    SELECT *
                  </button>
                  <button
                    type="button"
                    onClick={() => setRawQuery("SELECT count(*) as total_usuarios FROM users;")}
                    className="text-[11px] font-mono px-2 py-1 rounded bg-stone-900 text-stone-300 hover:bg-stone-800"
                  >
                    COUNT(*)
                  </button>
                </div>
              </div>

              <textarea
                value={rawQuery}
                onChange={(e) => setRawQuery(e.target.value)}
                rows={4}
                className="w-full p-3 font-mono text-xs sm:text-sm bg-stone-900 border border-stone-800 rounded-xl text-emerald-300 placeholder:text-stone-600 focus:outline-none focus:border-emerald-500"
                placeholder="Escreva sua query SQL aqui..."
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleExecuteQuery}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Executar Consulta SQL</span>
                </button>
              </div>
            </div>

            {queryResult && (
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`w-2 h-2 rounded-full ${queryResult.success ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="font-bold text-white">{queryResult.command}</span>
                    <span className="text-stone-500">•</span>
                    <span className="text-stone-400 font-mono">{queryResult.rowCount} linha(s) afetada(s)</span>
                    <span className="text-stone-500">•</span>
                    <span className="text-stone-400 font-mono">{queryResult.executionTimeMs} ms</span>
                  </div>
                </div>

                {queryResult.error ? (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono">
                    {queryResult.error}
                  </div>
                ) : (
                  <pre className="p-3 bg-stone-900 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto max-h-80">
                    {JSON.stringify(queryResult.rows, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EXPORT SQL DUMP */}
        {activeTab === 'export' && (
          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Exportação Completa de Dados & DDL</h3>
                <p className="text-xs text-stone-400">Schema oficial da tabela users com todas as instruções INSERT</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyDump}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all"
                >
                  {copiedDump ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDump ? 'Copiado!' : 'Copiar SQL'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadDump}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Arquivo .sql</span>
                </button>
              </div>
            </div>

            <textarea
              readOnly
              value={sqlDump}
              rows={14}
              className="w-full p-4 font-mono text-xs bg-stone-900 border border-stone-800 rounded-xl text-emerald-400/90 select-all"
            />
          </div>
        )}

        {/* TAB 4: MANUAL INSERT */}
        {activeTab === 'insert' && (
          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 max-w-xl mx-auto w-full">
            <h3 className="text-base font-bold text-white mb-1">Inserir Novo Registro no Banco SQL</h3>
            <p className="text-xs text-stone-400 mb-6">Executa diretamente a instrução <code className="font-mono text-emerald-400">INSERT INTO users</code></p>

            {insertMessage && (
              <div className="mb-4 p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs font-medium text-stone-200">
                {insertMessage}
              </div>
            )}

            <form onSubmit={handleInsertSubmit} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-stone-400 font-bold uppercase mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-bold uppercase mb-1">E-mail *</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Ex: joao@email.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-bold uppercase mb-1">Senha *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-bold uppercase mb-1">Nome do Cônjuge / Parceiro(a)</label>
                <input
                  type="text"
                  value={newPartner}
                  onChange={(e) => setNewPartner(e.target.value)}
                  placeholder="Ex: Maria Souza"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
              >
                {isLoading ? 'Inserindo...' : 'Executar INSERT INTO users'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 6: PLAN SIMULATOR & DEV TESTING SUITE (EXCLUSIVE FOR MARCOS) */}
        {activeTab === 'test_plans' && (
          <div className="flex flex-col gap-6 max-w-4xl">
            <div className="bg-gradient-to-r from-amber-950/40 via-stone-900 to-stone-900 border-2 border-amber-500/40 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base sm:text-lg">
                <Wrench className="w-5 h-5 text-amber-400" />
                <h2>Simulador de Planos & Testes do Sistema (Área Restrita do Admin)</h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Use este painel para simular e testar instantaneamente qualquer plano ou status de teste grátis como se você fosse um cliente final. <strong>Todas estas ferramentas são 100% restritas a esta página administrativa</strong> e não aparecem na interface pública do cliente.
              </p>
            </div>

            {/* Current Simulation State */}
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Estado Atual da Simulação no Navegador:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[11px] text-stone-400 block mb-1">Plano Ativo Simulado:</span>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    {activePlan ? (
                      <>
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300">{activePlan.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          R$ {activePlan.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-stone-400">Nenhum (Sem Plano Pago)</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-[11px] text-stone-400 block mb-1">Status do Teste Grátis (30 Dias):</span>
                  <div className="text-base font-bold flex items-center gap-2">
                    {trialStatus?.isActive ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-300">Ativo ({trialStatus.daysRemaining} dias restantes)</span>
                        <span className="text-[11px] text-stone-400 font-normal">Até {trialStatus.endDateFormatted}</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span className="text-rose-400">Expirado / Esgotado</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Switch Simulation Actions */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Clique para Simular Cada Perfil de Cliente:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 1. Sem Plano / Expirado */}
                <button
                  type="button"
                  onClick={() => {
                    if (onSetActivePlan) onSetActivePlan(null);
                    if (onSimulateExpireTrial) onSimulateExpireTrial();
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all active:scale-98 ${
                    !activePlan && trialStatus?.isExpired
                      ? 'bg-rose-950/80 border-rose-500 text-rose-100 ring-2 ring-rose-400'
                      : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-rose-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      Sem Plano (Expirado)
                    </span>
                    {!activePlan && trialStatus?.isExpired && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500 text-white">Ativo</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Downloads bloqueados. Ao clicar em baixar ou salvar, exige a contratação de um plano via Pix.
                  </p>
                </button>

                {/* 2. 30 Dias Grátis Ativo */}
                <button
                  type="button"
                  onClick={() => {
                    if (onSetActivePlan) onSetActivePlan(null);
                    if (onResetTrial) onResetTrial();
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all active:scale-98 ${
                    !activePlan && trialStatus?.isActive
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100 ring-2 ring-emerald-400'
                      : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      30 Dias Grátis Ativo
                    </span>
                    {!activePlan && trialStatus?.isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white">Ativo</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Estado inicial de novos clientes. Permite salvar, editar e emitir certidões gratuitamente por 30 dias.
                  </p>
                </button>

                {/* 3. Plano 1: Digital */}
                <button
                  type="button"
                  onClick={() => {
                    if (onSetActivePlan) onSetActivePlan(CHECKOUT_PLANS[0]);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all active:scale-98 ${
                    activePlan?.id === 'essencial'
                      ? 'bg-blue-950/80 border-blue-500 text-blue-100 ring-2 ring-blue-400'
                      : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-blue-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      1. Digital (R$ 9,90)
                    </span>
                    {activePlan?.id === 'essencial' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500 text-white">Ativo</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Certidão Oficial em PDF 300 DPI. Recursos extras (IA de votos e Música do casal) continuam bloqueados.
                  </p>
                </button>

                {/* 4. Plano 2: Combo VIP */}
                <button
                  type="button"
                  onClick={() => {
                    if (onSetActivePlan) onSetActivePlan(CHECKOUT_PLANS[1]);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all active:scale-98 ${
                    activePlan?.id === 'vip'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-100 ring-2 ring-amber-400'
                      : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                      <Crown className="w-4 h-4" />
                      2. Combo VIP (R$ 19,90)
                    </span>
                    {activePlan?.id === 'vip' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-white">Ativo</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    PDF oficial em 300 DPI + IA ilimitada para votos poéticos + Trilha Sonora na certidão (Página Web do Casal em Modo Prévia).
                  </p>
                </button>

                {/* 5. Plano 3: Pack Eterno */}
                <button
                  type="button"
                  onClick={() => {
                    if (onSetActivePlan) onSetActivePlan(CHECKOUT_PLANS[2]);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all active:scale-98 ${
                    activePlan?.id === 'completo'
                      ? 'bg-purple-950/80 border-purple-500 text-purple-100 ring-2 ring-purple-400'
                      : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-purple-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      3. Pack Eterno (R$ 29,90)
                    </span>
                    {activePlan?.id === 'completo' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500 text-white">Ativo</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Tudo incluso + Página Web Interativa do Casal Oficial 100% liberada + os 3 Documentos de Amor (Certidão Oficial, Contrato de Namoro e RG).
                  </p>
                </button>
              </div>
            </div>

            {/* Test Navigation Shortcuts */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Navegar e Testar no Cartório com o Perfil Simulado:
              </h3>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={onBackToApp}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold flex items-center gap-2 border border-stone-700 transition-all active:scale-95"
                >
                  <span>Voltar ao Editor Principal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {onOpenPlansPage && (
                  <button
                    type="button"
                    onClick={onOpenPlansPage}
                    className="px-4 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs font-bold flex items-center gap-2 border border-amber-500/40 transition-all active:scale-95"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Ver Vitrine de Planos (?view=planos)</span>
                  </button>
                )}

                {onOpenCouplePage && (
                  <button
                    type="button"
                    onClick={onOpenCouplePage}
                    className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-bold flex items-center gap-2 border border-rose-500/40 transition-all active:scale-95"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Ver Página do Casal (?view=casal)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
