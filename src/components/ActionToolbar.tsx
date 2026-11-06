import { Download, Printer, Share2, Image as ImageIcon, Loader2, Lock, Globe } from 'lucide-react';

interface ActionToolbarProps {
  onDownloadPdf: () => void;
  onDownloadImage: () => void;
  onPrint: () => void;
  onShare: () => void;
  onOpenCouplePage?: () => void;
  isExportingPdf: boolean;
  isExportingImage: boolean;
  isLoggedIn?: boolean;
  isPaid?: boolean;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onDownloadPdf,
  onDownloadImage,
  onPrint,
  onShare,
  onOpenCouplePage,
  isExportingPdf,
  isExportingImage,
  isLoggedIn = false,
  isPaid = false,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full">
      {/* Primary Hero Action: Download PDF */}
      <button
        type="button"
        onClick={onDownloadPdf}
        disabled={isExportingPdf || isExportingImage}
        className="flex-1 sm:flex-initial relative group overflow-hidden px-5 py-2.5 rounded-full bg-wine-rich hover:bg-wine-deep active:scale-[0.98] text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_4px_14px_rgba(114,9,44,0.25)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        aria-label="Baixar Certidão Oficial em PDF A4"
        title={isPaid ? 'Baixar Certidão Oficial em PDF A4' : 'Oficializar e Baixar via Pix'}
      >
        {/* Subtle shine light effect across button */}
        <span className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[200%] transition-all duration-1000 ease-in-out pointer-events-none" />

        {isExportingPdf ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-gold-light" />
            <span>Gerando PDF A4...</span>
          </>
        ) : (
          <>
            {isPaid ? (
              <Download className="w-4 h-4 text-gold-light" />
            ) : (
              <Lock className="w-4 h-4 text-gold-light" />
            )}
            <span>{isPaid ? 'Baixar PDF Oficial' : 'Oficializar & Baixar (PDF)'}</span>
            {!isPaid && (
              <span className="text-[10px] bg-gold-light text-amber-950 px-2 py-0.5 rounded-full font-bold uppercase ring-1 ring-border-gold">
                PIX
              </span>
            )}
          </>
        )}
      </button>

      {/* Secondary: PNG Image (for Instagram / TikTok / WhatsApp) */}
      <button
        type="button"
        onClick={onDownloadImage}
        disabled={isExportingPdf || isExportingImage}
        className="px-4 py-2.5 rounded-full bg-blush-surface dark:bg-stone-800 text-wine-rich dark:text-rose-300 hover:bg-blush-tint dark:hover:bg-stone-700 ring-1 ring-border-romantic dark:ring-stone-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-xs active:scale-[0.98] cursor-pointer"
        aria-label="Salvar Imagem em Alta Resolução (PNG)"
        title={isPaid ? 'Salvar imagem em alta resolução (PNG)' : 'Requer plano assinado para salvar imagem'}
      >
        {isExportingImage ? (
          <Loader2 className="w-4 h-4 animate-spin text-wine-rich" />
        ) : !isPaid ? (
          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        ) : (
          <ImageIcon className="w-4 h-4 text-wine-rich dark:text-rose-400" />
        )}
        <span className="hidden sm:inline">Salvar (PNG)</span>
        <span className="sm:hidden">PNG</span>
      </button>

      {/* Secondary: Print A4 */}
      <button
        type="button"
        onClick={onPrint}
        className="px-3.5 py-2.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-xs active:scale-[0.98] cursor-pointer"
        aria-label="Imprimir Certidão"
        title={isPaid ? 'Imprimir folha A4 oficial' : 'Requer plano assinado para imprimir'}
      >
        {!isPaid ? (
          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        ) : (
          <Printer className="w-4 h-4 text-stone-600 dark:text-stone-300" />
        )}
        <span className="hidden md:inline">Imprimir</span>
      </button>

      {/* Secondary: Share */}
      <button
        type="button"
        onClick={onShare}
        className="px-3.5 py-2.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-xs active:scale-[0.98] cursor-pointer"
        aria-label="Compartilhar Certidão"
        title={isLoggedIn ? 'Compartilhar ou copiar link' : 'Modo Prévia: Requer login para compartilhar'}
      >
        {!isLoggedIn ? (
          <Lock className="w-4 h-4 text-stone-600 dark:text-stone-300" />
        ) : (
          <Share2 className="w-4 h-4 text-stone-600 dark:text-stone-300" />
        )}
        <span className="hidden md:inline">Compartilhar</span>
      </button>

      {/* VIP Couple Web Page Direct Action */}
      {onOpenCouplePage && (
        <button
          type="button"
          onClick={onOpenCouplePage}
          className="px-4 py-2.5 rounded-full bg-gold-light hover:bg-[#ffdea5] text-amber-950 ring-1 ring-border-gold font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-xs active:scale-[0.98] cursor-pointer"
          aria-label="Abrir Página Web Interativa do Casal"
          title="Ver página interativa com música 24/7 e contador em tempo real"
        >
          <Globe className="w-4 h-4 text-amber-700" />
          <span className="hidden sm:inline">Página Web VIP</span>
        </button>
      )}
    </div>
  );
};
