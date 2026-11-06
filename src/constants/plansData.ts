export interface CheckoutPlan {
  id: 'essencial' | 'vip' | 'completo';
  name: string;
  badge?: string;
  price: number;
  originalPrice: number;
  billingPeriod: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export const CHECKOUT_PLANS: CheckoutPlan[] = [
  {
    id: 'essencial',
    name: 'Certidão Digital Oficial',
    price: 9.90,
    originalPrice: 19.90,
    billingPeriod: '/mês',
    description: 'Acesso mensal com edições e downloads ilimitados em PDF 300 DPI.',
    features: [
      'PDF A4 Vetorial em Alta Resolução (300 DPI)',
      'Arquivo PNG Ultra HD sem marca d’água',
      'Edições e Downloads ilimitados no mês',
      'Termo e Livro Cartorial Registrados'
    ]
  },
  {
    id: 'vip',
    name: 'Combo VIP Interativo',
    badge: 'MAIS ASSINADO 🔥',
    price: 19.90,
    originalPrice: 39.90,
    billingPeriod: '/mês',
    description: 'Edições e downloads ilimitados em 300 DPI + Gerador de Votos poéticos com IA ilimitado.',
    recommended: true,
    features: [
      'Tudo do Plano Digital Oficial',
      'Gerador de Votos com IA Ilimitado',
      'QR Code Dinâmico com Trilha Sonora na Certidão',
      'Edições e Downloads ilimitados em 300 DPI',
      'Prévia da Página Web do Casal inclusa'
    ]
  },
  {
    id: 'completo',
    name: 'Pack do Amor Eterno',
    badge: 'COMPLETO',
    price: 29.90,
    originalPrice: 59.90,
    billingPeriod: '/mês',
    description: 'Experiência completa: Página Web Oficial do Casal 24/7 + 3 Documentos de Amor.',
    features: [
      'Tudo do Plano VIP Interativo',
      'Página Web Oficial do Casal (Música + Contador 24/7)',
      'Galeria de Fotos do Casal + Carta Animada',
      '3 Documentos: Certidão + Contrato + RG do Amor',
      'Link Personalizado Permanente e Vitalício',
      'Suporte Prioritário VIP no WhatsApp'
    ]
  }
];
