import { useState, useEffect, useCallback } from 'react';
import { Scroll } from 'lucide-react';
import { Header } from './components/Header';
import { EditorForm, type EditorTabId } from './components/EditorForm';
import { PreviewPanel } from './components/PreviewPanel';
import { CertificateDocument } from './components/CertificateDocument';
import { AiPromptModal } from './components/AiPromptModal';
import { PrivacyModal } from './components/PrivacyModal';
import { LgpdConsentBanner } from './components/LgpdConsentBanner';
import { MobilePreviewModal, MobileBottomBar } from './components/MobilePreviewModal';
import { QrCodeCardModal } from './components/QrCodeCardModal';
import { CheckoutModal, type CheckoutPlan } from './components/CheckoutModal';
import { CHECKOUT_PLANS } from './constants/plansData';
import { LoginPage } from './components/LoginPage';
import { AdminDatabasePage } from './components/AdminDatabasePage';
import { VipPlansShowcasePage } from './components/VipPlansShowcasePage';
import { LoveContractDocument } from './components/LoveContractDocument';
import { LoveIdCardDocument } from './components/LoveIdCardDocument';
import { CoupleLoveWebPage } from './components/CoupleLoveWebPage';
import { FeatureUpgradeModal, type FeatureUpgradeData } from './components/FeatureUpgradeModal';
import { getPlanPermissions, type LoveDocumentType } from './utils/planFeatures';
import { Toast, type ToastMessage } from './components/Toast';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { usePwaInstall } from './hooks/usePwaInstall';
import type { CertificateData } from './types/certificate';
import type { User } from './types/auth';
import { INITIAL_CERTIFICATE_DATA } from './constants/initialData';
import { 
  getTrialStatus, 
  resetTrialTo30Days, 
  simulateExpireTrial,
  type TrialStatus 
} from './utils/trialManager';
import { 
  exportCertificateToPdf, 
  exportCertificateToImage, 
  printCertificate, 
  shareCertificateData, 
  fireLoveConfetti 
} from './utils/exportUtils';

