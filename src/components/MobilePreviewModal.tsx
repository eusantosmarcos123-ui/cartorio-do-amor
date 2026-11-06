import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, ZoomIn, ZoomOut, Maximize2, Crown } from 'lucide-react';
import { CertificateDocument } from './CertificateDocument';
import { LoveContractDocument } from './LoveContractDocument';
import { LoveIdCardDocument } from './LoveIdCardDocument';
import { ActionToolbar } from './ActionToolbar';
import type { CertificateData } from '../types/certificate';
import type { LoveDocumentType } from '../utils/planFeatures';

interface MobilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CertificateData;
  onDownloadPdf: () => void;
  onDownloadImage: () => void;
  onPrint: () => void;
  onShare: () => void;
  isExportingPdf: boolean;
  isExportingImage: boolean;
  isLoggedIn?: boolean;
  isPaid?: boolean;
  selectedDocument?: LoveDocumentType;
  onOpenCouplePage?: () => void;
}

export const MobilePreviewModal: React.FC<MobilePreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  onDownloadPdf,
  onDownloadImage,
  onPrint,
  onShare,
  onOpenCouplePage,
  isExportingPdf,
  isExportingImage,
  isLoggedIn = false,
  isPaid = false,
  selectedDocument = 'certidao',
}) => {
  // A4 standard width in pixels: ~794px
  const A4_WIDTH_PX = 794;

  const getInitialScale = () => {
    if (typeof window === 'undefined') return 0.45;
    const availableWidth = window.innerWidth - 32;
    return Math.min(Math.max(availableWidth / A4_WIDTH_PX, 0.32), 0.95);
  };

  const [scale, setScale] = useState<number>(getInitialScale);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);

  const calculateMobileAutoFit = useCallback(() => {
    const availableWidth = window.innerWidth - 32;
    if (availableWidth > 0) {
      const computedScale = Math.min(Math.max(availableWidth / A4_WIDTH_PX, 0.32), 0.95);
      setScale(computedScale);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (isOpen && isAutoFit) {
        calculateMobileAutoFit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, isAutoFit, calculateMobileAutoFit]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 lg:hidden flex flex-col bg-stone-950 text-white"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-stone-900 border-b border-stone-800 shrink-0">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-300" />
              <span className="font-display font-bold text-sm tracking-wide">
                Prévia Oficial do Documento
              </span>
            </div>

            {/* Mobile Zoom Tools */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsAutoFit(false);
                  setScale((prev) => Math.max(prev - 0.08, 0.25));
                }}
                className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
                aria-label="Diminuir zoom"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAutoFit(false);
                  setScale((prev) => Math.min(prev + 0.08, 1.2));
                }}
                className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
                aria-label="Aumentar zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAutoFit(true);
                  calculateMobileAutoFit();
                }}
                className="p-1.5 rounded-lg bg-stone-800 text-amber-300 hover:text-white"
                aria-label="Ajustar à largura da tela"
                title="Ajustar à tela"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-rose-950 text-rose-200 hover:bg-rose-900 ml-1"
                aria-label="Fechar visualização"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Toolbar on mobile (Top Quick Access) */}
          <div className="p-2.5 bg-stone-900/95 border-b border-stone-800 shrink-0">
            <ActionToolbar
              onDownloadPdf={onDownloadPdf}
              onDownloadImage={onDownloadImage}
              onPrint={onPrint}
              onShare={onShare}
              onOpenCouplePage={() => {
                onClose();
                onOpenCouplePage?.();
              }}
              isExportingPdf={isExportingPdf}
              isExportingImage={isExportingImage}
              isLoggedIn={isLoggedIn}
              isPaid={isPaid}
            />
          </div>

          {/* Scrollable Document Area with Dynamic Auto-Scale */}
          <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-stone-900/40">
            <div 
              className="origin-top transition-transform duration-150 py-2 shadow-2xl"
              style={{
                transform: `scale(${scale})`,
                marginBottom: `${(scale - 1) * 1123}px`,
              }}
            >
              {selectedDocument === 'contrato' ? (
                <LoveContractDocument data={data} />
              ) : selectedDocument === 'rg' ? (
                <LoveIdCardDocument data={data} />
              ) : (
                <CertificateDocument data={data} />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface MobileBottomBarProps {
  onOpenPreview: () => void;
  onDownloadPdf: () => void;
  onOpenPlans?: () => void;
  isExportingPdf: boolean;
  isLoggedIn?: boolean;
  isPaid?: boolean;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onOpenPreview,
  onDownloadPdf,
  onOpenPlans,
  isExportingPdf,
  isLoggedIn = false,
  isPaid = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 p-2.5 sm:p-3 shadow-2xl flex items-center gap-2 sm:gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      {/* Planos Oficiais */}
      {onOpenPlans && (
        <button
          type="button"
          onClick={onOpenPlans}
          className="py-2 px-3 rounded-full border border-[#fcd34d] dark:border-amber-700 bg-[#fef3c7] dark:bg-amber-950/80 text-amber-950 dark:text-amber-100 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs shrink-0 cursor-pointer"
          title="Conhecer Benefícios e Planos Oficiais VIP (?view=planos)"
        >
          <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Planos Oficiais</span>
          <span className="bg-[#f59e0b] text-stone-950 text-[10px] font-black px-1.5 py-0.5 rounded-md leading-none shadow-xs">
            VIP
          </span>
        </button>
      )}

      {/* Espiar Certidão */}
      <button
        type="button"
        onClick={onOpenPreview}
        className="flex-1 py-3 px-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm cursor-pointer"
      >
        <Eye className="w-4 h-4 text-[#72092c] dark:text-rose-400" />
        <span>Espiar</span>
      </button>

      {/* Baixar / Concluir */}
      <button
        type="button"
        onClick={onDownloadPdf}
        disabled={isExportingPdf}
        className="flex-1 py-3 px-3.5 rounded-xl bg-[#72092c] hover:bg-[#580520] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/20 active:scale-95 transition-all cursor-pointer"
      >
        <span className="text-amber-300">{isPaid ? '✨' : '🔒'}</span>
        <span>
          {isExportingPdf 
            ? 'Gerando...' 
            : isPaid 
              ? (isLoggedIn ? 'Baixar PDF' : 'Baixar')
              : 'Assinar & Baixar'}
        </span>
      </button>
    </div>
  );
};
