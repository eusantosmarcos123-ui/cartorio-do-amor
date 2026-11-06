import type { 
  CertificateData, 
  TitleFont, 
  BodyFont, 
  SignatureFont 
} from '../types/certificate';

export const INITIAL_CERTIFICATE_DATA: CertificateData = {
  partner1: "Vinicius dos Santos",
  partner2: "Beatriz Ferreira",
  startDate: "2023-06-12",
  city: "Curitiba",
  state: "PR",
  relationshipType: "namoro",
  photoUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
  photoFrame: "oval",
  photoZoom: 100,
  showPhoto: true,
  vows: "Declaram solenemente, por livre e espontânea vontade do coração, o compromisso perpétuo de compartilhar sorrisos nos dias ensolarados e amparo nos dias tempestuosos; de dividir o último pedaço de chocolate, tolerar as playlists duvidosas de viagem e jamais adormecer sem antes selar a paz com um beijo de boa noite; elegendo um ao outro como eterno refúgio, cúmplice inabalável e amor de todas as vidas.",
  theme: "imperial",
  sealColor: "ruby",
  registryNumber: "TERMO REG-8942/AM",
  bookNumber: "LIVRO: 01-AFETO",
  pageNumber: "FOLHA: 1314",
  showQrCode: true,
  secretMessage: "Vinicius & Beatriz: Nosso amor registrado no Cartório do Afeto Eterno sob o número 8942. Para todo o sempre!",
  signature1: "Vinicius dos Santos",
  signature2: "Beatriz Ferreira",
  titleFont: "Cinzel",
  bodyFont: "Playfair Display",
  signatureFont: "Great Vibes",
  qrPhrase: "Escaneie com a câmera do celular para abrir nossa história de amor",
  qrLanguage: "pt",
  musicUrl: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
  galleryPhotos: [
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80",
  ],
};

export const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const THEME_CONFIGS = {
  imperial: {
    id: 'imperial',
    name: 'Clássico Imperial',
    description: 'Borgonha nobre, moldura em ouro e brasão cartorial tradicional',
    bg: 'bg-[#faf7f2]',
    border: 'border-[#c5a059]',
    primaryColor: '#72092c',
    goldAccent: '#c5a059',
    watermark: 'rgba(114, 9, 44, 0.03)',
  },
  rose: {
    id: 'rose',
    name: 'Minimalista Rosé',
    description: 'Tons florais suaves, estética limpa e arabescos contemporâneos',
    bg: 'bg-[#fcf8f8]',
    border: 'border-[#d4a5b3]',
    primaryColor: '#8a3b56',
    goldAccent: '#d4a5b3',
    watermark: 'rgba(212, 165, 179, 0.04)',
  },
  vintage: {
    id: 'vintage',
    name: 'Vintage Pergaminho',
    description: 'Papel envelhecido, bordas vitorianas e visual de documento secular',
    bg: 'bg-[#f5edd6]',
    border: 'border-[#8f6b32]',
    primaryColor: '#5c3a16',
    goldAccent: '#8f6b32',
    watermark: 'rgba(92, 58, 22, 0.04)',
  },
  midnight: {
    id: 'midnight',
    name: 'Noite Celestial',
    description: 'Azul marinho profundo, detalhes em prata & ouro lunar',
    bg: 'bg-[#f7f9fc]',
    border: 'border-[#708aa8]',
    primaryColor: '#1a2f4c',
    goldAccent: '#b08d46',
    watermark: 'rgba(26, 47, 76, 0.03)',
  },
} as const;

export const SEAL_CONFIGS = {
  ruby: {
    name: 'Cera Rubi Real',
    color: '#8b0e2f',
    textColor: '#fde8ef',
    ribbonColor: '#680520',
  },
  gold: {
    name: 'Ouro Imperial',
    color: '#b38a38',
    textColor: '#fdf8ea',
    ribbonColor: '#8f6820',
  },
  emerald: {
    name: 'Esmeralda Amorosa',
    color: '#1a5f47',
    textColor: '#e6f7f0',
    ribbonColor: '#103e2e',
  },
  sapphire: {
    name: 'Safira Estelar',
    color: '#1e3a6a',
    textColor: '#e8f0fe',
    ribbonColor: '#122544',
  },
} as const;

export const TITLE_FONTS: { id: TitleFont; label: string; sample: string; family: string }[] = [
  { id: 'Cinzel', label: 'Cinzel Imperial', sample: 'REPÚBLICA DO AMOR', family: "'Cinzel', serif" },
  { id: 'Playfair Display', label: 'Playfair Display', sample: 'Certidão de Afeto', family: "'Playfair Display', serif" },
  { id: 'Cormorant Garamond', label: 'Cormorant Garamond', sample: 'União Solene & Eterna', family: "'Cormorant Garamond', serif" },
  { id: 'Montserrat', label: 'Montserrat Moderno', sample: 'CERTIDÃO DE COMPROMISSO', family: "'Montserrat', sans-serif" },
  { id: 'Great Vibes', label: 'Great Vibes Cursivo', sample: 'Amor Verdadeiro', family: "'Great Vibes', cursive" },
];

