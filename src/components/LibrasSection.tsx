import { useState } from 'react';
import { Eye, Check, Sparkles } from 'lucide-react';

interface LibrasSectionProps {
  showLibrasSign: boolean;
  librasCustomNote: string;
  partner1: string;
  partner2: string;
  onToggleShowLibras: (show: boolean) => void;
  onNoteChange: (note: string) => void;
}

// Dactylology dictionary with description of hand positions in Libras
const LIBRAS_ALPHABET: Record<string, { letter: string; description: string }> = {
  A: { letter: 'A', description: 'Punho fechado com o polegar ereto ao lado do indicador' },
  B: { letter: 'B', description: 'Quatro dedos estendidos para cima e polegar dobrado na palma' },
  C: { letter: 'C', description: 'Mão curvada no formato da letra C' },
  D: { letter: 'D', description: 'Indicador apontado para cima com os outros dedos formando um círculo' },
  E: { letter: 'E', description: 'Dedos dobrados com as pontas tocando o polegar' },
  F: { letter: 'F', description: 'Indicador dobrado com o polegar pelo lado de fora' },
  G: { letter: 'G', description: 'Indicador e polegar estendidos paralelos apontando para cima' },
  H: { letter: 'H', description: 'Dedos médio e indicador estendidos com polegar no meio em rotação' },
  I: { letter: 'I', description: 'Dedo mínimo estendido para cima e punho fechado' },
  J: { letter: 'J', description: 'Dedo mínimo desenhando a letra J no ar' },
  K: { letter: 'K', description: 'Indicador e médio para cima com polegar apoiado no meio' },
  L: { letter: 'L', description: 'Polegar e indicador formando um ângulo de 90° (L)' },
  M: { letter: 'M', description: 'Três dedos estendidos apontando para baixo' },
  N: { letter: 'N', description: 'Dois dedos estendidos apontando para baixo' },
  O: { letter: 'O', description: 'Todos os dedos unidos formando um círculo perfeito' },
  P: { letter: 'P', description: 'Formato da letra K apontando para baixo' },
  Q: { letter: 'Q', description: 'Indicador e polegar apontados para baixo' },
  R: { letter: 'R', description: 'Dedos indicador e médio cruzados' },
  S: { letter: 'S', description: 'Punho fechado com o polegar cruzando na frente dos dedos' },
  T: { letter: 'T', description: 'Indicador dobrado com o polegar pelo lado de dentro' },
  U: { letter: 'U', description: 'Indicador e médio estendidos e unidos para cima' },
  V: { letter: 'V', description: 'Indicador e médio abertos em forma de V (vitória)' },
  W: { letter: 'W', description: 'Indicador, médio e anelar estendidos para cima em W' },
  X: { letter: 'X', description: 'Indicador em forma de gancho puxando para trás' },
  Y: { letter: 'Y', description: 'Polegar e mínimo estendidos (formato hang loose)' },
  Z: { letter: 'Z', description: 'Indicador desenhando a letra Z no ar' },
};

