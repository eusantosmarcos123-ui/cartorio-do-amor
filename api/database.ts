interface VercelRequestLike {
  method?: string;
  query?: Record<string, string | string[]>;
  body?: any;
}

interface VercelResponseLike {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (body: any) => void;
    end: () => void;
    send: (body: string) => void;
  };
}

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Proteção LGPD e Broken Access Control: Exige autorização de administrador
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  const authHeader = (req as any).headers?.authorization || '';

  if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
    return res.status(403).json({
      error: 'Acesso negado. Esta rota exige credenciais administrativas.',
    });
  }

  const format = req.query?.format || 'json';

  const defaultUsers: any[] = [];

  if (format === 'sql') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const sqlDump = `-- CARTÓRIO DO AMOR - SQL DATABASE DUMP
-- Generated on: ${new Date().toISOString()}
-- Security: Cryptographic Password Hashing (SHA-256)

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    partner_name VARCHAR(255),
    saved_certificates_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, name, email, password_hash, partner_name, saved_certificates_count, created_at, updated_at)
VALUES ('${defaultUsers[0].id}', '${defaultUsers[0].name}', '${defaultUsers[0].email}', '${defaultUsers[0].password_hash}', '${defaultUsers[0].partner_name}', ${defaultUsers[0].saved_certificates_count}, '${defaultUsers[0].created_at}', '${defaultUsers[0].updated_at}');
`;
    return res.status(200).send(sqlDump);
  }

  return res.status(200).json({
    database: 'cartorio_do_amor_db',
    table: 'users',
    total_records: defaultUsers.length,
    schema: {
      id: 'VARCHAR(36) PRIMARY KEY',
      name: 'VARCHAR(255) NOT NULL',
      email: 'VARCHAR(255) UNIQUE NOT NULL',
      password_hash: 'VARCHAR(255) NOT NULL (SHA-256)',
      partner_name: 'VARCHAR(255)',
      saved_certificates_count: 'INT DEFAULT 0',
      created_at: 'TIMESTAMP',
      updated_at: 'TIMESTAMP',
    },
    records: defaultUsers,
  });
}
