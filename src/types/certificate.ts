export type CertificateTheme = 'imperial' | 'rose' | 'vintage' | 'midnight';

export type SealColor = 'ruby' | 'gold' | 'emerald' | 'sapphire';

export type PhotoFrame = 'oval' | 'polaroid' | 'circle' | 'ornate';

export type RelationshipType = 
  | 'namoro' 
  | 'noivado' 
  | 'casamento' 
  | 'uniao-estavel' 
  | 'ficantes-oficiais';

export type TitleFont = 
  | 'Cinzel' 
  | 'Playfair Display' 
  | 'Cormorant Garamond' 
  | 'Montserrat' 
  | 'Great Vibes';

export type BodyFont = 
  | 'Playfair Display' 
  | 'EB Garamond' 
  | 'Plus Jakarta Sans' 
  | 'Dancing Script' 
  | 'Cormorant Garamond';

export type SignatureFont = 
  | 'Great Vibes' 
  | 'Dancing Script' 
  | 'Alex Brush' 
  | 'Parisienne';

export interface CertificateData {
  partner1: string;
  partner2: string;
  startDate: string; // YYYY-MM-DD
  city: string;
  state: string;
  relationshipType: RelationshipType;
  photoUrl: string | null;
  photoFrame: PhotoFrame;
  photoZoom: number; // percentage (e.g. 100 = 1x, 150 = 1.5x)
  showPhoto: boolean;
  vows: string;
  theme: CertificateTheme;
  sealColor: SealColor;
  registryNumber: string;
  bookNumber: string;
  pageNumber: string;
  showQrCode: boolean;
  secretMessage: string;
  signature1: string;
  signature2: string;
  titleFont: TitleFont;
  bodyFont: BodyFont;
  signatureFont: SignatureFont;
  qrPhrase: string;
  qrLanguage: string;
  musicUrl?: string;
  galleryPhotos?: string[];
}

export interface TimeCalculation {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  formattedText: string;
  compactBadge: string;
  milestoneTitle: string;
}
