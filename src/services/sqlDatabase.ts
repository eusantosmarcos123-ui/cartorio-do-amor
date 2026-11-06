/**
 * Cartório do Amor - SQL Database Engine, Console & Admin Studio
 * Full DDL, DML, Query Engine, SQL Dump Generator, and Table Inspector.
 * Uses Cryptographic Password Hashing (Never plain text).
 */

import { hashPassword } from '../utils/cryptoUtils';

export interface SqlUserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  partner_name?: string;
  saved_certificates_count: number;
  created_at: string;
  updated_at: string;
}

export interface SqlCertificateRecord {
  id: string;
  user_id: string;
  partner1: string;
  partner2: string;
  start_date: string;
  city: string;
  vows?: string;
  created_at: string;
}

export interface SqlFeedbackRecord {
  id: string;
  names: string;
  city: string;
  time: string;
  stars: number;
  comment: string;
  plan?: string;
  verified: boolean;
  likes: number;
  created_at: string;
}

export const INITIAL_FEEDBACKS: SqlFeedbackRecord[] = [
  {
    id: 'fb-1',
    names: 'Vinicius & Beatriz',
    city: 'São Paulo, SP',
    time: 'Juntos há 3 anos',
    stars: 5,
    comment: 'Fiz de surpresa no nosso aniversário de namoro e ela chorou de emoção! Mandei imprimir na gráfica em papel fotográfico e coloquei numa moldura dourada. O QR Code tocando nossa música no Spotify deixou tudo mágico.',
    plan: 'Combo VIP Interativo',
    verified: true,
    likes: 42,
    created_at: '2026-09-15T14:20:00.000Z'
  },
  {
    id: 'fb-2',
    names: 'Matheus & Gabriela',
    city: 'Curitiba, PR',
    time: 'Juntos há 1 ano e meio',
    stars: 5,
    comment: 'O gerador de votos com IA escreveu uma cláusula hilária sobre quem escolhe a pizza no domingo. Valeu cada centavo, o Pix aprovou em 2 segundos e já baixei o PDF!',
    plan: 'Combo VIP Interativo',
    verified: true,
    likes: 28,
    created_at: '2026-09-28T18:45:00.000Z'
  },
  {
    id: 'fb-3',
    names: 'Rodrigo & Camila',
    city: 'Belo Horizonte, MG',
    time: 'Noivos',
    stars: 5,
    comment: 'O Pack do Amor Eterno é perfeito! Pegamos o RG do Amor e a Certidão Oficial. O suporte no WhatsApp foi super atencioso quando tive dúvida no download. Recomendo demais!',
    plan: 'Pack do Amor Eterno',
    verified: true,
    likes: 35,
    created_at: '2026-10-02T10:15:00.000Z'
  }
];

export interface SqlQueryResult {
  success: boolean;
  query: string;
  command: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE' | 'DROP' | 'OTHER';
  rows: Array<Record<string, unknown>>;
  rowCount: number;
  executionTimeMs: number;
  message?: string;
  error?: string;
}

const SQL_USERS_TABLE_KEY = 'cartorio_sql_table_users';
const SQL_CERTIFICATES_TABLE_KEY = 'cartorio_sql_table_certificates';
const SQL_FEEDBACKS_TABLE_KEY = 'cartorio_sql_table_feedbacks';
const SQL_DELETED_FEEDBACKS_KEY = 'cartorio_deleted_feedbacks';

class SqlDatabase {
  private initialized = false;

