import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scroll, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Heart, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  AlertCircle
} from 'lucide-react';
import type { User, AuthMode } from '../types/auth';
import { SqlAuthService } from '../services/sqlAuthService';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onBackToApp: () => void;
  initialMode?: AuthMode;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}


// Preset configurations for floating romantic hearts
const FLOATING_HEARTS = [
  { id: 1, left: '5%', size: 18, delay: 0, duration: 16, opacity: 0.25 },
  { id: 2, left: '12%', size: 28, delay: 3, duration: 22, opacity: 0.18 },
  { id: 3, left: '20%', size: 14, delay: 7, duration: 18, opacity: 0.3 },
  { id: 4, left: '28%', size: 36, delay: 2, duration: 25, opacity: 0.15 },
  { id: 5, left: '38%', size: 20, delay: 5, duration: 19, opacity: 0.22 },
  { id: 6, left: '48%', size: 16, delay: 1, duration: 17, opacity: 0.28 },
  { id: 7, left: '58%', size: 32, delay: 6, duration: 24, opacity: 0.16 },
  { id: 8, left: '68%', size: 22, delay: 4, duration: 20, opacity: 0.2 },
  { id: 9, left: '78%', size: 16, delay: 8, duration: 18, opacity: 0.26 },
  { id: 10, left: '88%', size: 34, delay: 2, duration: 23, opacity: 0.18 },
  { id: 11, left: '94%', size: 20, delay: 5, duration: 16, opacity: 0.24 },
  { id: 12, left: '15%', size: 24, delay: 10, duration: 21, opacity: 0.2 },
  { id: 13, left: '82%', size: 18, delay: 9, duration: 17, opacity: 0.22 },
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToApp,
  initialMode = 'login',
  darkMode = false,
  onToggleDarkMode,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setPartnerName('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const normalizedEmail = email.trim().toLowerCase();

    if (mode === 'login') {
      if (!normalizedEmail || !password) {
        setErrorMessage('Por favor, preencha o seu e-mail e sua senha.');
        return;
      }

      setIsLoading(true);
      try {
        // Execute SQL Login Query
        const loggedUser = await SqlAuthService.login(normalizedEmail, password);

        if (rememberMe) {
          localStorage.setItem('cartorio_user', JSON.stringify(loggedUser));
        }
        onLoginSuccess(loggedUser);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Erro ao autenticar no banco SQL.';
        setErrorMessage(errorMsg);
      } finally {
        setIsLoading(false);
      }

    } else if (mode === 'register') {
      if (!name.trim() || !normalizedEmail || !password) {
        setErrorMessage('Por favor, preencha seu nome completo, e-mail e senha.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('As senhas digitadas não coincidem.');
        return;
      }

      setIsLoading(true);
      try {
        // Execute SQL Register Query (INSERT INTO users with SHA-256 Hash)
        await SqlAuthService.register({
          name: name.trim(),
          email: normalizedEmail,
          password: password,
          partnerName: partnerName.trim() || undefined,
        });

        // Do NOT auto-login. Clear inputs and switch to login tab with clear message
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPartnerName('');
        setMode('login');
        setSuccessMessage('🎉 Conta criada com sucesso no Cartório do Amor! Agora faça login com seu e-mail e sua senha para entrar.');
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Erro ao cadastrar no banco SQL.';
        setErrorMessage(errorMsg);
      } finally {
        setIsLoading(false);
      }

    } else if (mode === 'forgot-password') {
      if (!normalizedEmail) {
        setErrorMessage('Digite seu e-mail para receber as instruções.');
        return;
      }
      setIsLoading(true);
      try {
        await SqlAuthService.recoverPassword(normalizedEmail);
        setSuccessMessage(`Instruções de recuperação foram enviadas para ${normalizedEmail}!`);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'E-mail não localizado na base de dados SQL.';
        setErrorMessage(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-br from-[#fcf7ee] via-[#faede0] to-[#f4ded0] dark:from-[#0f0c0b] dark:via-[#191114] dark:to-[#0d0a09] text-stone-900 dark:text-stone-100 relative overflow-hidden transition-colors duration-300">
      
      {/* ================= ROMANTIC BACKGROUND LAYER ================= */}
      
      {/* Ambient Romantic Radiant Glowing Orbs */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-gradient-to-br from-rose-400/20 via-rose-500/10 to-transparent dark:from-rose-600/25 dark:via-rose-900/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute -bottom-24 -right-24 w-[550px] h-[550px] bg-gradient-to-tl from-amber-400/25 via-rose-400/15 to-transparent dark:from-amber-600/20 dark:via-rose-900/20 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-rose-300/10 dark:bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Animated Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {FLOATING_HEARTS.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: '110vh', rotate: -15, opacity: 0 }}
            animate={{
              y: '-20vh',
              rotate: [ -15, 15, -15 ],
              x: [ 0, 20, -20, 0 ],
              opacity: [ 0, heart.opacity, heart.opacity, 0 ],
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              left: heart.left,
              bottom: 0,
            }}
            className="text-rose-500 dark:text-rose-400"
          >
            <Heart
              style={{
                width: heart.size,
                height: heart.size,
                fill: 'currentColor',
                filter: 'drop-shadow(0 2px 8px rgba(225, 29, 72, 0.2))',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Romantic Corner Arabesques / Flourishes */}
      <div className="absolute top-6 left-6 text-[#c5a059]/30 dark:text-amber-400/20 pointer-events-none hidden md:block">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 5 C 30 5, 5 30, 40 40 C 30 5, 5 30, 5 5 Z" fill="currentColor" fillOpacity="0.1" />
          <circle cx="20" cy="20" r="3" fill="currentColor" />
          <path d="M5 5 L 60 5 M 5 5 L 5 60" />
        </svg>
      </div>
      <div className="absolute top-6 right-6 text-[#c5a059]/30 dark:text-amber-400/20 pointer-events-none hidden md:block rotate-90">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 5 C 30 5, 5 30, 40 40 C 30 5, 5 30, 5 5 Z" fill="currentColor" fillOpacity="0.1" />
          <circle cx="20" cy="20" r="3" fill="currentColor" />
          <path d="M5 5 L 60 5 M 5 5 L 5 60" />
        </svg>
      </div>
      <div className="absolute bottom-6 left-6 text-[#c5a059]/30 dark:text-amber-400/20 pointer-events-none hidden md:block -rotate-90">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 5 C 30 5, 5 30, 40 40 C 30 5, 5 30, 5 5 Z" fill="currentColor" fillOpacity="0.1" />
          <circle cx="20" cy="20" r="3" fill="currentColor" />
          <path d="M5 5 L 60 5 M 5 5 L 5 60" />
        </svg>
      </div>
      <div className="absolute bottom-6 right-6 text-[#c5a059]/30 dark:text-amber-400/20 pointer-events-none hidden md:block rotate-180">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 5 C 30 5, 5 30, 40 40 C 30 5, 5 30, 5 5 Z" fill="currentColor" fillOpacity="0.1" />
          <circle cx="20" cy="20" r="3" fill="currentColor" />
          <path d="M5 5 L 60 5 M 5 5 L 5 60" />
        </svg>
      </div>

      {/* Top Floating Action Bar */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-20 pointer-events-auto">
        {/* Back to App Button */}
        <button
          type="button"
          onClick={onBackToApp}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold text-stone-700 dark:text-stone-300 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-rose-200/60 dark:border-stone-800 shadow-sm hover:bg-white dark:hover:bg-stone-850 hover:shadow-md transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
          <span>Voltar ao Editor</span>
        </button>

        {/* Dark Mode Toggle Button */}
        {onToggleDarkMode && (
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold text-stone-700 dark:text-stone-300 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-rose-200/60 dark:border-stone-800 shadow-sm hover:bg-white dark:hover:bg-stone-850 hover:shadow-md transition-all active:scale-95"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-stone-700" />
                <span className="hidden sm:inline">Modo Escuro</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-rose-950/10 dark:border-stone-800 overflow-hidden relative z-10 transition-colors duration-200"
      >
        {/* Top Header Banner */}
        <div className="px-6 pt-8 pb-6 text-center bg-gradient-to-b from-rose-50/80 via-rose-50/40 to-transparent dark:from-stone-800/60 dark:via-stone-850/40 dark:to-transparent">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#72092c] to-[#9e1b45] dark:from-[#8b0e2f] dark:to-[#b31d4e] text-amber-200 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-950/20 border border-amber-300/30">
            <Scroll className="w-7 h-7" />
          </div>

          <h2 className="font-display font-bold text-2xl text-stone-900 dark:text-stone-100 tracking-tight">
            Cartório do Amor
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {mode === 'login' && 'Acesse sua conta para gerenciar e salvar suas certidões'}
            {mode === 'register' && 'Crie sua conta oficial para eternizar histórias de amor'}
            {mode === 'forgot-password' && 'Recuperação de acesso à sua conta'}
          </p>

          {/* Mode Switch Tabs (Login / Cadastro) */}
          {mode !== 'forgot-password' && (
            <div className="flex bg-stone-100/90 dark:bg-stone-800/90 p-1 rounded-xl mt-5 border border-stone-200/80 dark:border-stone-700/80">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-white dark:bg-stone-700 text-[#72092c] dark:text-amber-200 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'register'
                    ? 'bg-white dark:bg-stone-700 text-[#72092c] dark:text-amber-200 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                }`}
              >
                Criar Conta
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 pt-2">
          
          {/* Feedback Alerts */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs font-medium flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* REGISTER: Nome Completo */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Vinicius dos Santos"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/80 text-base sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#72092c] dark:focus:ring-rose-500 transition-all"
                />
              </div>
            )}

            {/* REGISTER: Nome do Amor (Opcional) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  Nome do seu Amor (Opcional)
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Ex: Beatriz Ferreira"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/80 text-base sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#72092c] dark:focus:ring-rose-500 transition-all"
                />
              </div>
            )}

            {/* EMAIL (All modes) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
                Endereço de E-mail *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.amor@exemplo.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/80 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#72092c] dark:focus:ring-rose-500 transition-all"
              />
            </div>

            {/* SENHA (Login & Register) */}
            {mode !== 'forgot-password' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
                    Senha *
                  </label>

                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot-password')}
                      className="text-[11px] font-semibold text-[#72092c] dark:text-rose-400 hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/80 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#72092c] dark:focus:ring-rose-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* REGISTER: Confirmação de Senha */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                  Confirmar Senha *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/80 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#72092c] dark:focus:ring-rose-500 transition-all"
                />
              </div>
            )}

            {/* Lembrar-me Checkbox */}
            {mode !== 'forgot-password' && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 dark:text-stone-400 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#72092c] focus:ring-rose-500 accent-[#72092c] dark:accent-rose-600"
                  />
                  <span>Manter conectado neste dispositivo</span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#72092c] to-[#9e1b45] dark:from-[#8b0e2f] dark:to-[#b31d4e] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-rose-950/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {mode === 'login' && 'Entrar no Cartório'}
                    {mode === 'register' && 'Criar Conta Oficial'}
                    {mode === 'forgot-password' && 'Enviar Link de Recuperação'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Mode switch for forgot-password */}
          {mode === 'forgot-password' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs font-bold text-[#72092c] dark:text-rose-400 hover:underline"
              >
                Voltar para a tela de login
              </button>
            </div>
          )}

          {/* Guest Direct Access (Zero Friction) */}
          <div className="mt-6 pt-4 border-t border-stone-200/80 dark:border-stone-800 text-center">
            <button
              type="button"
              onClick={onBackToApp}
              className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-medium hover:underline inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Continuar como Convidado (Modo Prévia)</span>
              <span>→</span>
            </button>
          </div>

        </div>

        {/* Footer Security Badge */}
        <div className="px-6 py-3 bg-stone-50 dark:bg-stone-950/80 border-t border-stone-200 dark:border-stone-800 flex items-center justify-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
            <Lock className="w-3.5 h-3.5 text-stone-500" />
            <span>Conexão Segura SSL</span>
          </div>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Criptografia LGPD</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
};


