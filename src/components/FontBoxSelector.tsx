import type { TitleFont, BodyFont, SignatureFont } from '../types/certificate';
import { TITLE_FONTS, BODY_FONTS, SIGNATURE_FONTS, FONT_PRESETS } from '../constants/initialData';
import { Type, Sparkles, Check, Heading1, AlignLeft, PenTool } from 'lucide-react';

interface FontBoxSelectorProps {
  titleFont: TitleFont;
  bodyFont: BodyFont;
  signatureFont: SignatureFont;
  onTitleFontChange: (font: TitleFont) => void;
  onBodyFontChange: (font: BodyFont) => void;
  onSignatureFontChange: (font: SignatureFont) => void;
  onApplyPreset: (title: TitleFont, body: BodyFont, sig: SignatureFont) => void;
}

export const FontBoxSelector: React.FC<FontBoxSelectorProps> = ({
  titleFont,
  bodyFont,
  signatureFont,
  onTitleFontChange,
  onBodyFontChange,
  onSignatureFontChange,
  onApplyPreset,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header of the font box */}
      <div className="flex items-center justify-between pb-1 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
            Caixa de Fontes & Tipografia Oficial
          </h4>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Personalize as fontes do cabeçalho, votos e assinaturas da certidão.
          </p>
        </div>
      </div>

      {/* 1. Presets de Combinações Tipográficas Harmoniosas */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Combinações Harmoniosas Prontas
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FONT_PRESETS.map((preset) => {
            const isCurrent = 
              titleFont === preset.titleFont &&
              bodyFont === preset.bodyFont &&
              signatureFont === preset.signatureFont;

            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => onApplyPreset(preset.titleFont, preset.bodyFont, preset.signatureFont)}
                className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isCurrent
                    ? 'border-[#72092c] dark:border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 ring-1 ring-[#72092c]'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/60 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {preset.name}
                  </span>
                  {isCurrent && <Check className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-300" />}
                </div>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-snug">
                  {preset.description}
                </p>
                <div className="mt-2 pt-1 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center gap-1.5 text-[9.5px] text-stone-600 dark:text-stone-300 font-mono">
                  <span>{preset.titleFont}</span>
                  <span>•</span>
                  <span>{preset.bodyFont}</span>
                  <span>•</span>
                  <span>{preset.signatureFont}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Fonte dos Títulos & Nomes */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
          <Heading1 className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
          Fonte dos Títulos & Nomes do Casal
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TITLE_FONTS.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => onTitleFontChange(font.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                titleFont === font.id
                  ? 'border-[#72092c] dark:border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 ring-1 ring-[#72092c]'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/40 hover:border-stone-300'
              }`}
            >
              <div>
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block">
                  {font.label}
                </span>
                <span 
                  className="text-xs text-[#72092c] dark:text-rose-300 block mt-0.5"
                  style={{ fontFamily: font.family }}
                >
                  {font.sample}
                </span>
              </div>
              {titleFont === font.id && <Check className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-300 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Fonte do Corpo dos Votos & Cláusulas */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
          <AlignLeft className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
          Fonte dos Votos & Cláusulas
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {BODY_FONTS.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => onBodyFontChange(font.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                bodyFont === font.id
                  ? 'border-[#72092c] dark:border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 ring-1 ring-[#72092c]'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/40 hover:border-stone-300'
              }`}
            >
              <div>
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block">
                  {font.label}
                </span>
                <span 
                  className="text-xs text-stone-600 dark:text-stone-400 block mt-0.5 line-clamp-1 italic"
                  style={{ fontFamily: font.family }}
                >
                  {font.sample}
                </span>
              </div>
              {bodyFont === font.id && <Check className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-300 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Fonte das Assinaturas Manuscritas */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
          Fonte das Assinaturas Manuscritas
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SIGNATURE_FONTS.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => onSignatureFontChange(font.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                signatureFont === font.id
                  ? 'border-[#72092c] dark:border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 ring-1 ring-[#72092c]'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/40 hover:border-stone-300'
              }`}
            >
              <div>
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block">
                  {font.label}
                </span>
                <span 
                  className="text-lg text-stone-900 dark:text-stone-100 block mt-0.5 leading-none"
                  style={{ fontFamily: font.family }}
                >
                  {font.sample}
                </span>
              </div>
              {signatureFont === font.id && <Check className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-300 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