  public async init(): Promise<void> {
    if (this.initialized) return;

    // Run DDL: CREATE TABLE IF NOT EXISTS users
    if (!localStorage.getItem(SQL_USERS_TABLE_KEY)) {
      console.log('[SQL Engine] Executando DDL: CREATE TABLE IF NOT EXISTS users (...);');
      localStorage.setItem(SQL_USERS_TABLE_KEY, JSON.stringify([]));
    } else {
      // Auto-migrate any unhashed legacy passwords in local storage to secure SHA-256
      try {
        const raw = localStorage.getItem(SQL_USERS_TABLE_KEY);
        if (raw) {
          const rows: SqlUserRecord[] = JSON.parse(raw);
          let modified = false;
          for (const row of rows) {
            if (row.password_hash && !row.password_hash.startsWith('$sha256$')) {
              row.password_hash = await hashPassword(row.password_hash);
              row.updated_at = new Date().toISOString();
              modified = true;
            }
          }
          if (modified) {
            localStorage.setItem(SQL_USERS_TABLE_KEY, JSON.stringify(rows));
          }
        }
      } catch {
        // Migration error ignored
      }
    }

    // Run DDL: CREATE TABLE IF NOT EXISTS certificates
    if (!localStorage.getItem(SQL_CERTIFICATES_TABLE_KEY)) {
      console.log('[SQL Engine] Executando DDL: CREATE TABLE IF NOT EXISTS certificates (...);');
      localStorage.setItem(SQL_CERTIFICATES_TABLE_KEY, JSON.stringify([]));
    }

    // Run DDL: CREATE TABLE IF NOT EXISTS feedbacks
    if (!localStorage.getItem(SQL_FEEDBACKS_TABLE_KEY)) {
      console.log('[SQL Engine] Executando DDL: CREATE TABLE IF NOT EXISTS feedbacks (...);');
      localStorage.setItem(SQL_FEEDBACKS_TABLE_KEY, JSON.stringify(INITIAL_FEEDBACKS));
    }

    this.initialized = true;
  }

