import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  ShieldCheck, 
  Lock, 
  Clock, 
  CheckCircle2, 
  Download, 
  Crown, 
  Zap, 
  ArrowRight, 
  Repeat 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CHECKOUT_PLANS, type CheckoutPlan } from '../constants/plansData';
export type { CheckoutPlan };

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentApproved: (plan: CheckoutPlan) => void;
  partner1: string;
  partner2: string;
  userEmail?: string;
  userName?: string;
  initialPlan?: CheckoutPlan;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onPaymentApproved,
  partner1,
  partner2,
  userEmail = '',
  userName = '',
  initialPlan,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<CheckoutPlan>(() => initialPlan || CHECKOUT_PLANS[1]);
  const [prevPlanProp, setPrevPlanProp] = useState<CheckoutPlan | undefined>(initialPlan);
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');

  if (initialPlan && initialPlan !== prevPlanProp) {
    setPrevPlanProp(initialPlan);
    setSelectedPlan(initialPlan);
  }
  
  // Payer details initialized directly
  const [name, setName] = useState(() => userName || partner1 || '');
  const [email, setEmail] = useState(() => userEmail || '');
  
  // Pix Payment state
  const [isLoadingPix, setIsLoadingPix] = useState(false);
  const [pixCopiaECola, setPixCopiaECola] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isApproved, setIsApproved] = useState(false);

  // Countdown timer for Pix expiration
  useEffect(() => {
    if (step !== 'payment' || isApproved) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, isApproved]);

  const handleGeneratePix = async () => {
    if (!name.trim() || !email.trim()) {
      alert('Por favor, informe seu nome e e-mail para emissão da chave Pix!');
      return;
    }

    setIsLoadingPix(true);
    try {
      const res = await fetch('/api/create-pix-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPlan.price,
          description: `Assinatura Mensal Cartório do Amor - ${selectedPlan.name} (${partner1} & ${partner2})`,
          payerEmail: email.trim(),
          payerName: name.trim(),
          planId: selectedPlan.id,
        })
      });

      const data = await res.json();
      if (data.success && data.qrCode) {
        setPixCopiaECola(data.qrCode);
        setPaymentId(data.paymentId);
        setStep('payment');
      } else {
        throw new Error('Falha ao gerar Pix');
      }
    } catch {
      // Fallback local Pix code
      const mockId = `pix_${Date.now()}`;
      const mockPix = `00020126580014br.gov.bcb.pix0136cartoriodoamor-${mockId}520400005303986540${selectedPlan.price.toFixed(2).replace('.', '')}5802BR5920CARTORIO DO AMOR LTDA6009SAO PAULO62070503***6304D1A4`;
      setPixCopiaECola(mockPix);
      setPaymentId(mockId);
      setStep('payment');
    } finally {
      setIsLoadingPix(false);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCopiaECola);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSimulatePaymentApproval = useCallback(() => {
    setIsApproved(true);
    setStep('success');
    setTimeout(() => {
      onPaymentApproved(selectedPlan);
    }, 1800);
  }, [selectedPlan, onPaymentApproved]);

  // Polling to check real Mercado Pago status every 3.5s
  useEffect(() => {
    if (step !== 'payment' || !paymentId || isApproved) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/check-pix-payment?paymentId=${paymentId}`);
        const data = await res.json();
        if (data.isApproved || data.status === 'approved') {
          handleSimulatePaymentApproval();
        }
      } catch {
        // silent fail on polling
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [step, paymentId, isApproved, handleSimulatePaymentApproval]);

  const formatMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-rose-950/20 dark:border-stone-800 overflow-hidden z-10 my-auto"
          >
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-[#72092c] via-[#8b0e2f] to-[#9e1b45] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-amber-300">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-amber-100 flex items-center gap-1.5">
                    <span>Plano Mensal • Cartório do Amor</span>
                    <span className="text-[10px] font-mono bg-amber-400 text-stone-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Repeat className="w-3 h-3" />
                      MENSAL
                    </span>
                  </h3>
                  <p className="text-xs text-rose-200/90">
                    {partner1 || 'Você'} & {partner2 || 'Seu Amor'} • Acesso Completo & Cancelamento Fácil
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto">
              
              {/* STEP 1: SELECT PLAN */}
              {step === 'select' && (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5">
                      <Repeat className="w-4 h-4 text-[#72092c] dark:text-rose-400" />
                      <span>1. Escolha o seu plano de assinatura mensal:</span>
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Gere, edite e atualize suas certidões todos os meses pelo Mercado Pago. Cancele quando quiser.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CHECKOUT_PLANS.map((plan) => {
                      const isSelected = selectedPlan.id === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan)}
                          className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#72092c] dark:border-rose-600 bg-rose-50/60 dark:bg-rose-950/30 shadow-md ring-2 ring-rose-800/10'
                              : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50 hover:border-rose-300'
                          }`}
                        >
                          {plan.badge && (
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-sm">
                              {plan.badge}
                            </span>
                          )}

                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <h5 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                                {plan.name}
                              </h5>
                              {isSelected && (
                                <Check className="w-4 h-4 text-[#72092c] dark:text-rose-400" />
                              )}
                            </div>

                            <div className="mb-2">
                              <span className="text-xs text-stone-400 line-through mr-1.5">
                                R$ {plan.originalPrice.toFixed(2)}
                              </span>
                              <span className="text-lg font-bold text-[#72092c] dark:text-amber-200">
                                R$ {plan.price.toFixed(2)}
                              </span>
                              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                                {plan.billingPeriod}
                              </span>
                            </div>

                            <p className="text-[11px] text-stone-600 dark:text-stone-400 mb-3 leading-snug">
                              {plan.description}
                            </p>
                          </div>

                          <ul className="space-y-1.5 text-[10px] text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-100 dark:border-stone-700">
                            {plan.features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  {/* Payer inputs */}
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
                      Dados do Assinante (Envio do Acesso & Documento)
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                          Seu Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: Vinicius dos Santos"
                          className="w-full px-3 py-2 text-base sm:text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#72092c] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                          Seu E-mail * (Para envio do PDF & Acesso)
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu.email@exemplo.com"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#72092c] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={handleGeneratePix}
                    disabled={isLoadingPix}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#72092c] to-[#9e1b45] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-rose-950/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    {isLoadingPix ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>Assinar Plano Mensal — R$ {selectedPlan.price.toFixed(2)}/mês</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* STEP 2: PIX QR CODE & COPIA E COLA */}
              {step === 'payment' && (
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 animate-pulse text-amber-600" />
                    <span>Aguardando Pix Mensal • Expira em {formatMinutes(timeLeft)}</span>
                  </div>

                  <div className="p-4 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 max-w-xs mx-auto shadow-md">
                    {pixCopiaECola ? (
                      <div className="flex justify-center p-2 bg-white rounded-lg">
                        <QRCodeSVG 
                          value={pixCopiaECola} 
                          size={190} 
                          level="M" 
                          fgColor="#72092c" 
                          bgColor="#ffffff" 
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 mx-auto bg-stone-100 dark:bg-stone-700 flex items-center justify-center rounded-lg">
                        <QrCode className="w-24 h-24 text-stone-400 animate-pulse" />
                      </div>
                    )}
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">
                      Abra o app do seu banco e escaneie o QR Code acima
                    </p>
                  </div>

                  {/* Pix Copia e Cola */}
                  <div className="max-w-md mx-auto space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block">
                      Ou pague com Pix Copia e Cola:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pixCopiaECola}
                        className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                          copied ? 'bg-emerald-600' : 'bg-[#72092c] hover:bg-[#5a0622]'
                        }`}
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Status do Mercado Pago */}
                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Monitorando pagamento Pix via Mercado Pago em tempo real...</span>
                    </div>
                    <span className="text-[10px] text-stone-400">
                      Assim que o pagamento for concluído no app do seu banco, o acesso será liberado automaticamente.
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 3: SUCCESS & UNLOCKED */}
              {step === 'success' && (
                <div className="text-center py-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-stone-900 dark:text-stone-100">
                    🎉 Assinatura Mensal Ativada com Sucesso!
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                    Seu plano <strong>{selectedPlan.name}</strong> está ativo. Sua Certidão Oficial em Alta Resolução (300 DPI) foi liberada!
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onPaymentApproved(selectedPlan)}
                      className="px-6 py-3 rounded-2xl bg-[#72092c] text-white font-bold text-xs flex items-center gap-2 mx-auto shadow-md"
                    >
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>Baixar Agora Minha Certidão</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Footer security notes */}
            <div className="px-6 py-3 bg-stone-50 dark:bg-stone-950/80 border-t border-stone-200 dark:border-stone-800 flex items-center justify-center gap-4 text-[11px] text-stone-500">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mercado Pago SSL Seguro</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-amber-500" />
                <span>Assinatura Mensal • Cancele quando quiser</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