export const BODY_FONTS: { id: BodyFont; label: string; sample: string; family: string }[] = [
  { id: 'Playfair Display', label: 'Playfair Display', sample: 'Declaram solenemente a união...', family: "'Playfair Display', serif" },
  { id: 'EB Garamond', label: 'EB Garamond Cartorial', sample: 'Por livre e espontânea vontade...', family: "'EB Garamond', serif" },
  { id: 'Plus Jakarta Sans', label: 'Plus Jakarta (Clean)', sample: 'Compromisso de cumplicidade diária...', family: "'Plus Jakarta Sans', sans-serif" },
  { id: 'Dancing Script', label: 'Dancing Script (Manuscrito)', sample: 'Para amar, respeitar e cuidar...', family: "'Dancing Script', cursive" },
  { id: 'Cormorant Garamond', label: 'Cormorant Delicado', sample: 'Elegendo um ao outro como refúgio...', family: "'Cormorant Garamond', serif" },
];

export const SIGNATURE_FONTS: { id: SignatureFont; label: string; sample: string; family: string }[] = [
  { id: 'Great Vibes', label: 'Great Vibes Real', sample: 'Vinicius & Beatriz', family: "'Great Vibes', cursive" },
  { id: 'Dancing Script', label: 'Dancing Script', sample: 'Vinicius & Beatriz', family: "'Dancing Script', cursive" },
  { id: 'Alex Brush', label: 'Alex Brush Solene', sample: 'Vinicius & Beatriz', family: "'Alex Brush', cursive" },
  { id: 'Parisienne', label: 'Parisienne Nobre', sample: 'Vinicius & Beatriz', family: "'Parisienne', cursive" },
];

export const FONT_PRESETS = [
  {
    name: 'Clássico Cartorial',
    description: 'A elegância tradicional de registros históricos solenes',
    titleFont: 'Cinzel' as TitleFont,
    bodyFont: 'EB Garamond' as BodyFont,
    signatureFont: 'Great Vibes' as SignatureFont,
  },
  {
    name: 'Romance Editorial',
    description: 'Estilo literário e poético digno de revista e romance',
    titleFont: 'Playfair Display' as TitleFont,
    bodyFont: 'Playfair Display' as BodyFont,
    signatureFont: 'Parisienne' as SignatureFont,
  },
  {
    name: 'Moderno & Limpo',
    description: 'Tipografia contemporânea com assinatura solene refinada',
    titleFont: 'Montserrat' as TitleFont,
    bodyFont: 'Plus Jakarta Sans' as BodyFont,
    signatureFont: 'Alex Brush' as SignatureFont,
  },
  {
    name: 'Carta de Amor',
    description: 'Toque delicado com texto em caligrafia afetiva manuscrita',
    titleFont: 'Cormorant Garamond' as TitleFont,
    bodyFont: 'Dancing Script' as BodyFont,
    signatureFont: 'Dancing Script' as SignatureFont,
  },
];

export const QR_LANGUAGES = [
  { 
    id: 'pt', 
    label: 'Português', 
    flag: '🇧🇷', 
    sample: 'Escaneie com o celular para ver nossa história de amor',
    subtext: 'Para todo o sempre nós dois'
  },
  { 
    id: 'en', 
    label: 'English', 
    flag: '🇺🇸', 
    sample: 'Scan with your camera to open our special love song & story',
    subtext: 'Forever & Always Together'
  },
  { 
    id: 'es', 
    label: 'Español', 
    flag: '🇪🇸', 
    sample: 'Escanea para descubrir nuestra historia de amor verdadero',
    subtext: 'Por siempre en mi corazón'
  },
  { 
    id: 'fr', 
    label: 'Français', 
    flag: '🇫🇷', 
    sample: 'Scannez pour écouter notre douce chanson d’amour',
    subtext: 'Je t’aime pour toujours et à jamais'
  },
  { 
    id: 'it', 
    label: 'Italiano', 
    flag: '🇮🇹', 
    sample: 'Scansiona per leggere il nostro messaggio d’amore eterno',
    subtext: 'Il nostro amore senza fine'
  },
  { 
    id: 'de', 
    label: 'Deutsch', 
    flag: '🇩🇪', 
    sample: 'Scanne für unsere ewige Liebesbotschaft und Erinnerung',
    subtext: 'Für immer dein Herz'
  },
  { 
    id: 'ja', 
    label: '日本語 (Japonês)', 
    flag: '🇯🇵', 
    sample: 'QRコードをスキャンして二人の愛の物語を見る',
    subtext: 'ずっと愛してる • 永遠の愛'
  },
  { 
    id: 'ko', 
    label: '한국어 (Coreano)', 
    flag: '🇰🇷', 
    sample: 'QR 코드를 스캔하여 우리의 사랑 이야기를 확인하세요',
    subtext: '영원히 사랑해 • 영원한 우리'
  },
  { 
    id: 'la', 
    label: 'Latim Clássico', 
    flag: '🏛️', 
    sample: 'Amor vincit omnia et nos cedamus amori',
    subtext: 'In perpetuum et unum diem'
  },
];