export const LibrasSection: React.FC<LibrasSectionProps> = ({
  showLibrasSign,
  librasCustomNote,
  partner1,
  partner2,
  onToggleShowLibras,
  onNoteChange,
}) => {
  const [selectedPartner, setSelectedPartner] = useState<'p1' | 'p2'>('p1');

  const currentName = (selectedPartner === 'p1' ? partner1 : partner2) || (selectedPartner === 'p1' ? 'Amor 1' : 'Amor 2');
  const cleanLetters = currentName.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z]/g, "").split('');

  const sampleLibrasPhrases = [
    "🤟 Certidão celebrada com Amor em Libras",
    "🤟 Eu Te Amo em Libras (Língua Brasileira de Sinais)",
    "💍 União, Inclusão & Amor Verdadeiro em Libras",
    "💖 Nosso amor comunicado em todos os sentidos e sinais",
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-300/40 dark:border-stone-700 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤟</span>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Acessibilidade & Libras (Língua Brasileira de Sinais)
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Torne a certidão do casal acessível, inclusiva e representativa da comunidade surda.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#72092c] dark:text-rose-300">
            <span>Ativar Selo</span>
            <input
              type="checkbox"
              checked={showLibrasSign}
              onChange={(e) => onToggleShowLibras(e.target.checked)}
              className="w-4 h-4 rounded text-[#72092c] focus:ring-rose-500 accent-[#72092c]"
            />
          </label>
        </div>
      </div>

      {/* 1. Libras Custom Phrase on Certificate */}
      {showLibrasSign && (
        <div className="space-y-3 p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/40">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Mensagem de Reconhecimento em Libras na Certidão
          </label>

          <input
            type="text"
            value={librasCustomNote}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Ex: 🤟 Certidão celebrada em Libras com muito amor"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#72092c]"
          />

          <div className="space-y-1.5">
            <span className="text-[10.5px] font-semibold text-stone-500 uppercase tracking-wider block">
              Sugestões rápidas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleLibrasPhrases.map((phrase, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onNoteChange(phrase)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border text-left transition-all ${
                    librasCustomNote === phrase
                      ? 'bg-rose-900 text-white border-rose-950 font-semibold'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-rose-300'
                  }`}
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Dactylology Visualizer (Alfabeto Manual do Casal) */}
      <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/60 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
              Dactilologia do Nome (Soletrar em Libras)
            </h5>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Veja a composição dos nomes em sinais do alfabeto manual da Libras:
            </p>
          </div>

          <div className="flex bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
            <button
              type="button"
              onClick={() => setSelectedPartner('p1')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                selectedPartner === 'p1'
                  ? 'bg-white dark:bg-stone-700 text-[#72092c] dark:text-rose-300 shadow-sm'
                  : 'text-stone-500'
              }`}
            >
              Cônjuge 1
            </button>
            <button
              type="button"
              onClick={() => setSelectedPartner('p2')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                selectedPartner === 'p2'
                  ? 'bg-white dark:bg-stone-700 text-[#72092c] dark:text-rose-300 shadow-sm'
                  : 'text-stone-500'
              }`}
            >
              Cônjuge 2
            </button>
          </div>
        </div>

        {/* Letters Grid */}
        <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto">
          {cleanLetters.length > 0 ? (
            cleanLetters.map((char, index) => {
              const info = LIBRAS_ALPHABET[char];
              return (
                <div
                  key={`${char}-${index}`}
                  className="flex flex-col items-center p-2 rounded-xl bg-amber-50/50 dark:bg-stone-900 border border-amber-200/70 dark:border-stone-700 w-14 sm:w-16 text-center shadow-sm"
                  title={info ? `${info.letter}: ${info.description}` : char}
                >
                  <span className="font-display font-black text-base sm:text-lg text-[#72092c] dark:text-rose-300">
                    {char}
                  </span>
                  <span className="text-xs my-0.5">🤟</span>
                  <span className="text-[8.5px] text-stone-500 leading-none truncate w-full">
                    Sinal {char}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-stone-400 italic py-2">
              Digite o nome do cônjuge no formulário para visualizar a soletração em Libras.
            </p>
          )}
        </div>
      </div>

      {/* 3. VLibras Gov Widget Notice */}
      <div className="p-3.5 rounded-xl border border-blue-200/70 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 flex items-start gap-3 text-xs text-blue-950 dark:text-blue-200">
        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
          VL
        </div>
        <div className="space-y-1">
          <p className="font-bold flex items-center gap-1">
            <span>Tradutor Virtual de Libras (VLibras) Ativo</span>
            <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </p>
          <p className="text-[11px] text-blue-800/80 dark:text-blue-300 leading-snug">
            Esta aplicação conta com o <strong>Widget Oficial do VLibras</strong> no canto da tela. Pessoas surdas podem clicar no ícone do boneco azul a qualquer momento para traduzir o texto do certificado para a Língua Brasileira de Sinais em 3D.
          </p>
        </div>
      </div>

    </div>
  );
};
