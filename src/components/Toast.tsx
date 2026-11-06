import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded-xl shadow-xl border backdrop-blur-md flex items-start gap-3 ${
                isSuccess
                  ? 'bg-rose-950/90 text-white border-rose-800/80 shadow-rose-950/30'
                  : isError
                  ? 'bg-red-950/90 text-white border-red-800/80 shadow-red-950/30'
                  : 'bg-stone-900/90 text-stone-100 border-stone-700/80'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-rose-300" />}
                {isError && <AlertCircle className="w-5 h-5 text-red-300" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-amber-300" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-rose-200/80 mt-1 leading-snug">{toast.description}</p>
                )}
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 text-white/60 hover:text-white transition-colors p-1 rounded-md"
                aria-label="Fechar notificação"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
