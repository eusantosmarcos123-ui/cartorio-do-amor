import { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { CertificateData, TitleFont, BodyFont, SignatureFont } from '../types/certificate';
import { THEME_CONFIGS, SEAL_CONFIGS } from '../constants/initialData';
import { calculateRelationshipTime, formatFullDatePortuguese, formatDateBR } from '../utils/dateUtils';
import { Heart } from 'lucide-react';

interface CertificateDocumentProps {
  data: CertificateData;
}

const getTitleFontFamily = (font?: TitleFont) => {
  switch (font) {
    case 'Cinzel': return "'Cinzel', serif";
    case 'Playfair Display': return "'Playfair Display', serif";
    case 'Cormorant Garamond': return "'Cormorant Garamond', serif";
    case 'Montserrat': return "'Montserrat', sans-serif";
    case 'Great Vibes': return "'Great Vibes', cursive";
    default: return "'Cinzel', serif";
  }
};

const getBodyFontFamily = (font?: BodyFont) => {
  switch (font) {
    case 'EB Garamond': return "'EB Garamond', serif";
    case 'Playfair Display': return "'Playfair Display', serif";
    case 'Plus Jakarta Sans': return "'Plus Jakarta Sans', sans-serif";
    case 'Dancing Script': return "'Dancing Script', cursive";
    case 'Cormorant Garamond': return "'Cormorant Garamond', serif";
    default: return "'Playfair Display', serif";
  }
};

const getSignatureFontFamily = (font?: SignatureFont) => {
  switch (font) {
    case 'Great Vibes': return "'Great Vibes', cursive";
    case 'Dancing Script': return "'Dancing Script', cursive";
    case 'Alex Brush': return "'Alex Brush', cursive";
    case 'Parisienne': return "'Parisienne', cursive";
    default: return "'Great Vibes', cursive";
  }
};

export const CertificateDocument: React.FC<CertificateDocumentProps> = ({ data }) => {
  const theme = THEME_CONFIGS[data.theme] || THEME_CONFIGS.imperial;
  const seal = SEAL_CONFIGS[data.sealColor] || SEAL_CONFIGS.ruby;
  
  const [currentDate] = useState(() => new Date());
  const timeInfo = useMemo(() => calculateRelationshipTime(data.startDate), [data.startDate]);
  const issuedDateText = useMemo(() => formatFullDatePortuguese(currentDate), [currentDate]);

  const titleFontFamily = getTitleFontFamily(data.titleFont);
  const bodyFontFamily = getBodyFontFamily(data.bodyFont);
  const signatureFontFamily = getSignatureFontFamily(data.signatureFont);

  const qrCodeTargetUrl = useMemo(() => {
    if (data.secretMessage && (data.secretMessage.startsWith('http://') || data.secretMessage.startsWith('https://'))) {
      return data.secretMessage;
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cartorio-do-amor-nine.vercel.app';
    const params = new URLSearchParams();
    params.set('view', 'casal');
    if (data.partner1) params.set('p1', data.partner1);
    if (data.partner2) params.set('p2', data.partner2);
    if (data.startDate) params.set('d', data.startDate);
    if (data.city) params.set('c', data.city);
    if (data.state) params.set('s', data.state);
    if (data.musicUrl) params.set('m', data.musicUrl);
    return `${origin}/?${params.toString()}`;
  }, [data.secretMessage, data.partner1, data.partner2, data.startDate, data.city, data.state, data.musicUrl]);

  const getRelationshipTitle = () => {
    switch (data.relationshipType) {
      case 'noivado': return 'CERTIDÃO DE NOIVADO & PROMESSA DE AMOR';
      case 'casamento': return 'CERTIDÃO DE CASAMENTO SIMBÓLICO';
      case 'uniao-estavel': return 'DECLARAÇÃO DE UNIÃO ESTÁVEL DO AFETO';
      case 'ficantes-oficiais': return 'CERTIDÃO DE EXCLUSIVIDADE & FICANTES OFICIAIS';
      case 'namoro':
      default:
        return 'CERTIDÃO OFICIAL DE NAMORO & COMPROMISSO';
    }
  };

  return (
    <div
      id="certificate-document"
      className={`relative w-[210mm] min-h-[297mm] h-[297mm] p-8 sm:p-10 select-none certificate-print-container flex flex-col justify-between overflow-hidden shadow-2xl transition-colors duration-300 font-sans ${theme.bg}`}
      style={{
        boxSizing: 'border-box',
        backgroundColor: data.theme === 'vintage' ? '#f4ecd8' : data.theme === 'rose' ? '#fcf7f8' : data.theme === 'midnight' ? '#f7f9fc' : '#faf7f2',
      }}
    >
      {/* Background Guilloché / Subtle Security Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(${theme.goldAccent}40 0.75px, transparent 0.75px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Outer Ornate Border */}
      <div 
        className="absolute inset-3 sm:inset-4 border-2 pointer-events-none rounded-sm"
        style={{ borderColor: theme.goldAccent }}
      />

      {/* Inner Decorative Double Border */}
      <div 
        className="absolute inset-5 sm:inset-6 border border-double border-[3px] pointer-events-none"
        style={{ borderColor: theme.goldAccent }}
      />

      {/* Corner Arabesques (Top-Left, Top-Right, Bottom-Left, Bottom-Right) */}
      <div className="absolute top-5 left-5 w-16 h-16 pointer-events-none text-[#c5a059]">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-80">
          <path d="M0,0 L45,0 C45,15 35,25 20,25 C20,40 10,50 0,50 Z" />
          <circle cx="15" cy="15" r="4" />
          <path d="M2,2 L35,2 M2,2 L2,35" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="absolute top-5 right-5 w-16 h-16 pointer-events-none text-[#c5a059] -scale-x-100">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-80">
          <path d="M0,0 L45,0 C45,15 35,25 20,25 C20,40 10,50 0,50 Z" />
          <circle cx="15" cy="15" r="4" />
          <path d="M2,2 L35,2 M2,2 L2,35" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="absolute bottom-5 left-5 w-16 h-16 pointer-events-none text-[#c5a059] -scale-y-100">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-80">
          <path d="M0,0 L45,0 C45,15 35,25 20,25 C20,40 10,50 0,50 Z" />
          <circle cx="15" cy="15" r="4" />
          <path d="M2,2 L35,2 M2,2 L2,35" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="absolute bottom-5 right-5 w-16 h-16 pointer-events-none text-[#c5a059] -scale-x-100 -scale-y-100">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-80">
          <path d="M0,0 L45,0 C45,15 35,25 20,25 C20,40 10,50 0,50 Z" />
          <circle cx="15" cy="15" r="4" />
          <path d="M2,2 L35,2 M2,2 L2,35" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Main Document Content Area */}
      <div className="relative z-10 flex flex-col justify-between h-full px-4 py-2">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="certificate-header text-center pt-1 sm:pt-2 w-full shrink-0" data-certificate-header="true">
          {/* Coat of Arms / Romantic Seal Crest */}
          <div className="flex justify-center mb-1.5 sm:mb-2">
            <div className="relative flex items-center justify-center">
              <svg className="w-14 h-14 sm:w-16 sm:h-16 text-[#c5a059]" viewBox="0 0 100 100" fill="none">
                {/* Golden Wing Accents Left & Right */}
                <path d="M15,40 C10,25 22,12 38,18 C28,26 24,38 28,52 Z" fill="#c5a059" opacity="0.95" />
                <path d="M85,40 C90,25 78,12 62,18 C72,26 76,38 72,52 Z" fill="#c5a059" opacity="0.95" />
                <path d="M22,60 C16,48 24,36 36,32 C30,42 32,54 38,62 Z" fill="#c5a059" opacity="0.8" />
                <path d="M78,60 C84,48 76,36 64,32 C70,42 68,54 62,62 Z" fill="#c5a059" opacity="0.8" />
                {/* Central Noble Cartorial Shield */}
                <path d="M30,22 L70,22 C70,55 50,72 50,72 C50,72 30,55 30,22 Z" fill={theme.primaryColor} stroke="#c5a059" strokeWidth="2.5" />
                {/* Center Golden Heart */}
                <path d="M50,38 C45,30 36,33 36,41 C36,49 50,58 50,58 C50,58 64,49 64,41 C64,33 55,30 50,38 Z" fill="#c5a059" />
              </svg>
            </div>
          </div>

          <p 
            className="tracking-[0.25em] text-[10.5px] sm:text-[11px] uppercase font-bold text-stone-700"
            style={{ fontFamily: titleFontFamily }}
          >
            REPÚBLICA FEDERATIVA DO AMOR & CUMPLICIDADE
          </p>
          <p 
            className="tracking-[0.2em] text-[8.5px] sm:text-[9px] uppercase font-semibold text-stone-500 mb-1"
            style={{ fontFamily: titleFontFamily }}
          >
            REGISTRO GERAL DE AFETO, VOTOS E CARINHO ETERNO
          </p>

          <div className="flex items-center justify-center gap-2.5 sm:gap-3 my-1">
            <div className="h-[1px] w-14 sm:w-20 bg-gradient-to-r from-transparent to-[#c5a059]" />
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-md border border-[#c5a059]/60 bg-white/90 shadow-xs">
              <span 
                className="font-mono text-[9px] sm:text-[9.5px] tracking-widest text-[#72092c] font-bold uppercase whitespace-nowrap leading-none text-center flex items-center justify-center"
                style={{ position: 'relative', top: '-1px', paddingLeft: '0.1em' }}
              >
                {data.bookNumber} • {data.pageNumber} • {data.registryNumber}
              </span>
            </div>
            <div className="h-[1px] w-14 sm:w-20 bg-gradient-to-l from-transparent to-[#c5a059]" />
          </div>

          <h2 
            className="text-xl sm:text-2xl font-black tracking-wider uppercase mt-1 mb-1.5"
            style={{ 
              color: theme.primaryColor,
              fontFamily: titleFontFamily,
            }}
          >
            {getRelationshipTitle()}
          </h2>
        </div>

        {/* ================= DYNAMIC TIME BADGE (Pílula Elegante) ================= */}
        <section className="my-1.5 text-center">
          <div className="inline-block px-8 py-2 rounded-full border border-[#c5a059] bg-[#faf7f2] shadow-xs">
            <span className="text-xs sm:text-sm font-bold text-[#72092c] tracking-wide">
              {timeInfo.formattedText}
            </span>
          </div>
        </section>

        {/* ================= COUPLE SECTION ================= */}
        <section className="my-2 text-center flex flex-col items-center">
          
          {/* Couple Photo (if enabled) */}
          {data.showPhoto && data.photoUrl && (
            <div className="mb-2">
              <div 
                className={`relative overflow-hidden bg-stone-200 border-2 shadow-md mx-auto ${
                  data.photoFrame === 'oval' ? 'w-24 h-32 rounded-[50%]' :
                  data.photoFrame === 'circle' ? 'w-24 h-24 rounded-full' :
                  data.photoFrame === 'polaroid' ? 'w-24 h-28 p-1.5 pb-4 bg-white shadow-lg rotate-[-2deg]' :
                  'w-24 h-28 rounded-lg'
                }`}
                style={{ borderColor: theme.goldAccent }}
              >
                <img
                  src={data.photoUrl}
                  alt={`${data.partner1} e ${data.partner2}`}
                  crossOrigin="anonymous"
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-100 ease-out"
                  style={{
                    transform: `scale(${(data.photoZoom || 100) / 100})`,
                    transformOrigin: 'center center',
                  }}
                />
              </div>
            </div>
          )}

          {/* Intro registry formula */}
          <p 
            className="italic text-xs text-stone-600 mb-1 max-w-lg leading-relaxed"
            style={{ fontFamily: bodyFontFamily }}
          >
            Certificamos e damos fé pública que, em nossos livros solenes de afeto, constam devidamente qualificados como almas cúmplices e inseparáveis:
          </p>

          {/* Names in highlighted customizable title font */}
          <div className="w-full max-w-xl mx-auto py-1">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 text-center">
              <span 
                className="text-lg sm:text-xl font-bold tracking-tight px-2"
                style={{ 
                  color: theme.primaryColor,
                  fontFamily: titleFontFamily,
                }}
              >
                {data.partner1 || 'Contratante 1'}
              </span>

              <span className="font-cursive text-3xl sm:text-4xl text-[#c5a059] font-normal leading-none my-[-6px]">
                &
              </span>

              <span 
                className="text-lg sm:text-xl font-bold tracking-tight px-2"
                style={{ 
                  color: theme.primaryColor,
                  fontFamily: titleFontFamily,
                }}
              >
                {data.partner2 || 'Contratante 2'}
              </span>
            </div>

            {/* Jurisdiction / City and Start Date */}
            <p className="text-[11px] text-stone-600 font-sans tracking-wide mt-1">
              Residentes na Comarca de <strong className="text-stone-800">{data.city || 'Curitiba'} - {data.state || 'PR'}</strong>, com união iniciada sob os auspícios do destino em{' '}
              <strong className="text-[#72092c]">{formatDateBR(data.startDate)}</strong>.
            </p>
          </div>
        </section>

        {/* ================= CLAUSES & VOWS SECTION ================= */}
        <section className="my-1.5 px-3 py-3 rounded-lg border border-[#c5a059]/30 bg-white/40 backdrop-blur-[1px]">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <div className="h-[1px] w-12 bg-[#c5a059]" />
            <h4 
              className="text-[10px] uppercase font-bold tracking-widest text-[#72092c]"
              style={{ fontFamily: titleFontFamily }}
            >
              Cláusula Pétrea de Amor & Convivência
            </h4>
            <div className="h-[1px] w-12 bg-[#c5a059]" />
          </div>

          <div 
            className="text-justify text-[11px] leading-relaxed text-stone-800 italic px-2 whitespace-pre-line"
            style={{ fontFamily: bodyFontFamily }}
          >
            {data.vows || 'Declaram solenemente amor perpétuo sob todos os céus e luas, selando o compromisso de companheirismo e carinho incondicional.'}
          </div>

          <p className="text-center font-serif text-[9px] uppercase tracking-wider text-stone-500 mt-2">
            « Válido em todo território universal sob a jurisdição soberana do coração »
          </p>
        </section>

        {/* ================= FOOTER / AUTHENTICITY SECTION ================= */}
        <footer className="pt-2 border-t border-[#c5a059]/30">
          
          {/* Spelled-out official date */}
          <p 
            className="text-center italic text-[10px] text-stone-600 mb-3"
            style={{ fontFamily: bodyFontFamily }}
          >
            Lavrado e subscrito {issuedDateText}, perante as testemunhas universais da lealdade e do carinho mútuo.
          </p>

          <div className="grid grid-cols-12 items-end gap-3">
            
            {/* Signatures (Left/Center: 8 cols) */}
            <div className="col-span-8 flex flex-col justify-end">
              <div className="grid grid-cols-2 gap-4 px-1">
                
                {/* Signature 1 */}
                <div className="text-center flex flex-col items-center justify-end">
                  <div 
                    className="h-8 flex items-end justify-center text-lg sm:text-[20px] text-stone-900 tracking-normal select-none pb-1 whitespace-nowrap overflow-visible"
                    style={{ fontFamily: signatureFontFamily, lineHeight: 1.1 }}
                  >
                    {data.signature1 || data.partner1}
                  </div>
                  <div className="w-44 max-w-full border-t border-stone-800/80 mb-1" />
                  <p 
                    className="text-[9.5px] font-bold text-stone-900 tracking-wider text-center uppercase whitespace-nowrap overflow-visible leading-tight"
                    style={{ fontFamily: titleFontFamily }}
                  >
                    {data.partner1 || 'Cônjuge 1'}
                  </p>
                  <p className="text-[8px] font-sans font-semibold text-stone-500 uppercase tracking-widest mt-0.5 whitespace-nowrap leading-tight">
                    Titular do Afeto
                  </p>
                </div>

                {/* Signature 2 */}
                <div className="text-center flex flex-col items-center justify-end">
                  <div 
                    className="h-8 flex items-end justify-center text-lg sm:text-[20px] text-stone-900 tracking-normal select-none pb-1 whitespace-nowrap overflow-visible"
                    style={{ fontFamily: signatureFontFamily, lineHeight: 1.1 }}
                  >
                    {data.signature2 || data.partner2}
                  </div>
                  <div className="w-44 max-w-full border-t border-stone-800/80 mb-1" />
                  <p 
                    className="text-[9.5px] font-bold text-stone-900 tracking-wider text-center uppercase whitespace-nowrap overflow-visible leading-tight"
                    style={{ fontFamily: titleFontFamily }}
                  >
                    {data.partner2 || 'Cônjuge 2'}
                  </p>
                  <p className="text-[8px] font-sans font-semibold text-stone-500 uppercase tracking-widest mt-0.5 whitespace-nowrap leading-tight">
                    Titular do Afeto
                  </p>
                </div>

              </div>

              {/* Bottom security microtext */}
              <div className="mt-3 text-[8px] font-mono font-semibold tracking-wider text-stone-600 text-center uppercase">
                CERTIDÃO ELETRÔNICA EMITIDA CONFORME OS TERMOS DA CONSTITUIÇÃO DO AFETO • DISPENSA RECONHECIMENTO ADICIONAL
              </div>
            </div>

            {/* Official Wax Seal & QR Code (Right: 4 cols) */}
            <div className="col-span-4 flex items-center justify-end gap-2">
              
              {/* Wax Seal 3D */}
              <div className="relative group shrink-0 rotate-[-5deg]">
                {/* Hanging Silk Ribbon */}
                <div 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-12 shadow-md pointer-events-none rounded-b-sm"
                  style={{ backgroundColor: seal.ribbonColor }}
                />

                {/* 3D Wax Seal Circle */}
                <div 
                  className="relative w-16 h-16 rounded-full flex flex-col items-center justify-center text-center p-1.5 shadow-lg border-2 border-white/30 select-none"
                  style={{ 
                    backgroundColor: seal.color,
                    backgroundImage: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.28) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.32) 0%, transparent 70%)'
                  }}
                >
                  <div className="w-full h-full rounded-full border border-dashed border-amber-200/60 flex flex-col items-center justify-center p-0.5">
                    <Heart className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                    <span 
                      className="font-display text-[6.5px] font-extrabold uppercase tracking-tight text-center leading-tight mt-0.5"
                      style={{ color: seal.textColor }}
                    >
                      CARTÓRIO DO AMOR
                    </span>
                    <span className="text-[5.5px] font-sans text-amber-200/90 tracking-widest uppercase font-bold">
                      OFICIAL
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              {data.showQrCode && (
                <div className="shrink-0 p-1.5 bg-white rounded border border-[#c5a059]/60 shadow-sm flex flex-col items-center max-w-[80px]">
                  <QRCodeSVG
                    value={qrCodeTargetUrl}
                    size={46}
                    level="M"
                    fgColor="#1e1b18"
                    bgColor="#ffffff"
                  />
                  <span className="text-[6.5px] font-mono tracking-tighter text-stone-600 mt-0.5 font-bold">
                    ESCANEIE
                  </span>
                  {data.qrPhrase && (
                    <span 
                      className="text-[5.5px] text-stone-700 italic text-center leading-[1.15] mt-0.5 line-clamp-2"
                      style={{ fontFamily: bodyFontFamily }}
                    >
                      "{data.qrPhrase}"
                    </span>
                  )}
                </div>
              )}

            </div>

          </div>

        </footer>

      </div>
    </div>
  );
};
