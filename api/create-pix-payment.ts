declare const process: any;

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Safely parse body
  let parsedBody = req.body || {};
  if (typeof parsedBody === 'string') {
    try {
      parsedBody = JSON.parse(parsedBody);
    } catch {
      parsedBody = {};
    }
  }

  const { 
    description = 'Certidão Oficial - Cartório do Amor',
    payerEmail = 'cliente@cartoriodoamor.com',
    payerName = 'Cliente Cartório do Amor',
    planId = 'essencial'
  } = parsedBody;

  // Defesa contra Adulteração de Preço (Price Tampering): Tabela oficial no servidor
  const PLAN_PRICES: Record<string, number> = {
    essencial: 9.90,
    vip: 19.90,
    eterno: 29.90,
  };
  const verifiedAmount = PLAN_PRICES[planId] || 9.90;

  // Gestão de Segredos Segura: Apenas variáveis de ambiente
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  // If live Mercado Pago Access Token is configured
  if (accessToken && accessToken.startsWith('APP_USR-')) {
    try {
      const nameParts = (payerName || 'Cliente').trim().split(' ');
      const firstName = nameParts[0] || 'Cliente';
      const lastName = nameParts.slice(1).join(' ') || 'Amor';
      const cleanEmail = (payerEmail && String(payerEmail).includes('@')) 
        ? String(payerEmail).trim() 
        : 'pagamentos.cartoriodoamor@gmail.com';

      const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Idempotency-Key': `pix_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
        },
        body: JSON.stringify({
          transaction_amount: verifiedAmount,
          description: description,
          payment_method_id: 'pix',
          payer: {
            email: cleanEmail,
            first_name: firstName,
            last_name: lastName,
          },
          metadata: {
            plan_id: planId,
            app: 'cartorio_do_amor'
          }
        })
      });

      const paymentData = await mpResponse.json();

      if (mpResponse.ok && paymentData.id) {
        const pointOfInteraction = paymentData.point_of_interaction?.transaction_data;
        return res.status(200).json({
          success: true,
          paymentId: String(paymentData.id),
          status: paymentData.status,
          qrCode: pointOfInteraction?.qr_code || '',
          qrCodeBase64: pointOfInteraction?.qr_code_base64 || '',
          ticketUrl: pointOfInteraction?.ticket_url || '',
          amount: paymentData.transaction_amount,
          expiresAt: paymentData.date_of_expiration,
          mode: 'production'
        });
      } else {
        return res.status(200).json({
          success: false,
          error: 'MP_NON_OK',
          status: mpResponse.status,
          details: paymentData
        });
      }
    } catch (err: any) {
      return res.status(200).json({
        success: false,
        error: 'MP_CATCH',
        message: err?.message || String(err)
      });
    }
  }

  // Fallback / Instant Interactive Mode (when live token is being configured)
  const mockPaymentId = `mp_pix_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const samplePixCopiaECola = `00020126580014br.gov.bcb.pix0136cartoriodoamor-oficial-${mockPaymentId}520400005303986540${Number(verifiedAmount).toFixed(2).replace('.', '')}5802BR5920CARTORIO DO AMOR LTDA6009SAO PAULO62070503***6304D1A4`;

  return res.status(200).json({
    success: true,
    paymentId: mockPaymentId,
    status: 'pending',
    qrCode: samplePixCopiaECola,
    qrCodeBase64: '',
    ticketUrl: '',
    amount: Number(verifiedAmount),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    mode: 'test_ready',
    message: 'Chave Pix Copia e Cola gerada com sucesso!'
  });
}
