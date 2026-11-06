import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { CHECKOUT_PLANS, type CheckoutPlan } from '../constants/plansData';

export interface FeatureUpgradeData {
  title: string;
  description: string;
  requiredPlanId: 'vip' | 'completo';
  featureName: string;
}

interface FeatureUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FeatureUpgradeData | null;
  onUpgradeToPlan: (plan: CheckoutPlan) => void;
  onOpenPlansPage?: () => void;
}

export const FeatureUpgradeModal: React.FC<FeatureUpgradeModalProps> = ({
  isOpen,
  onClose,
  data,
  onUpgradeToPlan,
  onOpenPlansPage,
}) => {
  if (!data) return null;

  const targetPlan = CHECKOUT_PLANS.find((p) => p.id === data.requiredPlanId) || CHECKOUT_PLANS[1];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-300 dark:border-amber-700/60 overflow-hidden z-10"
          >
            {/* Header with Golden Accent */}
            <div className="bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 p-6 text-white text-center relative">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-amber-200 shadow-md">
                <Crown className="w-6 h-6 fill-amber-200" />
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest bg-white/25 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Recurso Exclusivo
              </span>

              <h3 className="font-display text-xl sm:text-2xl font-bold">
                {data.title}
              </h3>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-stone-800 dark:text-stone-200">
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed text-center">
                {data.description}
              </p>

              {/* Target Plan Highlight Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50/50 dark:from-stone-800 dark:to-stone-850 border border-amber-300/80 dark:border-amber-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      PLANO RECOMENDADO
                    </span>
                    <h4 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                      {targetPlan.name}
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-400 line-through block">
                      R$ {targetPlan.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-base sm:text-lg font-black text-[#72092c] dark:text-rose-400">
                      R$ {targetPlan.price.toFixed(2).replace('.', ',')}/mês
                    </span>
                  </div>
                </div>

                <div className="border-t border-amber-200/60 dark:border-stone-700 pt-2.5">
                  <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 block mb-1.5">
                    O que você desbloqueia:
                  </span>
                  <ul className="space-y-1 text-xs">
                    {targetPlan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onUpgradeToPlan(targetPlan);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:brightness-105 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Fazer Upgrade via Pix por R$ {targetPlan.price.toFixed(2).replace('.', ',')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onOpenPlansPage && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPlansPage();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-300 dark:border-amber-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>Comparar Todos os Planos Oficiais (?view=planos)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 px-4 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Continuar com meu plano atual
                </button>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
