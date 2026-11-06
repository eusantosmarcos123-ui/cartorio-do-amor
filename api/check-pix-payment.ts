declare const process: any;

interface VercelRequestLike {
  method?: string;
  query?: any;
  body?: any;
}

interface VercelResponseLike {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (body: any) => void;
    end: () => void;
  };
}

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawPaymentId = req.query?.paymentId || req.body?.paymentId;

  if (!rawPaymentId) {
    return res.status(400).json({ error: 'ID do pagamento não informado' });
  }

  // Sanitização de Entrada estrita (Previne SSRF e manipulação de caminho na API externa)
  const paymentId = String(rawPaymentId).trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(paymentId)) {
    return res.status(400).json({ error: 'ID de pagamento inválido.' });
  }

  // Gestão de Segredos Segura: Apenas variáveis de ambiente
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  // Real check with Mercado Pago if live token exists
  if (accessToken && accessToken.startsWith('APP_USR-') && !paymentId.startsWith('mp_pix_')) {
    try {
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (mpResponse.ok) {
        const data = await mpResponse.json();
        return res.status(200).json({
          success: true,
          paymentId: data.id,
          status: data.status, // 'pending', 'approved', 'rejected', etc.
          statusDetail: data.status_detail,
          isApproved: data.status === 'approved'
        });
      }
    } catch (err) {
      console.error('Error fetching Mercado Pago payment status:', err);
    }
  }

  // If in test mode
  return res.status(200).json({
    success: true,
    paymentId,
    status: 'pending',
    isApproved: false,
    mode: 'test'
  });
}
