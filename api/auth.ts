// In-memory / Serverless SQL Table Model
interface SqlUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  partner_name?: string;
  saved_certificates_count: number;
  created_at: string;
  updated_at: string;
}

interface VercelRequestLike {
  method?: string;
  body?: any;
}

interface VercelResponseLike {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (body: any) => void;
    end: () => void;
  };
}

// Global serverless table cache
const globalUsersDb: Map<string, SqlUser> = new Map();

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { action, email, user } = req.body || {};

    if (action === 'selectUserByEmail') {
      const normalizedEmail = (email || '').trim().toLowerCase();
      const found = globalUsersDb.get(normalizedEmail) || null;
      return res.status(200).json({ success: true, user: found });
    }

    if (action === 'insertUser' && user) {
      const normalizedEmail = (user.email || '').trim().toLowerCase();
      if (globalUsersDb.has(normalizedEmail)) {
        return res.status(400).json({ error: 'SQL Constraint: Email already exists.' });
      }

      globalUsersDb.set(normalizedEmail, user);
      return res.status(201).json({ success: true, user });
    }

    return res.status(400).json({ error: 'Invalid SQL action.' });
  } catch (error) {
    console.error('SQL Serverless Error:', error);
    return res.status(500).json({ error: 'Internal Server Error executing SQL query.' });
  }
}
