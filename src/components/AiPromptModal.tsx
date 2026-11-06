import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, RefreshCw, HeartHandshake, Wand2, MessageSquarePlus, Bot, Check, Shuffle } from 'lucide-react';
import { 
  type VowTone, 
  type VowFormat, 
  VOW_CATEGORIES, 
  VOW_FORMATS, 
  generateVowsWithAI,
  generateVowsWithGeminiOrLocal
} from '../utils/aiVowsGenerator';

interface AiPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVows: (vowsText: string) => void;
  partner1: string;
  partner2: string;
  city: string;
}

export const AiPromptModal: React.FC<AiPromptModalProps> = ({
  isOpen,
  onClose,
  onApplyVows,
  partner1,
  partner2,
  city,
}) => {
  const [selectedTone, setSelectedTone] = useState<VowTone>('romantico');
  const [selectedFormat, setSelectedFormat] = useState<VowFormat>('clausulas');
  const [customPrompt, setCustomPrompt] = useState('');
  const [variationCount, setVariationCount] = useState(1);
  const [aiSource, setAiSource] = useState<'gemini' | 'procedural'>('gemini');
  const [currentVow, setCurrentVow] = useState<{ text: string }>(() => 
    generateVowsWithAI('romantico', partner1, partner2, city, 1, '', 'clausulas')
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async (tone?: VowTone, format?: VowFormat, prompt?: string) => {
    setIsGenerating(true);
    const t = tone || selectedTone;
    const f = format || selectedFormat;
    const p = prompt !== undefined ? prompt : customPrompt;
    
    const seed = Date.now() + Math.floor(Math.random() * 100000);
    try {
      const [res] = await Promise.all([
        generateVowsWithGeminiOrLocal(t, partner1, partner2, city, seed, p, f),
        new Promise((resolve) => setTimeout(resolve, 300))
      ]);
      setCurrentVow({ text: res.text });
      setAiSource(res.source);
      setVariationCount(prev => prev + 1);
    } catch {
      const fallback = generateVowsWithAI(t, partner1, partner2, city, seed, p, f);
      setCurrentVow(fallback);
      setAiSource('procedural');
      setVariationCount(prev => prev + 1);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedTone, selectedFormat, customPrompt, partner1, partner2, city]);

  const handleSelectTone = (tone: VowTone) => {
    setSelectedTone(tone);
    handleGenerate(tone, selectedFormat, customPrompt);
  };

  const handleSelectFormat = (format: VowFormat) => {
    setSelectedFormat(format);
    handleGenerate(selectedTone, format, customPrompt);
  };

  const handleApply = () => {
    onApplyVows(currentVow.text);
    onClose();
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
            className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-rose-950/20 dark:border-stone-700 overflow-hidden z-10 my-auto"
          >
            {/* Header banner */}
            <div className="px-6 py-4 sm:py-5 bg-gradient-to-r from-[#72092c] to-[#9e1b45] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-amber-300">
                  <Wand2 className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-amber-100">
                    Gerador de Votos & Cláusulas do Amor com IA
                  </h3>
                  <p className="text-xs text-rose-200/90">
                    Crie infinitas variações com cláusulas 100% inéditas para {partner1 || 'vocês'} & {partner2 || 'seu par'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar modal"
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[72vh] overflow-y-auto">
              
              {/* 1. Escolha de Sintonia / Tom */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2 block">
                  1. Escolha a sintonia dos votos:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {VOW_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectTone(cat.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        selectedTone === cat.id
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-[#72092c] dark:border-rose-700 ring-2 ring-rose-800/20 shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 hover:border-rose-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-base">{cat.emoji}</span>
                        {selectedTone === cat.id && (
                          <Check className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-stone-900 dark:text-stone-100 leading-tight">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Escolha do Formato das Cláusulas */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5 block">
                  2. Estrutura e Formato do Texto:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {VOW_FORMATS.map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => handleSelectFormat(fmt.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        selectedFormat === fmt.id
                          ? 'bg-stone-900 text-white dark:bg-rose-900 dark:text-white border-transparent shadow-sm'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <span>{fmt.icon}</span>
                      <span>{fmt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Prompt Livre / Detalhe Personalizado (Opcional) */}
              <div className="pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1.5">
                  <MessageSquarePlus className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
                  <span>3. Detalhes ou Instruções Extras para a IA (Opcional):</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleGenerate(selectedTone, selectedFormat, customPrompt);
                      }
                    }}
                    placeholder="Ex: dividir pizza de sexta, passear com o cachorro, café na cama, viagem para Paris..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#72092c]"
                  />
                  <button
                    type="button"
                    onClick={() => handleGenerate(selectedTone, selectedFormat, customPrompt)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#72092c] hover:bg-[#5a0622] transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              {/* 4. Caixa de Prévia com Geração Ilimitada */}
              <div className="pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                      Prévia do Texto Gerado:
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/60 flex items-center gap-1 shadow-sm">
                      <Bot className="w-3 h-3 text-emerald-500 animate-pulse" />
                      <span>{aiSource === 'gemini' ? 'Google Gemini 1.5 Flash AI' : 'Motor Generativo IA'}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300/60">
                      Variação #{variationCount}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleGenerate(selectedTone, selectedFormat, customPrompt)}
                      disabled={isGenerating}
                      className="inline-flex items-center gap-1.5 text-xs text-white font-bold bg-gradient-to-r from-[#72092c] to-[#9e1b45] hover:opacity-95 px-3.5 py-1.5 rounded-xl active:scale-95 transition-all shadow-md shadow-rose-950/20"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>Gerar outra variação com IA</span>
                    </button>
                    
                    <button
                      type="button"
                      title="Sortear estilo aleatório com novas cláusulas"
                      onClick={() => {
                        const randomTone = VOW_CATEGORIES[Math.floor(Math.random() * VOW_CATEGORIES.length)].id;
                        setSelectedTone(randomTone);
                        handleGenerate(randomTone, selectedFormat, customPrompt);
                      }}
                      disabled={isGenerating}
                      className="p-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 active:scale-95 transition-all"
                    >
                      <Shuffle className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                    </button>
                  </div>
                </div>

                <div className="relative p-4 sm:p-5 rounded-2xl bg-amber-50/40 dark:bg-stone-800/60 border border-amber-200/70 dark:border-stone-700 font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-stone-200 min-h-[160px] flex items-center shadow-inner">
                  {isGenerating ? (
                    <div className="flex items-center justify-center w-full py-8 text-stone-400 gap-2">
                      <Sparkles className="w-5 h-5 animate-spin text-[#c5a059]" />
                      <span className="text-xs font-sans font-semibold">Sintetizando novas cláusulas inéditas com IA...</span>
                    </div>
                  ) : (
                    <p className="italic whitespace-pre-line leading-relaxed w-full">"{currentVow.text}"</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-3.5 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-700 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2.5 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#72092c] to-[#9e1b45] hover:opacity-95 shadow-md shadow-rose-950/20 flex items-center gap-2 transition-transform active:scale-95"
              >
                <HeartHandshake className="w-4 h-4 text-amber-300" />
                Aplicar na Certidão
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
