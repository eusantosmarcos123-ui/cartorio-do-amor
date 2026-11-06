import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Music, 
  Heart, 
  Zap, 
  FileText, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Lock, 
  Sun, 
  Moon,
  MessageSquarePlus,
  Trash2,
  Share2
} from 'lucide-react';
import { CHECKOUT_PLANS, type CheckoutPlan } from '../constants/plansData';
import type { TrialStatus } from '../utils/trialManager';
import { fireLoveConfetti } from '../utils/exportUtils';
import { SubmitFeedbackModal } from './SubmitFeedbackModal';
import { sqlDb, type SqlFeedbackRecord, INITIAL_FEEDBACKS } from '../services/sqlDatabase';

interface VipPlansShowcasePageProps {
  onBackToApp: () => void;
  onSelectPlan: (plan: CheckoutPlan) => void;
  activePlan: CheckoutPlan | null;
  partner1: string;
  partner2: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  trialStatus?: TrialStatus;
  onOpenCouplePage?: () => void;
}

export const VipPlansShowcasePage: React.FC<VipPlansShowcasePageProps> = ({
  onBackToApp,
  onSelectPlan,
  activePlan,
  partner1,
  partner2,
  darkMode,
  onToggleDarkMode,
  trialStatus,
  onOpenCouplePage,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Planos Oficiais & Assinaturas | Cartório do Amor';
    return () => {
      document.title = prevTitle;
    };
  }, []);

  const handleCopyPlansLink = () => {
    const url = `${window.location.origin}/?view=planos`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const coupleDisplay = partner1 && partner2 ? `${partner1} & ${partner2}` : 'Você & Seu Amor';

  const faqs = [
    {
      q: 'Como funciona a ativação via Pix?',
      a: 'Assim que você gera o Pix, abre o aplicativo do seu banco (Nubank, Inter, Itaú, Bradesco, etc.) e realiza o pagamento. Nosso sistema é integrado ao Mercado Pago e Banco Central, detectando a aprovação em menos de 3 segundos automaticamente sem você precisar enviar comprovante.'
    },
    {
      q: 'O que significa a resolução 300 DPI?',
      a: 'DPI é a densidade de pontos por polegada. Uma tela comum exibe 72 a 96 DPI. Já a nossa certidão VIP é renderizada em 300 DPI vetorial, padrão profissional de gráfica, garantindo que ao imprimir em papel couché ou fotográfico A4 ela fique perfeita, sem borrões, pronta para ser emoldurada.'
    },
    {
      q: 'Como funciona o QR Code com música?',
      a: 'Você escolhe a música que marcou a história de vocês (do Spotify ou YouTube) e escreve uma declaração secreta. Quando qualquer pessoa apontar a câmera do celular para a certidão impressa, abrirá uma página especial com fotos de vocês, tocando a música e exibindo os votos!'
    },
    {
      q: 'Posso cancelar a assinatura quando eu quiser?',
      a: 'Sim, você pode solicitar o cancelamento a qualquer momento diretamente pelo site. Para efetuar o cancelamento, a taxa é de R$ 9,99 para o primeiro plano (Certidão Digital Oficial), R$ 19,99 para o segundo plano (Combo VIP Interativo) e R$ 29,99 para o terceiro plano (Pack do Amor Eterno).'
    },
    {
      q: 'E se eu não gostar? Tenho garantia?',
      a: 'Sim! Nosso compromisso é com a sua total satisfação. Caso precise de qualquer ajuste no seu documento ou suporte na personalização da sua certidão, nosso site está pronto para te atender e deixar tudo perfeito.'
    }
  ];

  const [feedbacks, setFeedbacks] = useState<SqlFeedbackRecord[]>(INITIAL_FEEDBACKS);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cartorio_liked_feedbacks') || '[]');
    } catch {
      return [];
    }
  });
  const [userSubmittedIds, setUserSubmittedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cartorio_my_feedbacks') || '[]');
    } catch {
      return [];
    }
  });
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    sqlDb.selectAllFeedbacks().then((list) => {
      if (isMounted && list && list.length > 0) {
        setFeedbacks(list);
      }
    }).catch(console.error);

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmitFeedback = async (newFeedbackData: {
    names: string;
    city: string;
    time: string;
    stars: number;
    comment: string;
    plan: string;
  }) => {
    try {
      const created = await sqlDb.insertFeedback(newFeedbackData);
      setFeedbacks((prev) => [created, ...prev.filter((f) => f.id !== created.id)]);

      const updatedMy = [...userSubmittedIds, created.id];
      setUserSubmittedIds(updatedMy);
      localStorage.setItem('cartorio_my_feedbacks', JSON.stringify(updatedMy));

      fireLoveConfetti();
      setFeedbackToast('Obrigado! Seu depoimento foi publicado oficialmente e já está visível para todo o Brasil ❤️');
      setTimeout(() => setFeedbackToast(null), 6000);

      const el = document.getElementById('historias-de-amor');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeFeedback = async (id: string) => {
    if (likedIds.includes(id)) return;
    const updatedLiked = [...likedIds, id];
    setLikedIds(updatedLiked);
    localStorage.setItem('cartorio_liked_feedbacks', JSON.stringify(updatedLiked));

    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, likes: (f.likes || 0) + 1 } : f))
    );
    await sqlDb.likeFeedback(id);
  };

  const [feedbackToDelete, setFeedbackToDelete] = useState<SqlFeedbackRecord | null>(null);
  const [isDeletingFeedback, setIsDeletingFeedback] = useState(false);

  const handleOpenDeleteModal = (feedback: SqlFeedbackRecord) => {
    setFeedbackToDelete(feedback);
  };

  const handleConfirmDelete = async () => {
    if (!feedbackToDelete) return;
    const target = feedbackToDelete;
    setIsDeletingFeedback(true);
    try {
      await sqlDb.deleteFeedback(target.id);
      setFeedbacks((prev) => prev.filter((f) => f.id !== target.id));
      const updatedMy = userSubmittedIds.filter((item) => item !== target.id);
      setUserSubmittedIds(updatedMy);
      localStorage.setItem('cartorio_my_feedbacks', JSON.stringify(updatedMy));
      setFeedbackToast(`Depoimento de "${target.names}" apagado com sucesso.`);
      setTimeout(() => setFeedbackToast(null), 5000);
    } catch (err) {
      console.error('Erro ao excluir depoimento:', err);
    } finally {
      setIsDeletingFeedback(false);
      setFeedbackToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-rose-200 selection:text-rose-900">
      

      {/* Main Header */}
      <header className="sticky top-0 z-30 border-b border-rose-950/10 dark:border-stone-800 bg-[#fdfbf7]/95 dark:bg-stone-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToApp}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors"
              title="Voltar ao Editor de Certidões"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg sm:text-2xl font-bold tracking-tight text-[#72092c] dark:text-rose-300">
                  Cartório do Amor
                </span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fef3c7] dark:bg-amber-950/80 border border-[#fcd34d] dark:border-amber-700/60 shadow-xs">
                  <Crown className="w-3 h-3 fill-amber-500 text-amber-600" />
                  <span className="text-xs font-bold text-amber-950 dark:text-amber-100">Planos Oficiais</span>
                  <span className="bg-[#f59e0b] text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase leading-none">
                    VIP
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
                Tabela Oficial de Assinaturas & Benefícios Exclusivos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCopyPlansLink}
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
              title="Copiar link direto dos planos (?view=planos)"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />}
              <span className="hidden sm:inline">{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
            </button>

            <button
              type="button"
              onClick={fireLoveConfetti}
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl text-rose-800 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-all flex items-center gap-1.5"
              title="Celebrar com confetes"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Celebrar Amor</span>
            </button>

            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors"
              title="Alternar tema claro/escuro"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            <button
              type="button"
              onClick={onBackToApp}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#72092c] hover:bg-[#580520] shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Editor</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-rose-950/10 dark:border-stone-800 bg-gradient-to-b from-rose-50/70 via-[#fdfbf7] to-amber-50/30 dark:from-stone-900 dark:via-stone-950 dark:to-stone-900">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-rose-400/10 via-amber-300/15 to-rose-400/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-950/80 dark:to-rose-950/80 border border-amber-300/60 dark:border-amber-700/60 text-[#72092c] dark:text-amber-200 text-xs sm:text-sm font-bold shadow-sm mb-6 animate-pulse">
            <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>EXCLUSIVIDADE PARA CASAIS OFICIAIS</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-950 dark:text-stone-50 leading-[1.15] mb-6">
            Eternize a História de{' '}
            <span className="bg-gradient-to-r from-[#72092c] via-[#b81d4f] to-amber-600 bg-clip-text text-transparent">
              {coupleDisplay}
            </span>{' '}
            com Benefícios VIP
          </h1>

          <p className="text-base sm:text-xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Desbloqueie downloads em altíssima resolução gráfica (300 DPI) prontos para quadro, página web interativa do casal com música no QR Code, gerador ilimitado de juramentos com Inteligência Artificial e a coleção completa de documentos de amor.
          </p>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mb-10">
            <div className="flex items-center gap-1.5 bg-white dark:bg-stone-800/80 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Pix Instantâneo Banco Central</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white dark:bg-stone-800/80 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Total Satisfação Garantida</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white dark:bg-stone-800/80 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>Cancelamento Disponível a Qualquer Momento</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white dark:bg-stone-800/80 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>+12.400 Certidões Emitidas</span>
            </div>
          </div>

          {activePlan ? (
            <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Você já possui o plano <strong>{activePlan.name}</strong> ativo!</span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-emerald-200 dark:bg-emerald-900 px-2 py-0.5 rounded-full">
                Ativo
              </span>
            </div>
          ) : trialStatus?.isExpired ? (
            <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-400 dark:border-rose-800 text-rose-900 dark:text-rose-100 flex items-start sm:items-center justify-between gap-3 text-xs shadow-md">
              <div className="flex items-center gap-2.5">
                <Crown className="w-5 h-5 text-rose-600 fill-rose-600 shrink-0" />
                <div className="text-left">
                  <p className="font-extrabold text-sm">Seu Teste Grátis de 30 Dias Expirou!</p>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">
                    Para continuar baixando a certidão oficial em alta resolução (300 DPI) e salvar imagens, selecione seu plano abaixo com 50% de desconto.
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-black bg-rose-200 dark:bg-rose-900 px-2.5 py-1 rounded-full text-rose-900 dark:text-rose-100 shrink-0">
                Expirado
              </span>
            </div>
          ) : trialStatus?.isActive ? (
            <div className="max-w-xl mx-auto p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Você ainda possui <strong>{trialStatus.daysRemaining} dias de teste grátis</strong> (até {trialStatus.endDateFormatted}).</span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-emerald-200 dark:bg-emerald-900 px-2 py-0.5 rounded-full">
                Grátis
              </span>
            </div>
          ) : null}

        </div>
      </section>

      {/* Pricing Cards Grid (The 3 Monthly Plans) */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-[#72092c] dark:text-rose-400 uppercase">
            TABELA OFICIAL DE ASSINATURAS
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 mt-2">
            Escolha o Plano Ideal para o Seu Amor
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base mt-2">
            Todos os planos incluem emissão oficial com validação cartorial, sem fidelidade e com cobrança simples via Pix.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {CHECKOUT_PLANS.map((plan) => {
            const isSelected = activePlan?.id === plan.id;
            const isVip = plan.recommended;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl transition-all duration-300 p-6 sm:p-8 ${
                  isVip
                    ? 'bg-gradient-to-b from-[#fffaf4] to-white dark:from-stone-900 dark:to-stone-950 border-2 border-amber-400 dark:border-amber-500 shadow-2xl shadow-amber-900/10 md:-translate-y-3'
                    : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md hover:shadow-xl'
                }`}
              >
                {/* Top Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-rose-600 text-white font-extrabold text-[10px] sm:text-xs tracking-wider uppercase px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6 pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                      {plan.name}
                    </h3>
                    {isVip && (
                      <Crown className="w-6 h-6 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 min-h-[36px]">
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-stone-400 line-through">
                      R$ {plan.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      50% OFF
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-stone-500 dark:text-stone-400 text-sm font-semibold">R$</span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
                      {plan.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                      {plan.billingPeriod}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Cobrança mensal via Pix • Cancele quando quiser
                  </p>
                </div>

                {/* Features List */}
                <div className="flex-1 mb-8">
                  <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase block mb-3">
                    O que está incluso:
                  </span>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isVip ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA Button */}
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    isVip
                      ? 'bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 text-white hover:brightness-110 shadow-amber-900/20'
                      : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-[#72092c] dark:hover:bg-rose-100'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{isSelected ? 'Plano Já Selecionado' : `Assinar via Pix (R$ ${plan.price.toFixed(2).replace('.', ',')})`}</span>
                </button>

                <p className="text-[10px] text-center text-stone-400 mt-2.5 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Acesso Imediato Após Pagamento</span>
                </p>

              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Deep Dive (Visual Showcase) */}
      <section className="py-16 sm:py-24 bg-rose-50/40 dark:bg-stone-900/50 border-y border-rose-950/10 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
              EXPERIÊNCIA COMPLETA
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 mt-2">
              Por que mais de 12.000 casais assinam o VIP?
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base mt-2">
              Transforme um simples papel em uma recordação eterna e interativa que vai emocionar seu amor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Feature 1: 300 DPI Print */}
            <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center mb-5">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                Qualidade Gráfica de 300 DPI
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                PDF vetorial renderizado com a mesma nitidez de certidões cartoriais reais. Pronta para imprimir em tamanho A4 e colocar em um quadro para decorar o quarto de vocês.
              </p>
              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero borrões ou perda de qualidade</span>
              </div>
            </div>

            {/* Feature 2: QR Code with Music */}
            <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-5">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                QR Code com Música & Carta Interativa
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Aponte o celular e viva a magia: a música especial de vocês começa a tocar automaticamente enquanto a tela exibe uma carta animada e o contador de dias juntos.
              </p>
              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Exclusivo do Pack do Amor Eterno (R$ 29,90)</span>
              </div>
              {onOpenCouplePage && (
                <button
                  type="button"
                  onClick={onOpenCouplePage}
                  className="mt-3.5 w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-stone-750 border border-amber-300/80 dark:border-amber-600/50 text-amber-950 dark:text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                >
                  <Music className="w-4 h-4 text-amber-600" />
                  <span>Ver Demonstração da Página do Casal ao Vivo</span>
                </button>
              )}
            </div>

            {/* Feature 3: AI Vows Generator */}
            <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                Votos Personalizados com IA Ilimitados
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Sem bloqueios de criatividade! Gere juramentos românticos, engraçados, poéticos ou fofos baseados nos nomes e manias do casal com um único clique.
              </p>
              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Gerações ilimitadas sem custo extra</span>
              </div>
            </div>

            {/* Feature 4: 3 Love Documents Pack */}
            <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                Kit com 3 Documentos de Amor
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Além da Certidão de Namoro oficial, receba o Contrato de Convivência Afetiva e o RG do Amor tamanho carteira para carregar sempre com você.
              </p>
              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Disponível no Pack do Amor Eterno</span>
              </div>
            </div>

            {/* Feature 5: No Watermark */}
            <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                100% Sem Marca d'Água e Sem Anúncios
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Seu amor merece ser celebrado com perfeição visual. Nenhum logotipo invasivo ou propaganda estragará seu documento sagrado.
              </p>
              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Visual limpo e luxuoso</span>
              </div>
            </div>

            {/* Feature 6: Monthly Anniversary Updates */}
            <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center mb-5">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                Novas Certidões a Cada Mesversário
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Comemore cada mês juntos emitindo uma nova certidão com fotos atualizadas, novos votos poéticos e temas sazonais (Dia dos Namorados, Natal, Aniversário).
              </p>
              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Edições ilimitadas o ano todo</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Comparison Matrix Table: Gratuito vs VIP */}
      <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-[#72092c] dark:text-rose-400 uppercase">
            COMPARAÇÃO TRANSPARENTE
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 mt-2">
            Plano Gratuito vs. Assinante VIP
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-2">
            Veja exatamente o que você ganha ao se tornar um membro VIP do Cartório do Amor.
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50">
                  <th className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300">
                    Benefício / Recurso
                  </th>
                  <th className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-stone-500 dark:text-stone-400 text-center w-32 sm:w-40">
                    Gratuito
                  </th>
                  <th className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 text-center w-36 sm:w-48 bg-amber-50/50 dark:bg-amber-950/30">
                    Assinante VIP 👑
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs sm:text-sm">
                
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-stone-800 dark:text-stone-200">
                    Resolução para Impressão
                  </td>
                  <td className="p-4 sm:p-5 text-center text-stone-400">
                    96 DPI (Baixa)
                  </td>
                  <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-50/30 dark:bg-amber-950/20">
                    300 DPI Ultra HD
                  </td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-stone-800 dark:text-stone-200">
                    Download do Arquivo PDF A4 Oficial
                  </td>
                  <td className="p-4 sm:p-5 text-center text-stone-400">
                    Bloqueado
                  </td>
                  <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-50/30 dark:bg-amber-950/20">
                    Ilimitado (Sem travamentos)
                  </td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-stone-800 dark:text-stone-200">
                    Página do QR Code com Música no Celular
                  </td>
                  <td className="p-4 sm:p-5 text-center text-stone-400">
                    Apenas texto
                  </td>
                  <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-50/30 dark:bg-amber-950/20">
                    Música 24/7 + Contador
                  </td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-stone-800 dark:text-stone-200">
                    Gerador de Votos com Inteligência Artificial
                  </td>
                  <td className="p-4 sm:p-5 text-center text-stone-400">
                    Apenas 1 teste
                  </td>
                  <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-50/30 dark:bg-amber-950/20">
                    Ilimitado sem limites
                  </td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-stone-800 dark:text-stone-200">
                    Marca d'Água Cartorial
                  </td>
                  <td className="p-4 sm:p-5 text-center text-stone-400">
                    Com marca no documento
                  </td>
                  <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-50/30 dark:bg-amber-950/20">
                    100% Livre de marcas
                  </td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-stone-800 dark:text-stone-200">
                    Cartão de QR Code Individual para Carteira
                  </td>
                  <td className="p-4 sm:p-5 text-center text-stone-400">
                    Bloqueado
                  </td>
                  <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-50/30 dark:bg-amber-950/20">
                    Incluso em PDF
                  </td>
                </tr>

                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-stone-800 dark:text-stone-200">
                    Suporte Direto via WhatsApp
                  </td>
                  <td className="p-4 sm:p-5 text-center text-stone-400">
                    Fila normal
                  </td>
                  <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-50/30 dark:bg-amber-950/20">
                    Prioridade VIP
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section id="historias-de-amor" className="py-16 sm:py-24 bg-gradient-to-b from-[#fdfbf7] to-rose-50/40 dark:from-stone-950 dark:to-stone-900 border-t border-rose-950/10 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest text-[#72092c] dark:text-rose-400 uppercase">
              DEPOIMENTOS REAIS
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 mt-2">
              Histórias de Amor Oficiais
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
              Veja depoimentos de casais reais de todo o Brasil ou conte como foi a experiência de vocês!
            </p>

            {/* Interactive Rating Badge + Submit Feedback Button */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 text-amber-800 dark:text-amber-300 text-xs font-bold shadow-xs">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
                <span>4.9 / 5.0 (+1.480 casais certificados)</span>
              </div>

              <button
                type="button"
                onClick={() => setIsFeedbackModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#72092c] via-rose-700 to-amber-600 hover:from-[#590422] hover:to-amber-700 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4 text-amber-200" />
                <span>Mandar Meu Feedback</span>
                <Heart className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
              </button>
            </div>
          </div>

          {/* Feedback Toast Notification */}
          {feedbackToast && (
            <div className="mb-6 max-w-md mx-auto p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs text-center font-bold flex items-center justify-center gap-2 shadow-sm animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{feedbackToast}</span>
            </div>
          )}

          {/* Grid of Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feedbacks.map((t) => {
              const isLiked = likedIds.includes(t.id);
              return (
                <div 
                  key={t.id}
                  className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(t.stars || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-500" />
                        ))}
                      </div>

                      {t.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verificado</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 italic mb-4 leading-relaxed">
                      "{t.comment}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900 dark:text-stone-100">{t.names}</span>
                        {userSubmittedIds.includes(t.id) && (
                          <span className="text-[9px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 font-bold px-1.5 py-0.2 rounded">Você</span>
                        )}
                      </div>
                      <span className="text-stone-400 text-[11px] block mt-0.5">
                        {t.city} • {t.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Lixeira minimalista no container do depoimento */}
                      <button
                        type="button"
                        onClick={() => handleOpenDeleteModal(t)}
                        className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 active:scale-90 transition-all cursor-pointer border border-stone-200/80 dark:border-stone-700/80 hover:border-rose-300 dark:hover:border-rose-900 shadow-2xs"
                        title="Apagar este depoimento"
                        aria-label="Apagar depoimento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLikeFeedback(t.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                          isLiked
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                            : 'bg-stone-50 dark:bg-stone-800 text-stone-500 hover:text-rose-500 border border-stone-200 dark:border-stone-700'
                        }`}
                        title={isLiked ? 'Você curtiu esta história' : 'Curtir esta história de amor'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-stone-400 group-hover:text-rose-500'}`} />
                        <span className="text-[11px] font-bold">{t.likes || 1}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-[#72092c] dark:text-rose-400 uppercase">
            TIRA-DÚVIDAS
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 mt-2">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 hover:text-[#72092c] dark:hover:text-rose-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-stone-600 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Money-Back Guarantee & CTA Footer */}
      <section className="py-16 bg-gradient-to-r from-[#72092c] via-[#8c1139] to-[#580520] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6 text-amber-300 shadow-xl">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-extrabold mb-4">
            Total Satisfação Garantida
          </h2>

          <p className="text-rose-100 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Nosso compromisso é garantir que você e seu amor fiquem completamente encantados com a sua certidão oficial e tenham a melhor experiência com suporte dedicado para deixar tudo perfeito.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onSelectPlan(CHECKOUT_PLANS[1])}
              className="px-6 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-sm shadow-xl transition-all active:scale-95 flex items-center gap-2"
            >
              <Crown className="w-4 h-4 fill-stone-950" />
              <span>Assinar Combo VIP Interativo (R$ 19,90)</span>
            </button>

            <button
              type="button"
              onClick={onBackToApp}
              className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all active:scale-95 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Editor de Certidões</span>
            </button>
          </div>

        </div>
      </section>

      {/* Footer copyright */}
      <footer className="border-t border-rose-950/10 dark:border-stone-800 py-6 text-center text-xs text-stone-400">
        <p>Cartório do Amor Oficial • Todos os direitos reservados. Emissão com conformidade e segurança via Pix.</p>
      </footer>

      {/* Real Feedback Submission Modal */}
      <SubmitFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleSubmitFeedback}
        defaultNames={partner1 && partner2 ? `${partner1} & ${partner2}` : ''}
        defaultCity="São Paulo, SP"
      />

      {/* Modal de Confirmação de Exclusão de Depoimento */}
      {feedbackToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 max-w-sm w-full border border-stone-200 dark:border-stone-800 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3.5 shadow-xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-display text-lg font-bold text-center text-stone-900 dark:text-stone-100">
              Apagar Depoimento?
            </h3>

            <div className="my-3.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60 text-xs text-stone-600 dark:text-stone-300 italic">
              "{feedbackToDelete.comment}"
              <span className="block mt-1 font-semibold text-stone-800 dark:text-stone-200 not-italic text-[11px]">
                — {feedbackToDelete.names} ({feedbackToDelete.city || 'Brasil'})
              </span>
            </div>

            <p className="text-xs text-center text-stone-500 dark:text-stone-400 mb-5">
              Tem certeza que deseja apagar este depoimento? Esta ação removerá a publicação permanentemente.
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setFeedbackToDelete(null)}
                disabled={isDeletingFeedback}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-xs hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeletingFeedback}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-rose-950/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeletingFeedback ? 'Apagando...' : 'Sim, Apagar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