export function App() {
  const [data, setData] = useState<CertificateData>(() => {
    if (typeof window === 'undefined') return INITIAL_CERTIFICATE_DATA;
    const params = new URLSearchParams(window.location.search);
    const p1 = params.get('p1') || params.get('partner1');
    const p2 = params.get('p2') || params.get('partner2');
    const d = params.get('d') || params.get('startDate') || params.get('data');
    const c = params.get('c') || params.get('city') || params.get('cidade');
    const s = params.get('s') || params.get('state') || params.get('estado');
    const m = params.get('m') || params.get('musicUrl') || params.get('musica');

    if (p1 || p2 || d) {
      return {
        ...INITIAL_CERTIFICATE_DATA,
        partner1: p1 || INITIAL_CERTIFICATE_DATA.partner1,
        partner2: p2 || INITIAL_CERTIFICATE_DATA.partner2,
        startDate: d || INITIAL_CERTIFICATE_DATA.startDate,
        city: c || INITIAL_CERTIFICATE_DATA.city,
        state: s || INITIAL_CERTIFICATE_DATA.state,
        musicUrl: m || INITIAL_CERTIFICATE_DATA.musicUrl,
      };
    }
    return INITIAL_CERTIFICATE_DATA;
  });
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [editorTab, setEditorTab] = useState<EditorTabId>('couple');
  const [isAdminPage, setIsAdminPage] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    return (
      path.includes('/database') ||
      path.includes('/admin') ||
      path.includes('/banco') ||
      path.includes('/banco-sql') ||
      params.get('view') === 'database' ||
      params.get('view') === 'admin' ||
      params.get('admin') === 'sql' ||
      params.get('admin') === 'true'
    );
  });
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('action') === 'ai';
  });
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('action') === 'qr';
  });
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutInitialPlan, setCheckoutInitialPlan] = useState<CheckoutPlan | undefined>(undefined);
  const [isVipShowcaseOpen, setIsVipShowcaseOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    return (
      path.includes('/vip') ||
      path.includes('/planos') ||
      params.get('view') === 'planos' ||
      params.get('view') === 'vip' ||
      params.get('teste') === 'vip' ||
      params.get('teste') === 'planos'
    );
  });

  const [isCoupleLovePageOpen, setIsCoupleLovePageOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    return (
      path.includes('/casal') ||
      path.includes('/amor') ||
      params.get('view') === 'casal' ||
      params.get('view') === 'amor' ||
      params.get('pagina') === 'casal'
    );
  });

  // Track if Couple Love Web Page was opened as a Live Demonstration from VIP Plans Showcase
  const [openedCouplePageFromPlans, setOpenedCouplePageFromPlans] = useState<boolean>(false);

  // Paid certificates cache
  const [paidCertificates, setPaidCertificates] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cartorio_paid_certs') || '[]');
    } catch {
      return [];
    }
  });

  // Active Subscription Plan state
  const [activePlan, setActivePlan] = useState<CheckoutPlan | null>(() => {
    try {
      const saved = localStorage.getItem('cartorio_active_plan');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const getCertUniqueKey = useCallback(() => {
    return `${data.partner1}_${data.partner2}_${data.startDate}`.toLowerCase().trim();
  }, [data.partner1, data.partner2, data.startDate]);

  const isCurrentCertPaid = paidCertificates.includes(getCertUniqueKey());
  const hasActivePlan = Boolean(activePlan) || isCurrentCertPaid;
  
  // 30-day (1 month) Free Trial State
  const [trialStatus, setTrialStatus] = useState<TrialStatus>(() => getTrialStatus());

  // Limpeza de resquícios de modo de teste no navegador
  useEffect(() => {
    try {
      localStorage.removeItem('cartorio_admin_tester');
    } catch {
      // Ignora erro se localStorage não estiver disponível
    }
  }, []);

  // Selected Love Document: 'certidao' | 'contrato' | 'rg' (Included in Pack Eterno)
  const [selectedDocument, setSelectedDocument] = useState<LoveDocumentType>('certidao');

  // Feature Upgrade Modal State
  const [upgradeModalData, setUpgradeModalData] = useState<FeatureUpgradeData | null>(null);

  // Plan Permissions
  const planPermissions = getPlanPermissions(activePlan, trialStatus);

  // Has full access if paid subscription active OR within 30-day free trial period!
  const hasAccess = hasActivePlan || trialStatus.isActive;
  const { isInstallable, isInstalled, isIos, promptInstall } = usePwaInstall();
  
  // Persistent user session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('cartorio_user');
      return saved ? (JSON.parse(saved) as User) : null;
    } catch {
      return null;
    }
  });

  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isExportingImage, setIsExportingImage] = useState<boolean>(false);
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Synchronize browser history and back/forward buttons with ?view=planos and ?view=casal
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const path = window.location.pathname.toLowerCase();
      
      const shouldOpenPlans = 
        path.includes('/vip') ||
        path.includes('/planos') ||
        params.get('view') === 'planos' ||
        params.get('view') === 'vip' ||
        params.get('pagina') === 'planos' ||
        params.get('teste') === 'vip' ||
        params.get('teste') === 'planos';
      setIsVipShowcaseOpen(shouldOpenPlans);

      const shouldOpenCouple =
        path.includes('/casal') ||
        path.includes('/amor') ||
        params.get('view') === 'casal' ||
        params.get('view') === 'amor' ||
        params.get('pagina') === 'casal';
      setIsCoupleLovePageOpen(shouldOpenCouple);

      const shouldOpenAdmin =
        path.includes('/database') ||
        path.includes('/admin') ||
        path.includes('/banco') ||
        path.includes('/banco-sql') ||
        params.get('view') === 'database' ||
        params.get('view') === 'admin' ||
        params.get('admin') === 'sql' ||
        params.get('admin') === 'true';
      setIsAdminPage(shouldOpenAdmin);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFieldChange = <K extends keyof CertificateData>(field: K, value: CertificateData[K]) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetPlan = useCallback(() => {
    setActivePlan(null);
    setPaidCertificates([]);
    localStorage.removeItem('cartorio_active_plan');
    localStorage.removeItem('cartorio_paid_certs');
    addToast('info', 'Plano Resetado', 'O plano foi desativado. Agora ao clicar em baixar ou salvar imagem, o checkout do Pix será exibido normalmente!');
  }, [addToast]);

  const handleResetTrial = useCallback(() => {
    const updated = resetTrialTo30Days();
    setTrialStatus({ ...updated });
    addToast('success', '🎁 30 Dias Grátis Restaurados!', `Seu período gratuito foi redefinido até ${updated.endDateFormatted}.`);
  }, [addToast]);

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados originais do modelo inicial?')) {
      setData(INITIAL_CERTIFICATE_DATA);
      handleResetPlan();
      handleResetTrial();
      addToast('info', 'Dados Restaurados', 'Os campos foram preenchidos com o modelo inicial.');
    }
  };

  const handleApplyAiVows = (vowsText: string) => {
    setData((prev) => ({ ...prev, vows: vowsText }));
    addToast('success', 'Votos inseridos!', 'As cláusulas poéticas foram atualizadas na certidão.');
    fireLoveConfetti();
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoginOpen(false);
    addToast('success', `Bem-vindo(a), ${user.name.split(' ')[0]}!`, 'Sua sessão foi iniciada no Cartório do Amor.');
    fireLoveConfetti();
  };

  const handleLogout = () => {
    localStorage.removeItem('cartorio_user');
    setCurrentUser(null);
    addToast('info', 'Sessão encerrada', 'Você saiu da sua conta.');
  };

  // Auth Guard: Require login for exporting, downloading, saving, or printing
  const requireAuthForAction = (actionLabel: string = 'esta ação'): boolean => {
    if (!currentUser) {
      window.alert('Para utilizar o app por inteiro, é necessário fazer o login');

      addToast(
        'error',
        'Para utilizar o app por inteiro, é necessário fazer o login',
        `Para ${actionLabel}, faça login ou crie sua conta gratuita no Cartório do Amor.`
      );
      setIsMobilePreviewOpen(false);
      setIsQrModalOpen(false);
      setIsLoginOpen(true);
      return false;
    }
    return true;
  };

  const executePdfDownload = async () => {
    const element = document.getElementById('certificate-document') || (document.querySelector('.certificate-print-container') as HTMLElement);
    if (!element) {
      addToast('error', 'Erro ao localizar documento');
      return;
    }

    try {
      setIsExportingPdf(true);
      const docPrefix = selectedDocument === 'contrato' ? 'contrato-amor' : selectedDocument === 'rg' ? 'rg-amor' : 'certidao-de-namoro';
      const filename = `${docPrefix}-${data.partner1 || 'par1'}-${data.partner2 || 'par2'}.pdf`
        .toLowerCase()
        .replace(/\s+/g, '-');

      await exportCertificateToPdf(element, filename, (step, msg) => {
        if (step === 'done') {
          const docLabel = selectedDocument === 'contrato' ? 'Contrato de Convivência' : selectedDocument === 'rg' ? 'RG do Amor' : 'Certidão Oficial';
          addToast('success', `${docLabel} Baixado!`, 'Documento oficial em alta resolução (300 DPI) pronto para impressão.');
          fireLoveConfetti();
        } else if (step === 'error') {
          addToast('error', 'Erro no PDF', msg);
        }
      });
    } catch {
      addToast('error', 'Falha ao baixar PDF', 'Tente novamente ou use a opção de Imprimir.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const executeImageDownload = async () => {
    const element = document.getElementById('certificate-document') || (document.querySelector('.certificate-print-container') as HTMLElement);
    if (!element) {
      addToast('error', 'Erro ao localizar documento');
      return;
    }

    try {
      setIsExportingImage(true);
      const docPrefix = selectedDocument === 'contrato' ? 'contrato-amor' : selectedDocument === 'rg' ? 'rg-amor' : 'certidao-amor';
      const filename = `${docPrefix}-${data.partner1 || 'par1'}-${data.partner2 || 'par2'}.png`
        .toLowerCase()
        .replace(/\s+/g, '-');

      await exportCertificateToImage(element, filename, (step, msg) => {
        if (step === 'done') {
          const docLabel = selectedDocument === 'contrato' ? 'Contrato de Convivência' : selectedDocument === 'rg' ? 'RG do Amor' : 'Certidão Oficial';
          addToast('success', `Imagem do ${docLabel} Salva!`, 'Imagem em alta resolução salva na sua galeria.');
          fireLoveConfetti();
        } else if (step === 'error') {
          addToast('error', 'Erro na Imagem', msg);
        }
      });
    } catch {
      addToast('error', 'Falha ao salvar imagem');
    } finally {
      setIsExportingImage(false);
    }
  };

  // Subscription Plan & Trial Guard: Only allow downloading, saving, or printing with active plan OR active trial
  const checkPlanRequirement = (): boolean => {
    // 1. If subscriber with active plan or paid certificate:
    if (hasActivePlan) {
      return true;
    }

    // 2. If user is within their 30-day (1 month) free trial period:
    if (trialStatus.isActive) {
      return true;
    }

    // 3. TRIAL EXPIRED AND NO PAID PLAN:
    // REDIRECT IMMEDIATELY TO THE PLANS SHOWCASE SCREEN TO FORCE SUBSCRIPTION!
    setEditorTab('plan');
    setIsMobilePreviewOpen(false);
    setIsVipShowcaseOpen(true);

    addToast(
      'error',
      '⚠️ Seu Período de 30 Dias Grátis Expirou!',
      'Para continuar baixando a certidão oficial em PDF (300 DPI) e salvar imagens, selecione seu plano mensal a partir de R$ 9,90/mês.'
    );
    return false;
  };

  // PDF Download Handler (triggers Plan check & Checkout Pix if not subscribed)
  const handleDownloadPdf = async () => {
    if (!checkPlanRequirement()) return;
    if (!requireAuthForAction('baixar a certidão oficial em PDF')) return;

    await executePdfDownload();
  };

  // PNG Image Download Handler (triggers Plan check & Checkout Pix if not subscribed)
  const handleDownloadImage = async () => {
    if (!checkPlanRequirement()) return;
    if (!requireAuthForAction('salvar a imagem da certidão')) return;

    await executeImageDownload();
  };

  const handlePaymentApproved = (plan: CheckoutPlan) => {
    const key = getCertUniqueKey();
    const updated = [...paidCertificates, key];
    setPaidCertificates(updated);
    localStorage.setItem('cartorio_paid_certs', JSON.stringify(updated));

    // Save active subscription plan
    setActivePlan(plan);
    localStorage.setItem('cartorio_active_plan', JSON.stringify(plan));

    setIsCheckoutOpen(false);
    addToast('success', '🎉 Pagamento Aprovado com Sucesso!', `Plano "${plan.name}" ativado. Seu download começará agora!`);
    fireLoveConfetti();

    // Auto trigger download
    setTimeout(() => {
      executePdfDownload();
    }, 500);
  };

  // Print Handler (triggers Plan check & Checkout Pix if not subscribed)
  const handlePrint = () => {
    if (!checkPlanRequirement()) return;
    if (!requireAuthForAction('imprimir a certidão')) return;

    addToast('info', 'Preparando Impressão', 'Certifique-se de selecionar papel A4 sem margens nas opções da impressora.');
    setTimeout(() => {
      printCertificate();
    }, 400);
  };

  // Share Handler
  const handleShare = async () => {
    if (!requireAuthForAction('compartilhar a certidão')) return;

    const title = `Certidão Oficial do Amor: ${data.partner1} & ${data.partner2}`;
    const text = `Veja nossa Certidão Oficial de Namoro registrada no Cartório do Amor!`;
    const res = await shareCertificateData(title, text);
    if (res.method === 'clipboard') {
      addToast('success', 'Link Copiado!', 'O link para compartilhar foi copiado para sua área de transferência.');
    } else if (res.success) {
      addToast('success', 'Compartilhado com sucesso!');
    }
  };



  // If Admin Database Page is active via external link (/admin, /database, /banco-sql, ?admin=sql)
  if (isAdminPage) {
    return (
      <AdminDatabasePage
        onBackToApp={() => {
          window.history.pushState({}, '', '/');
          setIsAdminPage(false);
        }}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        activePlan={activePlan}
        onSetActivePlan={(plan) => {
          setActivePlan(plan);
          if (plan) {
            localStorage.setItem('cartorio_active_plan', JSON.stringify(plan));
          } else {
            localStorage.removeItem('cartorio_active_plan');
            localStorage.removeItem('cartorio_paid_certs');
            setPaidCertificates([]);
          }
          addToast('success', 'Plano Atualizado', plan ? `Simulando agora: ${plan.name}` : 'Simulando agora: Sem Plano');
        }}
        trialStatus={trialStatus}
        onSimulateExpireTrial={() => {
          const updated = simulateExpireTrial();
          setTrialStatus({ ...updated });
          addToast('info', 'Teste Grátis Expirado', 'Simulação: O período de 30 dias foi expirado.');
        }}
        onResetTrial={() => {
          const updated = resetTrialTo30Days();
          setTrialStatus({ ...updated });
          addToast('success', 'Teste Grátis Restaurado', `Simulação: 30 dias grátis válidos até ${updated.endDateFormatted}.`);
        }}
        onOpenPlansPage={() => {
          setIsAdminPage(false);
          handleOpenPlansPage();
        }}
        onOpenCouplePage={() => {
          setIsAdminPage(false);
          handleOpenCouplePageWithGating();
        }}
      />
    );
  }

  // If Login Page is open, render full login screen
  if (isLoginOpen) {
    return (
      <>
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToApp={() => setIsLoginOpen(false)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        />
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  // Dedicated handlers to open/close Plans Showcase Page with URL synchronization (?view=planos)
  const handleOpenPlansPage = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'planos');
    window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    setIsVipShowcaseOpen(true);
  };

  const handleClosePlansPage = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('view');
    url.searchParams.delete('teste');
    url.searchParams.delete('pagina');
    window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    setIsVipShowcaseOpen(false);
  };

  // Dedicated handler to open Couple Love Web Page in Demonstration Mode from VIP Plans Showcase
  const handleOpenCouplePageDemoFromPlans = () => {
    setOpenedCouplePageFromPlans(true);
    setIsVipShowcaseOpen(false);
    setIsCoupleLovePageOpen(true);
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'casal');
    url.searchParams.set('demo', 'vip');
    window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
  };

  // Dedicated handler to open Couple Love Web Page (?view=casal)
  // Non-VIP users access in Demo/Preview Mode with sticky banner; VIP users access with full freedom.
  const handleOpenCouplePageWithGating = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'casal');
    window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    setIsCoupleLovePageOpen(true);
  };

  // Dedicated Showcase Page for VIP Subscriptions & Benefits (?view=planos)
  if (isVipShowcaseOpen) {
    return (
      <>
        <VipPlansShowcasePage
          onBackToApp={handleClosePlansPage}
          onSelectPlan={(plan) => {
            setCheckoutInitialPlan(plan);
            setIsCheckoutOpen(true);
          }}
          activePlan={activePlan}
          partner1={data.partner1}
          partner2={data.partner2}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
          trialStatus={trialStatus}
          onOpenCouplePage={handleOpenCouplePageDemoFromPlans}
        />
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onPaymentApproved={handlePaymentApproved}
          partner1={data.partner1}
          partner2={data.partner2}
          userEmail={currentUser?.email}
          userName={currentUser?.name}
          initialPlan={checkoutInitialPlan}
        />
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  // Dedicated Interactive Web Page for the Couple (QR Code page with 24/7 Music, Realtime counter, Letter, Gallery)
  // Exclusive to Pack do Amor Eterno (R$ 29,90) - other users view in Demo Mode
  if (isCoupleLovePageOpen) {
    const hasPackEternoPlan = activePlan?.id === 'completo';
    return (
      <>
        <CoupleLoveWebPage
          data={data}
          isDemoMode={!hasPackEternoPlan}
          backButtonLabel={openedCouplePageFromPlans ? 'Voltar aos Planos' : 'Voltar ao Editor'}
          onBackToApp={() => {
            const url = new URL(window.location.href);
            url.searchParams.delete('view');
            url.searchParams.delete('pagina');
            url.searchParams.delete('demo');
            setIsCoupleLovePageOpen(false);
            if (openedCouplePageFromPlans) {
              setOpenedCouplePageFromPlans(false);
              setIsVipShowcaseOpen(true);
              url.searchParams.set('view', 'planos');
            }
            window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
          }}
          onUpgradePlan={() => {
            const packEternoPlan = CHECKOUT_PLANS.find((p) => p.id === 'completo') || CHECKOUT_PLANS[2];
            setCheckoutInitialPlan(packEternoPlan);
            setIsCheckoutOpen(true);
          }}
          onUpdateData={(updated) => {
            setData((prev) => ({ ...prev, ...updated }));
            addToast('success', 'Página Atualizada!', 'As informações e a música foram salvas com sucesso.');
          }}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
          onOpenPdf={handleDownloadPdf}
        />
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onPaymentApproved={handlePaymentApproved}
          partner1={data.partner1}
          partner2={data.partner2}
          userEmail={currentUser?.email}
          userName={currentUser?.name}
          initialPlan={checkoutInitialPlan}
        />
        {/* Hidden Document for seamless PDF/Image export while on Couple Page */}
        <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0" aria-hidden="true">
          <CertificateDocument data={data} />
        </div>
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      
      {/* Top Navigation */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onResetData={handleResetData}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        user={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        isInstallable={isInstallable}
        onInstall={promptInstall}
        activePlan={activePlan}
        onOpenPlanModal={handleOpenPlansPage}
        onOpenVipShowcase={handleOpenPlansPage}
        trialStatus={trialStatus}
        onOpenCouplePage={handleOpenCouplePageWithGating}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8">
        
        {/* Split View Grid (Desktop >= lg) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          
          {/* Left Panel: Interactive Editor (45% ~ 5 of 12 cols) */}
          <section 
            aria-label="Editor da Certidão"
            className="lg:col-span-5 h-[calc(100vh-140px)] sticky top-20 sm:top-24 flex flex-col min-h-[580px]"
          >
            <EditorForm
              data={data}
              onChange={handleFieldChange}
              onOpenAiModal={() => {
                if (!planPermissions.canUseAiVows) {
                  setUpgradeModalData({
                    title: 'Recurso Exclusivo VIP',
                    description: 'O Gerador de Votos com IA Ilimitado cria declarações e juramentos poéticos personalizados com 1 clique e faz parte do Combo VIP Interativo ou Pack Eterno.',
                    requiredPlanId: 'vip',
                    featureName: 'Gerador de Votos com IA Ilimitado',
                  });
                  return;
                }
                setIsAiModalOpen(true);
              }}
              onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
              onOpenQrModal={() => setIsQrModalOpen(true)}
              activePlan={activePlan}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onDownloadPdf={handleDownloadPdf}
              trialStatus={trialStatus}
              currentTab={editorTab}
              onTabChange={setEditorTab}
              onOpenVipShowcase={handleOpenPlansPage}
              canUseAiVows={planPermissions.canUseAiVows}
              canUseQrMusic={planPermissions.canUseQrMusic}
              onPromptUpgrade={setUpgradeModalData}
              onOpenCouplePage={handleOpenCouplePageWithGating}
            />
          </section>

          {/* Right Panel: Sticky Live Preview (55% ~ 7 of 12 cols) */}
          <section 
            aria-label="Prévia em Tempo Real da Certidão"
            className="hidden lg:flex lg:col-span-7 flex-col h-[calc(100vh-140px)] sticky top-20 sm:top-24 min-h-[580px]"
          >
            <PreviewPanel
              data={data}
              onDownloadPdf={handleDownloadPdf}
              onDownloadImage={handleDownloadImage}
              onPrint={handlePrint}
              onShare={handleShare}
              onOpenCouplePage={handleOpenCouplePageWithGating}
              isExportingPdf={isExportingPdf}
              isExportingImage={isExportingImage}
              isLoggedIn={Boolean(currentUser)}
              isPaid={hasAccess}
              selectedDocument={selectedDocument}
              onSelectDocument={setSelectedDocument}
              canAccessAllDocuments={planPermissions.canAccessAllDocuments}
              onPromptUpgrade={setUpgradeModalData}
            />
          </section>

        </div>

      </main>

      {/* Stitch Romantic Editorial Notary Footer */}
      <footer className="w-full bg-[#f4ece8] dark:bg-stone-900/90 py-8 px-4 sm:px-8 border-t border-border-romantic dark:border-stone-800 shadow-[0_-1px_6px_rgba(114,9,44,0.03)] mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <Scroll className="w-4 h-4 text-wine-rich" />
              <span className="font-serif text-sm font-bold text-wine-rich uppercase tracking-wider">
                Cartório Notarial do Amor do Brasil
              </span>
            </div>
            <p className="text-xs text-ink-muted text-center md:text-left max-w-md">
              Autenticação simbólica perpétua e celebração afetiva amparada sob padrões de segurança e privacidade LGPD.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-ink-muted hover:text-wine-rich transition-colors cursor-pointer"
            >
              Termos de Celebração
            </button>
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-ink-muted hover:text-wine-rich transition-colors cursor-pointer"
            >
              Políticas de Privacidade
            </button>
            <button
              type="button"
              onClick={handleOpenPlansPage}
              className="text-ink-muted hover:text-wine-rich transition-colors cursor-pointer"
            >
              Selo de Autenticidade & Planos
            </button>
          </div>
          <div className="text-[11px] text-ink-faint text-center">
            © {new Date().getFullYear()} Cartório do Amor • Todos os sentimentos registrados.
          </div>
        </div>
      </footer>

      {/* Mobile Floating Action Bottom Bar (< lg) */}
      <MobileBottomBar
        onOpenPreview={() => setIsMobilePreviewOpen(true)}
        onDownloadPdf={handleDownloadPdf}
        onOpenPlans={handleOpenPlansPage}
        isExportingPdf={isExportingPdf}
        isLoggedIn={Boolean(currentUser)}
        isPaid={hasAccess}
      />

      {/* Mobile Fullscreen Modal Preview */}
      <MobilePreviewModal
        isOpen={isMobilePreviewOpen}
        onClose={() => setIsMobilePreviewOpen(false)}
        data={data}
        onDownloadPdf={handleDownloadPdf}
        onDownloadImage={handleDownloadImage}
        onPrint={handlePrint}
        onShare={handleShare}
        onOpenCouplePage={handleOpenCouplePageWithGating}
        isExportingPdf={isExportingPdf}
        isExportingImage={isExportingImage}
        isLoggedIn={Boolean(currentUser)}
        isPaid={hasAccess}
        selectedDocument={selectedDocument}
      />

      {/* Feature Upgrade Modal (When clicking gated features) */}
      <FeatureUpgradeModal
        isOpen={Boolean(upgradeModalData)}
        onClose={() => setUpgradeModalData(null)}
        data={upgradeModalData}
        onUpgradeToPlan={(plan) => {
          setUpgradeModalData(null);
          setCheckoutInitialPlan(plan);
          setIsCheckoutOpen(true);
        }}
        onOpenPlansPage={handleOpenPlansPage}
      />


      {/* Mercado Pago Pix Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onPaymentApproved={handlePaymentApproved}
        partner1={data.partner1}
        partner2={data.partner2}
        userEmail={currentUser?.email}
        userName={currentUser?.name}
        initialPlan={checkoutInitialPlan}
      />

      {/* AI Vows Generator Modal */}
      <AiPromptModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyVows={handleApplyAiVows}
        partner1={data.partner1}
        partner2={data.partner2}
        city={data.city}
      />

      {/* Individual QR Code Generator & Printable Card Modal */}
      <QrCodeCardModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        partner1={data.partner1}
        partner2={data.partner2}
        secretMessage={data.secretMessage}
        qrPhrase={data.qrPhrase}
        qrLanguage={data.qrLanguage}
        onMessageChange={(msg) => handleFieldChange('secretMessage', msg)}
        onPhraseChange={(phrase) => handleFieldChange('qrPhrase', phrase)}
        onLanguageChange={(lang) => handleFieldChange('qrLanguage', lang)}
        isLoggedIn={Boolean(currentUser)}
        onRequireLogin={() => requireAuthForAction('imprimir ou salvar o cartão QR Code')}
        isPaid={hasActivePlan}
        onRequirePlan={checkPlanRequirement}
      />

      {/* LGPD & Privacy Policy Modal Document */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Floating LGPD Acknowledgment Banner */}
      <LgpdConsentBanner
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      {/* PWA Floating Installation Banner */}
      <PwaInstallBanner
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIos={isIos}
        onInstall={promptInstall}
      />

      {/* Floating Interactive Toast System */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Dedicated Print Portal: Visible ONLY when printing (window.print) */}
      <div id="certificate-print-portal" className="hidden print:block" aria-hidden="true">
        {selectedDocument === 'contrato' ? (
          <LoveContractDocument data={data} />
        ) : selectedDocument === 'rg' ? (
          <LoveIdCardDocument data={data} />
        ) : (
          <CertificateDocument data={data} />
        )}
      </div>

    </div>
  );
}

export default App;
