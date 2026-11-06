import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { 
  QrCode, 
  X, 
  Printer, 
  Download, 
  Globe2, 
  Sparkles, 
  Heart, 
  Check, 
  Loader2,
  Copy
} from 'lucide-react';
import { QR_LANGUAGES } from '../constants/initialData';
import { fireLoveConfetti } from '../utils/exportUtils';

interface QrCodeCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner1: string;
  partner2: string;
  secretMessage: string;
  qrPhrase: string;
  qrLanguage: string;
  onMessageChange: (msg: string) => void;
  onPhraseChange: (phrase: string) => void;
  onLanguageChange: (lang: string) => void;
  isLoggedIn?: boolean;
  onRequireLogin?: () => void;
  isPaid?: boolean;
  onRequirePlan?: () => void;
}

export const QrCodeCardModal: React.FC<QrCodeCardModalProps> = ({
  isOpen,
  onClose,
  partner1,
  partner2,
  secretMessage,
  qrPhrase,
  qrLanguage,
  onMessageChange,
  onPhraseChange,
  onLanguageChange,
  isLoggedIn = false,
  onRequireLogin,
  isPaid = false,
  onRequirePlan,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectLanguage = (langId: string) => {
    onLanguageChange(langId);
    const selected = QR_LANGUAGES.find((l) => l.id === langId);
    if (selected) {
      onPhraseChange(selected.sample);
    }
  };

  const handlePrintCard = () => {
    if (!isPaid && onRequirePlan) {
      onRequirePlan();
      return;
    }
    if (!isLoggedIn && onRequireLogin) {
      onRequireLogin();
      return;
    }
    window.print();
  };

  const handleDownloadCard = async () => {
    if (!isPaid && onRequirePlan) {
      onRequirePlan();
      return;
    }
    if (!isLoggedIn && onRequireLogin) {
      onRequireLogin();
      return;
    }
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#faf8f5',
      });
      const link = document.createElement('a');
      link.download = `cartao-qrcode-amor-${partner1 || 'casal'}.png`.toLowerCase().replace(/\s+/g, '-');
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      fireLoveConfetti();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(secretMessage || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden z-10 my-6 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#72092c] to-[#9e1b45] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-amber-300">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-amber-100">
                    Gerador & Cartão de QR Code Individual
                  </h3>
                  <p className="text-xs text-rose-200/90">
                    Personalize a mensagem secreta, a frase curta e imprima seu cartão colecionável
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar gerador de QR Code"
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Grid Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Form & Language Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* 1. QR Code Destination Content */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    Conteúdo do QR Code (Link de Música, Declaração ou URL)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={secretMessage}
                      onChange={(e) => onMessageChange(e.target.value)}
                      placeholder="Ex: Link do Spotify da música do casal, vídeo do YouTube ou mensagem..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#72092c]"
                    />
                    <button
                      type="button"
                      onClick={handleCopyContent}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-stone-200 dark:bg-stone-700 text-[11px] font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-300 flex items-center gap-1"
                      title="Copiar conteúdo"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                {/* 2. Seletor de Idiomas */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
                    Selecione o Idioma da Frase Curta
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto p-1 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700">
                    {QR_LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => handleSelectLanguage(lang.id)}
                        className={`p-2 rounded-lg text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                          qrLanguage === lang.id
                            ? 'bg-rose-900 text-white border-rose-950 shadow-sm'
                            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-rose-300'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span>{lang.flag}</span>
                          <span className="truncate">{lang.label}</span>
                        </span>
                        {qrLanguage === lang.id && <Check className="w-3 h-3 text-amber-300 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Frase Curta Personalizada */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Frase Curta Personalizada (Abaixo do QR Code)
                  </label>
                  <input
                    type="text"
                    value={qrPhrase}
                    onChange={(e) => onPhraseChange(e.target.value)}
                    placeholder="Digite sua frase romântica em qualquer idioma..."
                    maxLength={140}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#72092c]"
                  />
                  <div className="flex justify-between items-center mt-1 px-1">
                    <span className="text-[10px] text-stone-400">
                      Exibida no cartão individual e no rodapé da certidão oficial.
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {qrPhrase.length}/140
                    </span>
                  </div>
                </div>

              </div>

              {/* Right Column: Interactive Card Preview & Actions (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block text-center">
                  Prévia do Cartão de QR Code
                </span>

                {/* Printable QR Code Card Target */}
                <div
                  ref={cardRef}
                  id="individual-qr-card"
                  className="w-full max-w-[270px] bg-[#faf8f5] text-stone-900 p-5 rounded-2xl border-2 border-[#c5a059] shadow-xl text-center relative overflow-hidden flex flex-col items-center justify-between min-h-[340px]"
                  style={{
                    backgroundImage: 'radial-gradient(#c5a05930 0.75px, transparent 0.75px)',
                    backgroundSize: '12px 12px',
                  }}
                >
                  {/* Decorative Borders */}
                  <div className="absolute inset-1.5 border border-[#c5a059]/50 rounded-xl pointer-events-none" />

                  {/* Top Crest */}
                  <div className="flex flex-col items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#72092c] text-amber-200 flex items-center justify-center shadow-md mb-1 border border-amber-300/40">
                      <Heart className="w-4 h-4 fill-amber-200" />
                    </div>
                    <span className="font-display font-bold text-[10px] uppercase tracking-widest text-[#72092c]">
                      Cartório do Amor
                    </span>
                    <span className="text-[11px] font-display font-semibold text-stone-700 truncate max-w-[200px]">
                      {partner1 || 'Cônjuge 1'} & {partner2 || 'Cônjuge 2'}
                    </span>
                  </div>

                  {/* QR Code Graphic */}
                  <div className="p-3 bg-white rounded-xl border border-[#c5a059]/60 shadow-md my-1">
                    <QRCodeSVG
                      value={secretMessage || 'https://cartorio-do-amor-nine.vercel.app'}
                      size={135}
                      level="H"
                      fgColor="#1e1b18"
                      bgColor="#ffffff"
                    />
                  </div>

                  {/* Bottom Phrase */}
                  <div className="mt-2 text-center px-2">
                    <p className="font-serif italic text-xs leading-snug text-stone-800">
                      "{qrPhrase || 'Escaneie para abrir nossa história de amor'}"
                    </p>
                    <span className="text-[7.5px] font-mono uppercase tracking-wider text-stone-400 block mt-1.5">
                      OFICIALMENTE REGISTRADO NO CARTÓRIO DO AFETO
                    </span>
                  </div>
                </div>

                {/* Individual Action Buttons */}
                <div className="w-full max-w-[270px] space-y-2">
                  <button
                    type="button"
                    onClick={handlePrintCard}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#72092c] hover:bg-[#580520] text-white font-bold text-xs shadow-md shadow-rose-950/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>Imprimir Cartão QR Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadCard}
                    disabled={isExporting}
                    className="w-full py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5 text-[#72092c]" />}
                    <span>Salvar Imagem (PNG)</span>
                  </button>
                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs text-stone-500 shrink-0">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-600" />
                <span>Compatível com câmeras de qualquer smartphone iOS & Android</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 font-semibold transition-colors"
              >
                Concluir
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
