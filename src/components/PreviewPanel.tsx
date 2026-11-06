import { useState, useRef, useEffect, useCallback } from 'react';
import { CertificateDocument } from './CertificateDocument';
import { LoveContractDocument } from './LoveContractDocument';
import { LoveIdCardDocument } from './LoveIdCardDocument';
import { ActionToolbar } from './ActionToolbar';
import type { CertificateData } from '../types/certificate';
import type { LoveDocumentType } from '../utils/planFeatures';
import type { FeatureUpgradeData } from './FeatureUpgradeModal';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Scroll, Scale, Heart, Globe } from 'lucide-react';

interface PreviewPanelProps {
  data: CertificateData;
  onDownloadPdf: () => void;
  onDownloadImage: () => void;
  onPrint: () => void;
  onShare: () => void;
  onOpenCouplePage?: () => void;
  isExportingPdf: boolean;
  isExportingImage: boolean;
  isLoggedIn?: boolean;
  isPaid?: boolean;
  selectedDocument?: LoveDocumentType;
  onSelectDocument?: (doc: LoveDocumentType) => void;
  canAccessAllDocuments?: boolean;
  onPromptUpgrade?: (data: FeatureUpgradeData) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
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
  onSelectDocument,
  canAccessAllDocuments = false,
  onPromptUpgrade,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.75);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);

  // A4 standard dimensions at 96 DPI: 210mm (~794px) x 297mm (~1123px)
  const A4_WIDTH_PX = 794;

  const calculateAutoFit = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 40; // horizontal padding
    
    if (containerWidth > 0) {
      const calculatedScale = Math.min(Math.max(containerWidth / A4_WIDTH_PX, 0.35), 1.1);
      setScale(calculatedScale);
    }
  }, []);

  useEffect(() => {
    if (isAutoFit) {
      calculateAutoFit();
    }

    const observer = new ResizeObserver(() => {
      if (isAutoFit) {
        calculateAutoFit();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isAutoFit, calculateAutoFit]);

  const handleZoomIn = () => {
    setIsAutoFit(false);
    setScale((prev) => Math.min(prev + 0.1, 1.4));
  };

  const handleZoomOut = () => {
    setIsAutoFit(false);
    setScale((prev) => Math.max(prev - 0.1, 0.3));
  };

  const handleResetZoom = () => {
    setIsAutoFit(false);
    setScale(1);
  };

  const handleToggleAutoFit = () => {
    setIsAutoFit(true);
    calculateAutoFit();
  };

  return (
    <div className="flex flex-col h-full space-y-3 sm:space-y-4">
      
      {/* Top Action & Zoom Controls Header */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 p-3 sm:p-3.5 bg-white dark:bg-stone-900 rounded-2xl border border-border-romantic dark:border-stone-800 shadow-sm">
        
        {/* Action Toolbar */}
        <div className="flex-1 min-w-0">
          <ActionToolbar
            onDownloadPdf={onDownloadPdf}
            onDownloadImage={onDownloadImage}
            onPrint={onPrint}
            onShare={onShare}
            onOpenCouplePage={onOpenCouplePage}
            isExportingPdf={isExportingPdf}
            isExportingImage={isExportingImage}
            isLoggedIn={isLoggedIn}
            isPaid={isPaid}
          />
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-end gap-1 border-t xl:border-t-0 xl:border-l border-border-romantic/80 dark:border-stone-800 pt-2 xl:pt-0 xl:pl-3 shrink-0">
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-full px-1.5 py-1 gap-1">
            <button
              type="button"
              onClick={handleZoomOut}
              title="Reduzir zoom"
              aria-label="Diminuir zoom"
              className="p-1.5 rounded-full text-stone-600 dark:text-stone-300 hover:text-wine-rich hover:bg-white dark:hover:bg-stone-700 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-200 px-1 text-center select-none">
              {Math.round(scale * 100)}%
            </span>

            <button
              type="button"
              onClick={handleZoomIn}
              title="Aumentar zoom"
              aria-label="Aumentar zoom"
              className="p-1.5 rounded-full text-stone-600 dark:text-stone-300 hover:text-wine-rich hover:bg-white dark:hover:bg-stone-700 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleToggleAutoFit}
              title="Ajustar automaticamente à tela"
              aria-label="Ajustar à tela"
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isAutoFit
                  ? 'bg-wine-rich text-white font-bold shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-wine-rich hover:bg-white dark:hover:bg-stone-700'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              title="Tamanho real (100%)"
              aria-label="Tamanho 100%"
              className="p-1.5 rounded-full text-stone-600 dark:text-stone-300 hover:text-wine-rich hover:bg-white dark:hover:bg-stone-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 3 Documents Selector Tab (Pack do Amor Eterno) */}
      <div className="flex items-center justify-between bg-white dark:bg-stone-900 p-2 rounded-2xl border border-border-romantic dark:border-stone-800 text-xs shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full scrollbar-none">
          <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider px-2 hidden sm:inline shrink-0">
            Documento:
          </span>
          
          {/* Tab 1: Certidão Oficial */}
          <button
            type="button"
            onClick={() => onSelectDocument?.('certidao')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              selectedDocument === 'certidao'
                ? 'bg-blush-tint text-wine-rich ring-1 ring-border-romantic shadow-xs font-bold'
                : 'bg-stone-100 dark:bg-stone-800 text-ink-muted hover:text-wine-rich hover:bg-blush-surface'
            }`}
          >
            <Scroll className="w-3.5 h-3.5" />
            <span>1. Certidão Oficial</span>
          </button>

          {/* Tab 2: Contrato de Amor */}
          <button
            type="button"
            onClick={() => {
              if (!canAccessAllDocuments) {
                onPromptUpgrade?.({
                  title: 'Contrato Oficial de Convivência Afetiva',
                  description: 'O Contrato de Convivência Afetiva faz parte do kit exclusivo com 3 documentos oficiais do Pack do Amor Eterno (R$ 29,90). Faça upgrade para desbloquear!',
                  requiredPlanId: 'completo',
                  featureName: 'Contrato de Convivência Afetiva'
                });
                return;
              }
              onSelectDocument?.('contrato');
            }}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              selectedDocument === 'contrato'
                ? 'bg-gold-light text-amber-950 ring-1 ring-border-gold shadow-xs font-bold'
                : 'bg-stone-100 dark:bg-stone-800 text-ink-muted hover:text-wine-rich hover:bg-blush-surface'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>2. Contrato de Amor</span>
            {!canAccessAllDocuments && (
              <span className="text-[9px] bg-gold-light text-amber-950 ring-1 ring-border-gold font-bold px-1.5 py-0.5 rounded-full uppercase leading-none">
                Pack Eterno
              </span>
            )}
          </button>

          {/* Tab 3: RG do Amor */}
          <button
            type="button"
            onClick={() => {
              if (!canAccessAllDocuments) {
                onPromptUpgrade?.({
                  title: 'RG do Amor Oficial para Carteira',
                  description: 'A Carteira de Identidade do Casal (RG do Amor) faz parte do kit exclusivo com 3 documentos oficiais do Pack do Amor Eterno (R$ 29,90). Faça upgrade para desbloquear!',
                  requiredPlanId: 'completo',
                  featureName: 'RG do Amor'
                });
                return;
              }
              onSelectDocument?.('rg');
            }}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              selectedDocument === 'rg'
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-300 dark:ring-emerald-800 shadow-xs font-bold'
                : 'bg-stone-100 dark:bg-stone-800 text-ink-muted hover:text-wine-rich hover:bg-blush-surface'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. RG do Amor</span>
            {!canAccessAllDocuments && (
              <span className="text-[9px] bg-gold-light text-amber-950 ring-1 ring-border-gold font-bold px-1.5 py-0.5 rounded-full uppercase leading-none">
                Pack Eterno
              </span>
            )}
          </button>

          {/* Tab 4: Página Web Interativa do Casal */}
          {onOpenCouplePage && (
            <button
              type="button"
              onClick={onOpenCouplePage}
              className="px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 hover:opacity-95 text-[#72092c] dark:text-rose-200 border border-rose-300/80 dark:border-rose-900/80 shadow-xs cursor-pointer group"
              title="Abrir Página Web Interativa com Trilha Sonora do YouTube/Spotify 24/7 e Contador"
            >
              <Globe className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 group-hover:rotate-12 transition-transform" />
              <span>4. Página Web do Casal</span>
              <span className="text-[9px] bg-amber-400 text-stone-950 font-black px-1.5 py-0.5 rounded uppercase shadow-xs">
                PACK ETERNO
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Certificate Viewer Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 min-h-[520px] bg-stone-200/70 dark:bg-stone-950/60 rounded-2xl border border-stone-300/80 dark:border-stone-800 p-3 sm:p-6 overflow-auto flex items-start justify-center relative shadow-inner"
      >
        <div 
          className="transition-transform duration-150 origin-top flex justify-center py-2"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            marginBottom: `${(scale - 1) * 1123}px`,
          }}
        >
          {/* Certificate Document Card */}
          <div className="shadow-2xl rounded-sm">
            {selectedDocument === 'contrato' ? (
              <LoveContractDocument data={data} />
            ) : selectedDocument === 'rg' ? (
              <LoveIdCardDocument data={data} />
            ) : (
              <CertificateDocument data={data} />
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
