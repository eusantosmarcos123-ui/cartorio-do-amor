interface SqlFeedback {
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
  };
}

const INITIAL_FEEDBACKS: SqlFeedback[] = [
  {
    id: 'fb-1',
    names: 'Lucas & Beatriz',
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

let globalFeedbacks: SqlFeedback[] = [...INITIAL_FEEDBACKS];
let deletedFeedbackIds: string[] = [];

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

  try {
    // GET: Return all feedbacks
    if (req.method === 'GET') {
      const activeFeedbacks = globalFeedbacks.filter((f) => !deletedFeedbackIds.includes(f.id));
      return res.status(200).json({
        success: true,
        total: activeFeedbacks.length,
        feedbacks: activeFeedbacks
      });
    }

    // POST: Insert new real feedback
    if (req.method === 'POST') {
      const { names, city, time, stars, comment, plan } = req.body || {};

      if (!names || !comment) {
        return res.status(400).json({ error: 'Nomes e comentário são obrigatórios.' });
      }

      const newRecord: SqlFeedback = {
        id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        names: String(names).trim(),
        city: String(city || 'Brasil').trim(),
        time: String(time || 'Juntos com amor').trim(),
        stars: Math.max(1, Math.min(5, Number(stars) || 5)),
        comment: String(comment).trim(),
        plan: plan ? String(plan).trim() : 'Membro VIP',
        verified: true,
        likes: 1,
        created_at: new Date().toISOString()
      };

      globalFeedbacks.unshift(newRecord);
      return res.status(201).json({ success: true, feedback: newRecord });
    }

    // PATCH: Like feedback
    if (req.method === 'PATCH') {
      const { id } = req.body || {};
      const found = globalFeedbacks.find((f) => f.id === id);
      if (found) {
        found.likes = (found.likes || 0) + 1;
        return res.status(200).json({ success: true, likes: found.likes });
      }
      return res.status(404).json({ error: 'Depoimento não encontrado.' });
    }

    // DELETE: Remove feedback (Restrito a Administradores)
    if (req.method === 'DELETE') {
      const adminSecret = process.env.ADMIN_SECRET_KEY;
      const authHeader = (req as any).headers?.authorization || '';

      if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
        return res.status(403).json({ error: 'Permissão negada. Apenas administradores podem excluir depoimentos.' });
      }

      const id = req.query?.id || req.body?.id;
      if (id) {
        const idStr = String(id);
        if (!deletedFeedbackIds.includes(idStr)) {
          deletedFeedbackIds.push(idStr);
        }
        globalFeedbacks = globalFeedbacks.filter((f) => f.id !== idStr);
        return res.status(200).json({ success: true, message: 'Depoimento excluído.' });
      }
      return res.status(400).json({ error: 'ID obrigatório.' });
    }

    return res.status(405).json({ error: 'Método não suportado.' });
  } catch (error) {
    console.error('Erro na API de Feedbacks:', error);
    return res.status(500).json({ error: 'Erro interno ao processar depoimentos.' });
  }
}
