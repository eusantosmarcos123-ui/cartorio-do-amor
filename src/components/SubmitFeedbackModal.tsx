import React, { useState, useEffect } from 'react';
import { Heart, Star, Sparkles, X, ShieldCheck } from 'lucide-react';

interface SubmitFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    names: string;
    city: string;
    time: string;
    stars: number;
    comment: string;
    plan: string;
  }) => void;
  defaultNames?: string;
  defaultCity?: string;
  defaultPlan?: string;
}

const TIME_CHIPS = [
  'Juntos há 6 meses',
  'Juntos há 1 ano',
  'Juntos há 2 anos',
  'Juntos há 3 anos',
  'Noivos',
  'Casados',
  'Mais de 5 anos',
  'Amor à primeira vista'
];

const PLAN_OPTIONS = [
  'Combo VIP Interativo (Recomendado)',
  'Pack do Amor Eterno (3 Documentos)',
  'Certidão Digital Oficial (R$ 9,90)',
  'Experiência Gratuita'
];

export const SubmitFeedbackModal: React.FC<SubmitFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultNames = '',
  defaultCity = '',
  defaultPlan = 'Combo VIP Interativo (Recomendado)',
}) => {
  const [names, setNames] = useState(defaultNames);
  const [city, setCity] = useState(defaultCity);
  const [time, setTime] = useState('Juntos há 1 ano');
  const [stars, setStars] = useState<number>(5);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [plan, setPlan] = useState(defaultPlan);
  const [consent, setConsent] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (defaultNames && !names) setNames(defaultNames);
      if (defaultCity && !city) setCity(defaultCity);
      setErrorMsg('');
      setIsSubmitting(false);
    }
  }, [isOpen, defaultNames, defaultCity]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!names.trim()) {
      setErrorMsg('Por favor, informe os nomes do casal (Ex: Vinicius & Beatriz).');
      return;
    }

    if (!comment.trim()) {
      setErrorMsg('Por favor, escreva uma mensagem ou história sobre a experiência de vocês.');
      return;
    }

    if (comment.trim().length < 10) {
      setErrorMsg('O depoimento deve ter pelo menos 10 caracteres.');
      return;
    }

    if (!consent) {
      setErrorMsg('Por favor, confirme a autorização de exibição do depoimento.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        names: names.trim(),
        city: city.trim() || 'Brasil',
        time: time.trim() || 'Juntos com amor',
        stars: stars || 5,
        comment: comment.trim(),
        plan: plan || 'Combo VIP Interativo',
      });
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const getStarLabel = (rating: number) => {
    switch (rating) {
      case 5:
        return 'Perfeito! Experiência inesquecível (5/5) ❤️';
      case 4:
        return 'Muito bom! Adoramos a surpresa (4/5) ✨';
      case 3:
        return 'Bom, atendeu às expectativas (3/5)';
      case 2:
        return 'Regular (2/5)';
      case 1:
        return 'Precisa melhorar (1/5)';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#fdfbf7] dark:bg-stone-900 border-2 border-rose-200 dark:border-stone-700 rounded-3xl shadow-2xl overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="relative bg-gradient-to-r from-[#72092c] via-rose-800 to-amber-700 px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-200 border border-white/20">
                <Heart className="w-5 h-5 fill-rose-300 text-rose-300" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 bg-white/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Depoimento Real
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold mt-1 text-white">
                  Deixar Nosso Depoimento
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-rose-100/90 mt-2 leading-relaxed">
            Sua avaliação será publicada oficialmente na página do Cartório do Amor e ficará visível para milhares de casais em todo o Brasil!
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs flex items-center gap-2">
              <span className="font-bold">Aviso:</span> {errorMsg}
            </div>
          )}

          {/* Nomes do Casal */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Nomes do Casal <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="Ex: Vinicius & Beatriz"
              className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              required
            />
          </div>

          {/* Cidade e Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Cidade & Estado
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: São Paulo, SP ou Curitiba, PR"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Plano / Experiência
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              >
                {PLAN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tempo Juntos (Chips rápidos) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              Tempo de Relacionamento
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {TIME_CHIPS.map((chip) => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => setTime(chip)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                    time === chip
                      ? 'bg-[#72092c] text-white border-[#72092c] font-bold shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-rose-400'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Ou digite personalizado (Ex: 4 anos e 2 meses)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          {/* Avaliação em Estrelas (Interativa) */}
          <div className="bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200/80 dark:border-stone-700 p-3.5 rounded-2xl">
            <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
              Sua Nota de Avaliação <span className="text-rose-600">*</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((starNum) => {
                const isFilled = (hoveredStar ?? stars) >= starNum;
                return (
                  <button
                    type="button"
                    key={starNum}
                    onMouseEnter={() => setHoveredStar(starNum)}
                    onMouseLeave={() => setHoveredStar(null)}
                    onClick={() => setStars(starNum)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    title={`${starNum} estrelas`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        isFilled
                          ? 'fill-amber-400 text-amber-500 drop-shadow-sm'
                          : 'fill-transparent text-stone-300 dark:text-stone-600'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-xs font-bold text-amber-700 dark:text-amber-300">
                {getStarLabel(hoveredStar ?? stars)}
              </span>
            </div>
          </div>

          {/* Depoimento / História */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                Seu Depoimento / Mensagem <span className="text-rose-600">*</span>
              </label>
              <span className={`text-[10px] ${comment.length > 500 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>
                {comment.length}/500 caracteres
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ex: Fiz de surpresa para comemorar nosso aniversário de namoro. Imprimi em papel fotográfico e coloquei numa moldura! Quando ela apontou a câmera pro QR Code e tocou a música no Spotify, foi pura emoção..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none leading-relaxed"
              required
            />
          </div>

          {/* Consent Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600 dark:text-stone-300">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded text-rose-700 focus:ring-rose-500 w-4 h-4"
              />
              <span className="leading-tight">
                Autorizo a exibição pública do nosso depoimento, nomes e cidade no mural oficial de histórias do Cartório do Amor.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !names.trim() || !comment.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#72092c] via-rose-700 to-amber-600 hover:from-[#590422] hover:to-amber-700 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Heart className="w-4 h-4 fill-white animate-pulse" />
              <span>{isSubmitting ? 'Publicando...' : 'Publicar Depoimento Oficial ❤️'}</span>
            </button>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Validação anti-spam • Exibição em tempo real para todo o país</span>
          </div>

        </form>
      </div>
    </div>
  );
};
