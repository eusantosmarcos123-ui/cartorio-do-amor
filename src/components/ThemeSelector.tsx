import type { CertificateTheme, SealColor, RelationshipType } from '../types/certificate';
import { THEME_CONFIGS, SEAL_CONFIGS } from '../constants/initialData';
import { Check, ShieldCheck, Heart } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: CertificateTheme;
  currentSeal: SealColor;
  relationshipType: RelationshipType;
  onThemeChange: (theme: CertificateTheme) => void;
  onSealChange: (seal: SealColor) => void;
  onRelationshipTypeChange: (type: RelationshipType) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  currentSeal,
  relationshipType,
  onThemeChange,
  onSealChange,
  onRelationshipTypeChange,
}) => {
  const relationshipOptions: { id: RelationshipType; label: string; icon: string }[] = [
    { id: 'namoro', label: 'Certidão de Namoro', icon: '💑' },
    { id: 'noivado', label: 'Certidão de Noivado', icon: '💍' },
    { id: 'casamento', label: 'Certidão de Casamento Simbólico', icon: '💒' },
    { id: 'uniao-estavel', label: 'União Estável do Afeto', icon: '🏡' },
    { id: 'ficantes-oficiais', label: 'Ficantes Sérios / Exclusivos', icon: '🔐' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Relationship Type */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-600" />
          Tipo de Vínculo Cartorial
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {relationshipOptions.map((rel) => (
            <button
              key={rel.id}
              type="button"
              onClick={() => onRelationshipTypeChange(rel.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition-all ${
                relationshipType === rel.id
                  ? 'bg-rose-900 text-white border-rose-950 shadow-sm'
                  : 'bg-stone-50 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-rose-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{rel.icon}</span>
                {rel.label}
              </span>
              {relationshipType === rel.id && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Visual Document Theme */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2.5 block">
          Estilo & Papel da Certidão
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(Object.keys(THEME_CONFIGS) as CertificateTheme[]).map((themeKey) => {
            const config = THEME_CONFIGS[themeKey];
            const isSelected = currentTheme === themeKey;

            return (
              <button
                key={themeKey}
                type="button"
                onClick={() => onThemeChange(themeKey)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#72092c] dark:border-rose-500 ring-2 ring-rose-900/20 bg-rose-50/60 dark:bg-rose-950/20'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/40 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 rounded-full border border-stone-300 shadow-inner"
                      style={{ backgroundColor: config.primaryColor }}
                    />
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {config.name}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-[#72092c] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 text-amber-200" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
                  {config.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Wax Seal Color */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2.5 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          Selo de Cera de Autenticidade
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(SEAL_CONFIGS) as SealColor[]).map((sealKey) => {
            const config = SEAL_CONFIGS[sealKey];
            const isSelected = currentSeal === sealKey;

            return (
              <button
                key={sealKey}
                type="button"
                onClick={() => onSealChange(sealKey)}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'border-stone-800 dark:border-stone-200 bg-stone-100 dark:bg-stone-800 shadow-sm'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-400'
                }`}
              >
                <div 
                  className="w-6 h-6 rounded-full shadow-inner border border-white/40 flex items-center justify-center"
                  style={{ backgroundColor: config.color }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                  {config.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
