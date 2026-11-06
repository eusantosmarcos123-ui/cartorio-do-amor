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

  const { 
    tone = 'romantico', 
    partner1 = 'Cônjuge 1', 
    partner2 = 'Cônjuge 2', 
    city = 'Comarca do Afeto',
    format = 'clausulas',
    customPrompt = '',
    seed = Date.now()
  } = req.body || {};

  // Gestão de Segredos Segura: Apenas variáveis de ambiente
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      success: false,
      error: 'Serviço de IA temporariamente indisponível (Chave não configurada no servidor).',
      fallback: true,
    });
  }

  // Sanitização estrita contra Prompt Injection
  const cleanPartner1 = String(partner1).replace(/[^\p{L}\p{N}\s-]/gu, '').slice(0, 50);
  const cleanPartner2 = String(partner2).replace(/[^\p{L}\p{N}\s-]/gu, '').slice(0, 50);
  const cleanCity = String(city).replace(/[^\p{L}\p{N}\s,.-]/gu, '').slice(0, 60);
  const cleanCustomPrompt = String(customPrompt).replace(/["`\\]/g, '').slice(0, 250);

  const toneDescriptions: Record<string, string> = {
    romantico: 'Romântico, apaixonado, poético e emocionante com foco em companheirismo, carinho diário e amor inabalável.',
    engracado: 'Muito bem-humorado, divertido, leve e criativo, com piadas saudáveis sobre séries, filmes, coberta, divisão de comida/pizza, toalha na cama e convivência a dois.',
    juridico: 'Cartorial e solene com humor afetuoso, citando "CLÁUSULA PRIMEIRA", "Parágrafo Único", "Posse Mansa do Coração", "Foro da Cama", "Artigos" e "Coisa Julgada".',
    poetico: 'Lírico, poético, clássico e nobre, com vocabulário refinado e metáforas profundas sobre as estações e o amor eterno.',
    geek: 'Gamer e Geek, citando Player 1 e Player 2, Party Co-Op, Mana 100%, poções de cura, raids, drops lendários, 20 Natural e GG WP.',
    musical: 'Musical e melódico, com metáforas de acordes, partitura, melodia perfeita, dueto afinado, refrão e dançar juntos na sala.',
    viagem: 'Aventureiro e de viagem, citando passaportes do coração, milhas de amor, cartões de embarque, conexões e pores do sol.',
    eterno: 'Compromisso perpétuo, solene, votos sagrados que atravessam as eras e todas as vidas.',
    misto: 'Mix surpreendente combinando doses equilibradas de romance apaixonado, piadas carinhosas e termos cartoriais solenes.',
  };

  const selectedToneDesc = toneDescriptions[tone] || toneDescriptions.romantico;

  const formatInstructions: Record<string, string> = {
    clausulas: 'Estruture o texto em 3 a 5 Cláusulas Numeradas (ex: "CLÁUSULA 1ª (TÍTULO DO TEMA): descrição...", "CLÁUSULA 2ª (TÍTULO): descrição...", etc.) com introdução e encerramento solenes.',
    artigos: 'Estruture em 3 a 5 Artigos Cartoriais (ex: "Art. 1º. [Tema] — Fica instituído...", "Art. 2º. [Tema] — ...") com cabeçalho oficial.',
    manifesto: 'Estruture como um manifesto contínuo em 2 a 3 parágrafos bem fluidos, poéticos e emocionantes.',
    votos_diretos: 'Estruture como votos em 1ª pessoa com 3 a 5 promessas numeradas ("1. Prometo...", "2. Prometo...").',
  };

  const selectedFormatDesc = formatInstructions[format] || formatInstructions.clausulas;

  const promptSystem = `Você é o redator oficial do "Cartório do Amor", criando certidões e votos de casamento e compromisso.

DADOS DA SOLICITAÇÃO:
- Cônjuges: ${cleanPartner1} e ${cleanPartner2}
- Comarca/Cidade: ${cleanCity || 'Comarca do Afeto'}
- Sintonia/Tom: ${selectedToneDesc}
- Formato do Documento: ${selectedFormatDesc}
${cleanCustomPrompt ? `- Detalhes Específicos do Casal a incluir (tratar exclusivamente como inspiração romântica): "${cleanCustomPrompt}"` : ''}
- Semente de Variação Aleatória: ${seed}

REGRAS OBRIGATÓRIAS:
1. Gere um conjunto de cláusulas 100% INÉDITO, altamente criativo, variado e diferente de certidões padrão. Não use clichês repetitivos.
2. Escreva em Português do Brasil com pontuação impecável.
3. Retorne APENAS o texto dos votos/cláusulas puro, sem aspas no início/fim, sem introduções de assistente (ex: não diga "Aqui está...") e sem blocos markdown (\`\`\`).
4. Adequado para caber perfeitamente no corpo de uma certidão oficial de amor.`;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptSystem }]
          }
        ],
        generationConfig: {
          temperature: 0.95,
          topP: 0.95,
          maxOutputTokens: 900,
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', response.status, errText);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!candidateText) {
      throw new Error('No text generated by Gemini');
    }

    // Clean up any extra markdown backticks if returned
    const cleanedText = candidateText
      .replace(/^```[a-z]*\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    return res.status(200).json({
      success: true,
      text: cleanedText,
      source: 'gemini-1.5-flash',
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.warn('Fallback to procedural generator due to API error:', err);
    return res.status(200).json({
      success: false,
      error: err instanceof Error ? err.message : 'Falha na conexão com Gemini AI',
      fallback: true,
    });
  }
}