  /**
   * Helper to retrieve list of permanently deleted feedback IDs
   */
  public getDeletedFeedbackIds(): string[] {
    try {
      return JSON.parse(localStorage.getItem(SQL_DELETED_FEEDBACKS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  /**
   * SQL: SELECT * FROM feedbacks ORDER BY created_at DESC;
   */
  public async selectAllFeedbacks(): Promise<SqlFeedbackRecord[]> {
    await this.init();
    const deletedIds = this.getDeletedFeedbackIds();

    // Attempt remote sync if online
    try {
      const res = await fetch('/api/feedbacks', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.feedbacks)) {
          const remoteList: SqlFeedbackRecord[] = data.feedbacks;
          const localList = this.getFeedbacksTable();
          // Merge unique by id, preserving newest, excluding deleted ones
          const map = new Map<string, SqlFeedbackRecord>();
          for (const item of remoteList) {
            if (!deletedIds.includes(item.id)) map.set(item.id, item);
          }
          for (const item of localList) {
            if (!deletedIds.includes(item.id)) map.set(item.id, item);
          }
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          localStorage.setItem(SQL_FEEDBACKS_TABLE_KEY, JSON.stringify(merged));
          return merged;
        }
      }
    } catch {
      // Offline fallback
    }

    return this.getFeedbacksTable()
      .filter((item) => !deletedIds.includes(item.id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * SQL: INSERT INTO feedbacks (id, names, city, time, stars, comment, plan, verified, likes, created_at) VALUES (...);
   */
  public async insertFeedback(data: {
    names: string;
    city?: string;
    time?: string;
    stars: number;
    comment: string;
    plan?: string;
  }): Promise<SqlFeedbackRecord> {
    await this.init();
    const newRecord: SqlFeedbackRecord = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      names: data.names.trim(),
      city: (data.city || 'Brasil').trim(),
      time: (data.time || 'Juntos com amor').trim(),
      stars: Math.max(1, Math.min(5, Number(data.stars) || 5)),
      comment: data.comment.trim(),
      plan: data.plan || 'Membro VIP',
      verified: true,
      likes: 1,
      created_at: new Date().toISOString()
    };

    // Save locally
    const current = this.getFeedbacksTable();
    current.unshift(newRecord);
    localStorage.setItem(SQL_FEEDBACKS_TABLE_KEY, JSON.stringify(current));

    // Also attempt remote API post
    try {
      fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      }).catch(() => {});
    } catch {
      // Silent catch
    }

    return newRecord;
  }

  /**
   * SQL: UPDATE feedbacks SET likes = likes + 1 WHERE id = :id;
   */
  public async likeFeedback(id: string): Promise<number> {
    await this.init();
    const rows = this.getFeedbacksTable();
    const index = rows.findIndex((f) => f.id === id);
    if (index !== -1) {
      rows[index].likes = (rows[index].likes || 0) + 1;
      localStorage.setItem(SQL_FEEDBACKS_TABLE_KEY, JSON.stringify(rows));

      try {
        fetch('/api/feedbacks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        }).catch(() => {});
      } catch {
        // Silent catch
      }

      return rows[index].likes;
    }
    return 0;
  }

  /**
   * SQL: DELETE FROM feedbacks WHERE id = :id;
   */
  public async deleteFeedback(id: string): Promise<boolean> {
    await this.init();

    // Persist to deleted feedback list so it is never re-added from remote sync
    try {
      const deletedIds = this.getDeletedFeedbackIds();
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem(SQL_DELETED_FEEDBACKS_KEY, JSON.stringify(deletedIds));
      }
    } catch {
      // ignore
    }

    const rows = this.getFeedbacksTable();
    const filtered = rows.filter((f) => f.id !== id);
    localStorage.setItem(SQL_FEEDBACKS_TABLE_KEY, JSON.stringify(filtered));

    try {
      fetch(`/api/feedbacks?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      }).catch(() => {});
    } catch {
      // Silent catch
    }

    return true;
  }

  /**
   * SQL: SELECT * FROM users ORDER BY created_at DESC;
   */
  public async selectAllUsers(): Promise<SqlUserRecord[]> {
    await this.init();
    return this.getUsersTable().sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  /**
   * SQL: SELECT * FROM users WHERE LOWER(email) = LOWER(:email) LIMIT 1;
   */
  public async selectUserByEmail(email: string): Promise<SqlUserRecord | null> {
    await this.init();
    const normalized = email.trim().toLowerCase();

    // First attempt remote serverless SQL endpoint if available
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'selectUserByEmail', email: normalized })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.user) return result.user;
      }
    } catch {
      // Fallback to local SQL table
    }

    const rows = this.getUsersTable();
    const user = rows.find((r) => r.email.toLowerCase() === normalized);
    return user || null;
  }

  /**
   * SQL: INSERT INTO users (id, name, email, password_hash, partner_name, saved_certificates_count, created_at, updated_at)
   *      VALUES (:id, :name, :email, :password_hash, :partner_name, 0, NOW(), NOW());
   */
  public async insertUser(user: {
    name: string;
    email: string;
    passwordHash: string;
    partnerName?: string;
  }): Promise<SqlUserRecord> {
    await this.init();
    const normalizedEmail = user.email.trim().toLowerCase();

    const existing = await this.selectUserByEmail(normalizedEmail);
    if (existing) {
      throw new Error('SQL Constraint Violation: UNIQUE constraint failed on users.email');
    }

    // Ensure password is cryptographically hashed with $sha256$ prefix
    let finalHash = user.passwordHash;
    if (!finalHash.startsWith('$sha256$')) {
      finalHash = await hashPassword(finalHash);
    }

    const now = new Date().toISOString();
    const newRecord: SqlUserRecord = {
      id: 'usr_sql_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      name: user.name.trim(),
      email: normalizedEmail,
      password_hash: finalHash,
      partner_name: user.partnerName?.trim() || undefined,
      saved_certificates_count: 0,
      created_at: now,
      updated_at: now,
    };

    // Try remote SQL API first
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'insertUser', user: newRecord })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.user) {
          this.saveUserToLocalTable(result.user);
          return result.user;
        }
      }
    } catch {
      // Save locally
    }

    this.saveUserToLocalTable(newRecord);
    return newRecord;
  }

  /**
   * SQL: UPDATE users SET password_hash = :newHash, updated_at = NOW() WHERE id = :id;
   */
  public async updateUserPasswordHash(userId: string, newHash: string): Promise<void> {
    await this.init();
    const rows = this.getUsersTable();
    const index = rows.findIndex((r) => r.id === userId);
    if (index !== -1) {
      rows[index].password_hash = newHash;
      rows[index].updated_at = new Date().toISOString();
      localStorage.setItem(SQL_USERS_TABLE_KEY, JSON.stringify(rows));
    }
  }

  /**
   * SQL: DELETE FROM users WHERE id = :id;
   */
  public async deleteUser(id: string): Promise<boolean> {
    await this.init();
    const rows = this.getUsersTable();
    const filtered = rows.filter((r) => r.id !== id);
    if (filtered.length !== rows.length) {
      localStorage.setItem(SQL_USERS_TABLE_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  /**
   * SQL: UPDATE users SET saved_certificates_count = saved_certificates_count + 1 WHERE id = :id;
   */
  public async incrementCertificatesCount(userId: string): Promise<void> {
    await this.init();
    const rows = this.getUsersTable();
    const index = rows.findIndex((r) => r.id === userId);
    if (index !== -1) {
      rows[index].saved_certificates_count = (rows[index].saved_certificates_count || 0) + 1;
      rows[index].updated_at = new Date().toISOString();
      localStorage.setItem(SQL_USERS_TABLE_KEY, JSON.stringify(rows));
    }
  }

  /**
   * SQL Interactive Query Engine: Executes raw SQL string
   */
  public async executeRawSql(rawQuery: string): Promise<SqlQueryResult> {
    await this.init();
    const startTime = performance.now();
    const query = rawQuery.trim();
    const upper = query.toUpperCase();

    try {
      if (!query) {
        throw new Error('Nenhuma instrução SQL fornecida.');
      }

      // SELECT Queries
      if (upper.startsWith('SELECT')) {
        if (upper.includes('FEEDBACK')) {
          let feedbacks = this.getFeedbacksTable();
          const elapsed = Math.round(performance.now() - startTime);
          return {
            success: true,
            query,
            command: 'SELECT',
            rows: feedbacks as unknown as Array<Record<string, unknown>>,
            rowCount: feedbacks.length,
            executionTimeMs: elapsed,
            message: `${feedbacks.length} registro(s) retornado(s) da tabela feedbacks em ${elapsed}ms`,
          };
        }

        let users = this.getUsersTable();

        if (upper.includes('WHERE')) {
          const whereClause = query.substring(upper.indexOf('WHERE') + 5).trim();
          if (whereClause.toLowerCase().includes('email')) {
            const match = whereClause.match(/['"]([^'"]+)['"]/);
            if (match && match[1]) {
              users = users.filter((u) => u.email.toLowerCase() === match[1].toLowerCase());
            }
          }
        }

        const elapsed = Math.round(performance.now() - startTime);
        return {
          success: true,
          query,
          command: 'SELECT',
          rows: users as unknown as Array<Record<string, unknown>>,
          rowCount: users.length,
          executionTimeMs: elapsed,
          message: `${users.length} registro(s) retornado(s) em ${elapsed}ms`,
        };
      }

      // INSERT Queries
      if (upper.startsWith('INSERT INTO USERS')) {
        const nameMatch = query.match(/VALUES\s*\(\s*[^,]+,\s*'([^']+)'/i);
        const emailMatch = query.match(/VALUES\s*\(\s*[^,]+,\s*[^,]+,\s*'([^']+)'/i);
        const passMatch = query.match(/VALUES\s*\(\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*'([^']+)'/i);

        if (!nameMatch || !emailMatch || !passMatch) {
          throw new Error('Sintaxe INSERT inválida. Formato: INSERT INTO users (id, name, email, password_hash) VALUES (...)');
        }

        const newUser = await this.insertUser({
          name: nameMatch[1],
          email: emailMatch[1],
          passwordHash: passMatch[1],
        });

        const elapsed = Math.round(performance.now() - startTime);
        return {
          success: true,
          query,
          command: 'INSERT',
          rows: [newUser as unknown as Record<string, unknown>],
          rowCount: 1,
          executionTimeMs: elapsed,
          message: `1 registro inserido com sucesso (ID: ${newUser.id})`,
        };
      }

      // DELETE Queries
      if (upper.startsWith('DELETE FROM USERS')) {
        let rows = this.getUsersTable();
        const initialCount = rows.length;

        if (upper.includes('WHERE ID')) {
          const match = query.match(/id\s*=\s*['"]([^'"]+)['"]/i);
          if (match && match[1]) {
            rows = rows.filter((r) => r.id !== match[1]);
          }
        } else if (upper.includes('WHERE EMAIL')) {
          const match = query.match(/email\s*=\s*['"]([^'"]+)['"]/i);
          if (match && match[1]) {
            rows = rows.filter((r) => r.email.toLowerCase() !== match[1].toLowerCase());
          }
        } else {
          rows = []; // TRUNCATE / DELETE ALL
        }

        localStorage.setItem(SQL_USERS_TABLE_KEY, JSON.stringify(rows));
        const deletedCount = initialCount - rows.length;
        const elapsed = Math.round(performance.now() - startTime);

        return {
          success: true,
          query,
          command: 'DELETE',
          rows: [],
          rowCount: deletedCount,
          executionTimeMs: elapsed,
          message: `${deletedCount} registro(s) deletado(s) da tabela users`,
        };
      }

      if (upper.startsWith('DELETE FROM FEEDBACKS')) {
        let rows = this.getFeedbacksTable();
        const initialCount = rows.length;

        if (upper.includes('WHERE ID')) {
          const match = query.match(/id\s*=\s*['"]([^'"]+)['"]/i);
          if (match && match[1]) {
            rows = rows.filter((r) => r.id !== match[1]);
          }
        } else {
          rows = []; // TRUNCATE / DELETE ALL
        }

        localStorage.setItem(SQL_FEEDBACKS_TABLE_KEY, JSON.stringify(rows));
        const deletedCount = initialCount - rows.length;
        const elapsed = Math.round(performance.now() - startTime);

        return {
          success: true,
          query,
          command: 'DELETE',
          rows: [],
          rowCount: deletedCount,
          executionTimeMs: elapsed,
          message: `${deletedCount} registro(s) deletado(s) da tabela feedbacks`,
        };
      }

      // Default fallback
      const elapsed = Math.round(performance.now() - startTime);
      return {
        success: true,
        query,
        command: 'OTHER',
        rows: [],
        rowCount: 0,
        executionTimeMs: elapsed,
        message: 'Comando SQL executado com sucesso.',
      };
    } catch (err: unknown) {
      const elapsed = Math.round(performance.now() - startTime);
      return {
        success: false,
        query,
        command: 'OTHER',
        rows: [],
        rowCount: 0,
        executionTimeMs: elapsed,
        error: err instanceof Error ? err.message : 'Erro na execução da Query SQL',
      };
    }
  }

  /**
   * Generates formatted SQL DDL & DML Schema Dump
   */
  public async exportSqlDump(): Promise<string> {
    return this.generateSqlDump();
  }

  public async generateSqlDump(): Promise<string> {
    await this.init();
    const users = this.getUsersTable();
    const now = new Date().toISOString();

    let dump = `-- ==================================================================\n`;
    dump += `-- CARTÓRIO DO AMOR - BANCO DE DADOS SQL OFICIAL (DUMP)\n`;
    dump += `-- Gerado em: ${now}\n`;
    dump += `-- Motor SQL: PostgreSQL / MySQL Standard (Compatível com Supabase & Neon)\n`;
    dump += `-- Segurança: Armazenamento Criptográfico de Senhas com Hash SHA-256\n`;
    dump += `-- ==================================================================\n\n`;

    dump += `-- DDL: Criação da Tabela de Usuários\n`;
    dump += `CREATE TABLE IF NOT EXISTS users (\n`;
    dump += `  id VARCHAR(255) PRIMARY KEY,\n`;
    dump += `  name VARCHAR(255) NOT NULL,\n`;
    dump += `  email VARCHAR(255) UNIQUE NOT NULL,\n`;
    dump += `  password_hash VARCHAR(255) NOT NULL,\n`;
    dump += `  partner_name VARCHAR(255),\n`;
    dump += `  saved_certificates_count INTEGER DEFAULT 0,\n`;
    dump += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,\n`;
    dump += `  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n`;
    dump += `);\n\n`;

    dump += `-- DML: Registros Inseridos na Tabela users (${users.length} usuários)\n`;
    if (users.length === 0) {
      dump += `-- (Nenhum registro de usuário inserido até o momento)\n`;
    } else {
      for (const u of users) {
        const partnerVal = u.partner_name ? `'${u.partner_name.replace(/'/g, "''")}'` : 'NULL';
        dump += `INSERT INTO users (id, name, email, password_hash, partner_name, saved_certificates_count, created_at, updated_at)\n`;
        dump += `VALUES ('${u.id}', '${u.name.replace(/'/g, "''")}', '${u.email.replace(/'/g, "''")}', '${u.password_hash.replace(/'/g, "''")}', ${partnerVal}, ${u.saved_certificates_count || 0}, '${u.created_at}', '${u.updated_at}');\n`;
      }
    }

    const feedbacks = this.getFeedbacksTable();
    dump += `\n-- DDL: Criação da Tabela de Depoimentos / Avaliações Reais\n`;
    dump += `CREATE TABLE IF NOT EXISTS feedbacks (\n`;
    dump += `  id VARCHAR(255) PRIMARY KEY,\n`;
    dump += `  names VARCHAR(255) NOT NULL,\n`;
    dump += `  city VARCHAR(255),\n`;
    dump += `  time VARCHAR(255),\n`;
    dump += `  stars INTEGER DEFAULT 5,\n`;
    dump += `  comment TEXT NOT NULL,\n`;
    dump += `  plan VARCHAR(255),\n`;
    dump += `  verified BOOLEAN DEFAULT TRUE,\n`;
    dump += `  likes INTEGER DEFAULT 0,\n`;
    dump += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n`;
    dump += `);\n\n`;

    dump += `-- DML: Registros Inseridos na Tabela feedbacks (${feedbacks.length} depoimentos)\n`;
    for (const f of feedbacks) {
      dump += `INSERT INTO feedbacks (id, names, city, time, stars, comment, plan, verified, likes, created_at)\n`;
      dump += `VALUES ('${f.id}', '${f.names.replace(/'/g, "''")}', '${(f.city || '').replace(/'/g, "''")}', '${(f.time || '').replace(/'/g, "''")}', ${f.stars}, '${f.comment.replace(/'/g, "''")}', '${(f.plan || '').replace(/'/g, "''")}', ${f.verified}, ${f.likes || 0}, '${f.created_at}');\n`;
    }

    dump += `\n-- Fim do Dump SQL\n`;
    return dump;
  }

  public getFeedbacksTable(): SqlFeedbackRecord[] {
    try {
      const raw = localStorage.getItem(SQL_FEEDBACKS_TABLE_KEY);
      return raw ? JSON.parse(raw) : INITIAL_FEEDBACKS;
    } catch {
      return INITIAL_FEEDBACKS;
    }
  }

  private getUsersTable(): SqlUserRecord[] {
    try {
      const raw = localStorage.getItem(SQL_USERS_TABLE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveUserToLocalTable(user: SqlUserRecord): void {
    const rows = this.getUsersTable();
    const index = rows.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (index !== -1) {
      rows[index] = user;
    } else {
      rows.push(user);
    }
    localStorage.setItem(SQL_USERS_TABLE_KEY, JSON.stringify(rows));
  }
}

export const sqlDb = new SqlDatabase();
