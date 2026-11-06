import { useState, useRef, useEffect } from 'react';
import { Scroll, Sparkles, Moon, Sun, RotateCcw, ShieldCheck, User as UserIcon, LogOut, Download, Crown, Heart, X } from 'lucide-react';
import { fireLoveConfetti } from '../utils/exportUtils';
import type { User } from '../types/auth';
import type { CheckoutPlan } from '../constants/plansData';
import type { TrialStatus } from '../utils/trialManager';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onResetData: () => void;
  onOpenPrivacyModal: () => void;
  user: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  isInstallable?: boolean;
  onInstall?: () => void;
  activePlan?: CheckoutPlan | null;
  onOpenPlanModal?: () => void;
  onOpenVipShowcase?: () => void;
  trialStatus?: TrialStatus;
  onOpenCouplePage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onResetData,
  onOpenPrivacyModal,
  user,
  onOpenLogin,
  onLogout,
  isInstallable,
  onInstall,
  onOpenVipShowcase,
  onOpenCouplePage,
  activePlan = null,
}) => {
  const hasFullCouplePlan = activePlan?.id === 'completo';
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBrandPopover, setShowBrandPopover] = useState(false);
  const brandRef = useRef<HTMLDivElement>(null);

  // Close brand popover when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandRef.current && !brandRef.current.contains(event.target as Node)) {
        setShowBrandPopover(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowBrandPopover(false);
      }
    };

    if (showBrandPopover) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showBrandPopover]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-950/10 dark:border-stone-800 bg-[#FDFBF7]/90 dark:bg-stone-900/95 backdrop-blur-md shadow-[0_1px_8px_rgba(114,9,44,0.04)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        
        {/* Brand identity (Interactive Click to View Full Name & Sub-name) */}
        <div ref={brandRef} className="relative min-w-0 shrink-0">
          <button
            type="button"
            onClick={() => setShowBrandPopover((prev) => !prev)}
            title="Clique para visualizar o nome e o sub-nome completos"
            aria-expanded={showBrandPopover}
            className="flex items-center gap-2 sm:gap-3 min-w-0 text-left p-1 -ml-1 rounded-2xl hover:bg-blush-tint/60 dark:hover:bg-stone-800/80 active:scale-[0.99] transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-wine-rich flex items-center justify-center text-gold-light shadow-[0_2px_10px_rgba(114,9,44,0.25)] ring-1 ring-gold-accent/40 border border-amber-300/30 shrink-0 group-hover:scale-105 transition-transform">
              <Scroll className="w-4 h-4 sm:w-5 sm:h-5 text-gold-light" />
            </div>

            <div className="min-w-0 max-w-[125px] sm:max-w-[180px]">
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif text-sm sm:text-base font-bold tracking-tight text-wine-rich dark:text-rose-300 truncate group-hover:text-primary transition-colors">
                  Cartório do Amor
                </h1>
                <span className="text-[8px] sm:text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-gold-light text-amber-950 ring-1 ring-border-gold shrink-0">
                  OFICIAL
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-ink-muted uppercase tracking-wider font-semibold truncate">
                Registro Notarial de Sentimentos
              </p>
            </div>
          </button>

          {/* Full Name & Sub-name Popover Card on Click */}
          {showBrandPopover && (
            <div className="absolute left-0 top-full mt-2 z-50 w-[300px] sm:w-[420px] p-4 sm:p-5 bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border-2 border-rose-300 dark:border-rose-900/80 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
              <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-rose-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-wine-rich flex items-center justify-center text-gold-light shadow-md shrink-0 ring-1 ring-gold-accent/40">
                    <Scroll className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg sm:text-xl font-bold text-wine-rich dark:text-stone-50">
                        Cartório do Amor
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gold-light text-amber-950 ring-1 ring-border-gold">
                        OFICIAL
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mt-0.5">
                      Nome Oficial
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBrandPopover(false);
                  }}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sub-name section (Full, without cut or ellipsis) */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-blush-tint/70 dark:bg-rose-950/40 border border-border-romantic dark:border-rose-900/60 mb-3.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-wine-rich dark:text-rose-300 block mb-1">
                  Sub-nome & Atribuição Oficial:
                </span>
                <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 leading-relaxed">
                  Emissão de Certidões de Namoro, Noivado & Compromisso Afetivo
                </p>
              </div>

              <div className="space-y-1.5 text-[11px] text-stone-600 dark:text-stone-400">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Plataforma oficial com emissão em alta resolução gráfica (300 DPI)</span>
                </p>
                <p className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-wine-rich shrink-0" />
                  <span>Personalização completa com votos, fotos e trilha sonora 24/7</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* User Auth Section */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-bold text-[#72092c] dark:text-rose-300 shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-[#72092c] text-white flex items-center justify-center text-[10px] uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden md:inline truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                    <p className="font-bold text-stone-900 dark:text-stone-100 truncate">{user.name}</p>
                    <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair da conta</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs bg-wine-rich text-white hover:bg-wine-deep transition-all shadow-[0_4px_14px_rgba(114,9,44,0.25)] active:scale-95 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
          )}

          {/* Dedicated VIP Showcase Button */}
          {onOpenVipShowcase && (
            <button
              type="button"
              onClick={onOpenVipShowcase}
              title="Conhecer Benefícios e Planos Oficiais VIP"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-gold-light hover:bg-[#ffdea5] text-amber-950 font-bold text-xs ring-1 ring-border-gold shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
              <span className="text-xs font-bold text-amber-950 dark:text-amber-100 tracking-tight whitespace-nowrap hidden sm:inline">
                Planos Oficiais
              </span>
              <span className="bg-[#785a1a] text-gold-light text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase leading-none shadow-xs">
                VIP
              </span>
            </button>
          )}

          {/* Dedicated Couple Love Web Page Button */}
          {onOpenCouplePage && (
            <button
              type="button"
              onClick={onOpenCouplePage}
              title={
                hasFullCouplePlan
                  ? "Abrir Página Web Interativa do Casal (Música + Contador em Tempo Real)"
                  : "Experimentar Prévia da Página Web do Casal (Exclusivo Pack Eterno)"
              }
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-full text-wine-rich bg-blush-surface hover:bg-blush-tint ring-1 ring-border-romantic shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span className="hidden sm:inline">Página do Casal</span>
              <span className="sm:hidden">Casal</span>
              <span className="text-[9px] bg-wine-rich text-white font-bold px-1.5 py-0.5 rounded-full uppercase leading-none shadow-xs">
                {hasFullCouplePlan ? 'PACK ETERNO' : 'PRÉVIA'}
              </span>
            </button>
          )}

          {/* Install PWA Button */}
          {isInstallable && onInstall && (
            <button
              type="button"
              onClick={onInstall}
              title="Instalar Cartório do Amor no seu dispositivo"
              aria-label="Instalar aplicativo"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-bold rounded-full text-amber-900 dark:text-amber-200 bg-gold-light hover:brightness-105 ring-1 ring-border-gold shadow-sm transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span className="hidden md:inline">Instalar App</span>
            </button>
          )}

          {/* Confetti Trigger */}
          <button
            type="button"
            onClick={fireLoveConfetti}
            title="Celebrar com confetes!"
            aria-label="Disparar chuva de confetes"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-full text-wine-rich bg-blush-surface hover:bg-blush-tint ring-1 ring-border-romantic transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-accent animate-spin-slow" />
            <span className="hidden md:inline">Celebrar</span>
          </button>

          {/* LGPD & Privacy Policy Button */}
          <button
            type="button"
            onClick={onOpenPrivacyModal}
            title="Política de Privacidade & Conformidade LGPD"
            aria-label="Ver política de privacidade e LGPD"
            className="p-1.5 sm:px-3 sm:py-2 text-xs font-medium rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
            <span className="hidden lg:inline">Privacidade</span>
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={onResetData}
            title="Restaurar dados modelo"
            aria-label="Restaurar dados iniciais"
            className="p-1.5 sm:px-3 sm:py-2 text-xs font-medium rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Restaurar</span>
          </button>

          {/* Dark mode switch */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Mudar para tema Claro' : 'Mudar para tema Escuro'}
            aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            className="p-1.5 sm:p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
