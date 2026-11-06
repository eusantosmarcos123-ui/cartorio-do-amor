import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Sparkles, Share, PlusSquare } from 'lucide-react';

interface PwaInstallBannerProps {
  isInstallable: boolean;
  isInstalled: boolean;
  isIos: boolean;
  onInstall: () => Promise<boolean>;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({
  isInstallable,
  isInstalled,
  isIos,
  onInstall,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  // If already installed, dismissed, or not eligible
  if (isInstalled || isDismissed) {
    return null;
  }

  // Only show if browser supports direct prompt or if on iOS
  if (!isInstallable && !isIos) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
    } else {
      await onInstall();
    }
  };

  return (
    <>
      {/* Floating Bottom Installation Banner */}
      <AnimatePresence>
        <motion.aside
          aria-label="Instalar Aplicativo Cartório do Amor"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-20 lg:bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-amber-300/40 dark:border-amber-500/20 rounded-2xl p-4 shadow-2xl shadow-rose-950/20 text-stone-800 dark:text-stone-100"
        >
          <div className="flex items-start gap-3.5">
            {/* App Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#72092c] to-[#9e1b45] p-2 flex items-center justify-center shrink-0 shadow-md border border-amber-300/30">
              <img src="/icon.svg" alt="Ícone Cartório do Amor" className="w-full h-full object-contain" />
            </div>

            {/* Content Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm tracking-tight text-stone-900 dark:text-stone-100">
                  Instalar Cartório do Amor
                </h4>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                Tenha acesso instantâneo na sua tela de início, modo offline e experiência de aplicativo nativo!
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#72092c] to-[#9e1b45] hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isIos ? 'Como Instalar no iPhone' : 'Instalar Aplicativo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDismissed(true)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
                >
                  Agora não
                </button>
              </div>
            </div>

            {/* Close Cross */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg transition-colors"
              aria-label="Fechar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* iOS Instructions Modal */}
      <AnimatePresence>
        {showIosGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-rose-100 dark:border-stone-800 text-stone-900 dark:text-stone-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#72092c] dark:text-rose-400" />
                  <h3 className="font-bold text-base">Instalar no iPhone / iPad</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIosGuide(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700">
                  <span className="w-5 h-5 rounded-full bg-[#72092c] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    1
                  </span>
                  <div>
                    Toque no botão <strong>Compartilhar</strong>{' '}
                    <Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-500" /> na barra inferior do Safari.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700">
                  <span className="w-5 h-5 rounded-full bg-[#72092c] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    2
                  </span>
                  <div>
                    Role as opções para baixo e selecione <strong>Adicionar à Tela de Início</strong>{' '}
                    <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-stone-700 dark:text-stone-200" />.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700">
                  <span className="w-5 h-5 rounded-full bg-[#72092c] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    3
                  </span>
                  <div>
                    Confirme tocando em <strong>Adicionar</strong> no canto superior direito. Pronto!
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="w-full mt-5 py-2.5 rounded-xl bg-[#72092c] hover:bg-[#8b0e2f] text-white font-bold text-xs transition-colors"
              >
                Entendi
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
