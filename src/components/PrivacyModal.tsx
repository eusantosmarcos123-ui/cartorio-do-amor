import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, X, CheckCircle2, EyeOff, ServerOff, FileText, Scale } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-700 overflow-hidden z-10 my-8"
          >
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-[#72092c] to-[#881337] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-amber-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-amber-100 flex items-center gap-2">
                    Política de Privacidade & Conformidade LGPD
                  </h3>
                  <p className="text-xs text-rose-200/90">
                    Transparência total e proteção de dados conforme a Lei nº 13.709/2018
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar termo de privacidade"
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
              
              {/* Highlight Banner */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 flex items-start gap-3.5">
                <Lock className="w-5 h-5 text-[#72092c] dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    Compromisso Fundamental de Privacidade
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                    Seus dados pessoais (nomes, datas, fotos, votos e localidade) são utilizados <strong>exclusivamente para a geração visual e impressão da sua Certidão do Amor</strong>. Nenhum dado é vendido, repassado ou armazenado em servidores externos.
                  </p>
                </div>
              </div>

              {/* Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-[#72092c] dark:text-rose-300 flex items-center justify-center">
                    <ServerOff className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-xs text-stone-900 dark:text-stone-100">Zero Servidores Externos</h5>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                    O processamento é 100% no seu próprio navegador (Client-Side). Seus dados nunca saem do seu dispositivo.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-[#72092c] dark:text-rose-300 flex items-center justify-center">
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-xs text-stone-900 dark:text-stone-100">Sem Rastreadores ou Cookies</h5>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                    Não coletamos histórico de navegação, e-mails ou cookies de publicidade invasiva.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-[#72092c] dark:text-rose-300 flex items-center justify-center">
                    <Scale className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-xs text-stone-900 dark:text-stone-100">Conformidade LGPD</h5>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                    Estruturado sob os princípios de Finalidade, Necessidade e Transparência da Lei 13.709/18.
                  </p>
                </div>
              </div>

              {/* Detailed Legal Sections */}
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-[#72092c] dark:text-rose-400" />
                    1. Finalidade Específica do Tratamento (Art. 6º, I da LGPD)
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    As informações inseridas no formulário (tais como nomes dos cônjuges, data de início da relação, cidade/UF, foto pessoal e votos de amor) têm como <strong>única e exclusiva finalidade</strong> a montagem gráfica, renderização em tempo real e exportação dos arquivos em PDF A4 ou imagem PNG da certidão simbólica solicitada pelo próprio usuário.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#72092c] dark:text-rose-400" />
                    2. Armazenamento e Retenção de Dados
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    A aplicação <strong>não mantém banco de dados centralizado</strong>. Todos os dados permanecem temporariamente na memória volátil do seu navegador durante a sessão. Ao fechar a aba ou recarregar a página, as informações digitadas deixam de existir no aplicativo.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-[#72092c] dark:text-rose-400" />
                    3. Direitos do Titular de Dados (Art. 18 da LGPD)
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    Você possui pleno controle sobre seus dados a qualquer momento:
                  </p>
                  <ul className="list-disc list-inside text-xs text-stone-600 dark:text-stone-400 mt-1.5 space-y-1">
                    <li><strong>Direito de Exclusão Instantânea:</strong> Você pode clicar no botão <em>"Limpar texto"</em> ou <em>"Restaurar Modelo"</em> no topo do editor para apagar os dados imediatamente.</li>
                    <li><strong>Direito à Confidencialidade:</strong> Nenhuma foto ou texto enviado é analisado por humanos ou reutilizado para treinamento de modelos de inteligência artificial públicos.</li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-green-600" />
                Aplicação 100% segura e privada
              </span>
              
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold rounded-xl text-white bg-[#72092c] hover:bg-[#580520] shadow-md shadow-rose-950/20 transition-all active:scale-95"
              >
                Entendido e Ciente
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
