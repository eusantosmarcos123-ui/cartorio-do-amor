import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock } from 'lucide-react';

interface LgpdConsentBannerProps {
  onOpenPrivacyModal: () => void;
}

export const LgpdConsentBanner: React.FC<LgpdConsentBannerProps> = ({ onOpenPrivacyModal }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already acknowledged
    const dismissed = localStorage.getItem('cartorio_lgpd_ack');
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem('cartorio_lgpd_ack', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:right-auto sm:max-w-md z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl border border-rose-950/10 dark:border-stone-700 shadow-2xl p-4 text-stone-800 dark:text-stone-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-[#72092c] dark:text-rose-300 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-[#72092c] dark:text-rose-300" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 dark:text-stone-100">
                <Lock className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
                <span>Privacidade & LGPD</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-snug">
                Seus dados e fotos são processados <strong>100% no seu navegador</strong> e utilizados unicamente para gerar a Certidão do Amor. Nada é salvo em servidores.
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={onOpenPrivacyModal}
                  className="text-[11px] font-semibold text-[#72092c] dark:text-rose-300 hover:underline py-1 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  Ler Política & Termos
                </button>
                <button
                  type="button"
                  onClick={handleAcknowledge}
                  className="text-[11px] font-semibold text-white bg-[#72092c] hover:bg-[#580520] py-1 px-3 rounded-lg shadow-sm transition-transform active:scale-95"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
