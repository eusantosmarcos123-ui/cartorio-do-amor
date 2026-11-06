import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  Music, 
  Clock, 
  Calendar, 
  MapPin, 
  Share2, 
  ArrowLeft, 
  ShieldCheck, 
  Scroll, 
  Check, 
  Images, 
  Maximize2, 
  X, 
  Edit3, 
  Plus, 
  Trash2, 
  Upload, 
  Video, 
  Disc,
  Save,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertTriangle,
  Lock,
  Zap
} from 'lucide-react';
import type { CertificateData } from '../types/certificate';
import { CertificateDocument } from './CertificateDocument';
import { calculateRelationshipTime, calculateLiveRelationshipTime, formatDateBR } from '../utils/dateUtils';
import { exportCertificateToPdf, exportCertificateToImage, printCertificate, fireLoveConfetti } from '../utils/exportUtils';

interface CoupleLoveWebPageProps {
  data: CertificateData;
  onBackToApp: () => void;
  onUpdateData?: (updated: Partial<CertificateData>) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenPdf?: () => void;
  isDemoMode?: boolean;
  onUpgradePlan?: () => void;
  backButtonLabel?: string;
}

export const CoupleLoveWebPage: React.FC<CoupleLoveWebPageProps> = ({
  data,
  onBackToApp,
  onUpdateData,
  darkMode: _darkMode = false,
  onToggleDarkMode: _onToggleDarkMode,
  onOpenPdf: _onOpenPdf,
  isDemoMode = false,
  onUpgradePlan,
  backButtonLabel,
}) => {
  // Real-time ticking timer (updates every second)
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live breakdown down to seconds
  const liveTime = useMemo(() => {
    return calculateLiveRelationshipTime(data.startDate, now);
  }, [data.startDate, now]);

  // Animated letter envelope open state
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  const handleToggleLetter = () => {
    if (!isLetterOpen) {
      fireLoveConfetti();
    }
    setIsLetterOpen((prev) => !prev);
  };

  // PDF Certificate Preview Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState<boolean>(false);
  const [pdfModalScale, setPdfModalScale] = useState<number>(0.65);
  const [isPdfModalAutoFit, setIsPdfModalAutoFit] = useState<boolean>(true);
  const pdfModalContainerRef = useRef<HTMLDivElement>(null);

  const calculatePdfModalAutoFit = useCallback(() => {
    if (!pdfModalContainerRef.current) return;
    const containerWidth = pdfModalContainerRef.current.clientWidth - 48;
    if (containerWidth > 0) {
      // Standard A4 dimensions: 794px width x 1123px height (matches PreviewPanel)
      const calculatedScale = Math.min(Math.max(containerWidth / 794, 0.35), 0.95);
      setPdfModalScale(Number(calculatedScale.toFixed(2)));
    }
  }, []);

  useEffect(() => {
    if (!isPdfModalOpen) return;
    if (pdfModalContainerRef.current) {
      pdfModalContainerRef.current.scrollTop = 0;
    }
    if (isPdfModalAutoFit) {
      const timer = setTimeout(() => {
        calculatePdfModalAutoFit();
        if (pdfModalContainerRef.current) {
          pdfModalContainerRef.current.scrollTop = 0;
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isPdfModalOpen, isPdfModalAutoFit, calculatePdfModalAutoFit]);

  useEffect(() => {
    if (!isPdfModalOpen || !isPdfModalAutoFit) return;
    const handleResize = () => calculatePdfModalAutoFit();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isPdfModalOpen, isPdfModalAutoFit, calculatePdfModalAutoFit]);

  const handleDownloadCertificatePdf = async () => {
    const el = document.getElementById('certificate-document') || (document.querySelector('.certificate-print-container') as HTMLElement);
    if (!el) {
      alert('Certidão não localizada. Tente novamente.');
      return;
    }
    try {
      setIsDownloadingPdf(true);
      const filename = `certidao-${data.partner1 || 'par1'}-${data.partner2 || 'par2'}.pdf`.toLowerCase().replace(/\s+/g, '-');
      await exportCertificateToPdf(el, filename);
      fireLoveConfetti();
    } catch (e) {
      console.error(e);
      alert('Falha ao gerar PDF. Tente novamente.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadCertificateImage = async () => {
    const el = document.getElementById('certificate-document') || (document.querySelector('.certificate-print-container') as HTMLElement);
    if (!el) {
      alert('Certidão não localizada. Tente novamente.');
      return;
    }
    try {
      setIsDownloadingImage(true);
      const filename = `certidao-${data.partner1 || 'par1'}-${data.partner2 || 'par2'}.png`.toLowerCase().replace(/\s+/g, '-');
      await exportCertificateToImage(el, filename);
      fireLoveConfetti();
    } catch (e) {
      console.error(e);
      alert('Falha ao salvar imagem. Tente novamente.');
    } finally {
      setIsDownloadingImage(false);
    }
  };

  // Spotify / YouTube Embed detection with wide regex
  const musicEmbed = useMemo(() => {
    const raw = data.musicUrl || data.secretMessage || '';
    if (!raw) return null;

    // Spotify (including international intl-xx paths)
    const spotifyMatch = raw.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist)\/([a-zA-Z0-9]+)/i);
    if (spotifyMatch) {
      const type = spotifyMatch[1];
      const id = spotifyMatch[2];
      return {
        type: 'spotify',
        src: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`,
      };
    }

    // YouTube (regular watch?v=..., youtu.be/..., shorts/..., embed/..., m.youtube.com/...)
    const ytMatch = raw.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/|m\.youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/i);
    if (ytMatch) {
      const ytId = ytMatch[1];
      return {
        type: 'youtube',
        src: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`,
      };
    }

    return null;
  }, [data.musicUrl, data.secretMessage]);

  // Gallery photos
  const gallery = useMemo(() => {
    const photos: string[] = [];
    if (data.photoUrl) photos.push(data.photoUrl);
    if (data.galleryPhotos && data.galleryPhotos.length > 0) {
      data.galleryPhotos.forEach((p) => {
        if (p && !photos.includes(p)) photos.push(p);
      });
    }
    if (photos.length === 0) {
      photos.push(
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80'
      );
    }
    return photos;
  }, [data.photoUrl, data.galleryPhotos]);

  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // In-page Customizer Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPartner1, setEditPartner1] = useState(data.partner1);
  const [editPartner2, setEditPartner2] = useState(data.partner2);
  const [editStartDate, setEditStartDate] = useState(data.startDate);
  const [editCity, setEditCity] = useState(data.city);
  const [editState, setEditState] = useState(data.state);
  const [editMusicUrl, setEditMusicUrl] = useState(data.musicUrl || '');
  const [editVows, setEditVows] = useState(data.vows || '');
  const [editGalleryPhotos, setEditGalleryPhotos] = useState<string[]>(data.galleryPhotos || []);

  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Sync edit form whenever modal opens
  const handleOpenEditModal = () => {
    setEditPartner1(data.partner1);
    setEditPartner2(data.partner2);
    setEditStartDate(data.startDate);
    setEditCity(data.city);
    setEditState(data.state);
    setEditMusicUrl(data.musicUrl || '');
    setEditVows(data.vows || '');
    setEditGalleryPhotos(data.galleryPhotos && data.galleryPhotos.length > 0 ? data.galleryPhotos : gallery);
    setIsEditModalOpen(true);
  };

  const handleAddPhotosFromDevice = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    Array.from(e.target.files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          setEditGalleryPhotos((prev) => [...prev, base64]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setEditGalleryPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveCustomization = () => {
    const updated: Partial<CertificateData> = {
      partner1: editPartner1,
      partner2: editPartner2,
      startDate: editStartDate,
      city: editCity,
      state: editState,
      musicUrl: editMusicUrl,
      vows: editVows,
      galleryPhotos: editGalleryPhotos,
    };

    if (onUpdateData) {
      onUpdateData(updated);
    }

    // Save to localStorage
    try {
      localStorage.setItem('cartorio_custom_couple_data', JSON.stringify(updated));
    } catch {
      // Ignored
    }

    // Update query params in URL
    const url = new URL(window.location.href);
    url.searchParams.set('p1', editPartner1);
    url.searchParams.set('p2', editPartner2);
    url.searchParams.set('d', editStartDate);
    url.searchParams.set('c', editCity);
    url.searchParams.set('s', editState);
    if (editMusicUrl) {
      url.searchParams.set('m', editMusicUrl);
    }
    window.history.replaceState({}, '', url.pathname + url.search);

    setIsEditModalOpen(false);
    fireLoveConfetti();
  };

  const [demoShareAlert, setDemoShareAlert] = useState(false);

  const handleShare = async () => {
    if (isDemoMode) {
      setDemoShareAlert(true);
      setTimeout(() => setDemoShareAlert(false), 5000);
      if (onUpgradePlan) {
        setTimeout(() => {
          onUpgradePlan();
        }, 1200);
      }
      return;
    }

    const shareUrl = window.location.href;
    const title = `Página Oficial do Amor: ${data.partner1} & ${data.partner2}`;
    const text = `Veja nossa história de amor, contador em tempo real e certidão oficial registrada!`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      // Ignored
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-[#1a0810] to-stone-950 text-stone-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Floating Animated Hearts in Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-25 z-0" aria-hidden="true">
        <div className="absolute top-[10%] left-[15%] w-2 h-2 rounded-full bg-rose-400 blur-[1px] animate-ping" />
        <div className="absolute top-[40%] right-[12%] w-3 h-3 rounded-full bg-amber-300 blur-[1px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[8%] w-2.5 h-2.5 rounded-full bg-rose-500 blur-[1px] animate-bounce" />
        <div className="absolute top-[70%] right-[25%] w-2 h-2 rounded-full bg-pink-300 blur-[1px] animate-pulse" />
      </div>

      {/* Top Header & Sticky Warning Banner */}
      <div className="sticky top-0 z-40">
        {/* Sticky Top Warning Banner for Demo Mode */}
        {isDemoMode && (
          <div className="bg-gradient-to-r from-stone-950 via-[#2e0917] to-stone-950 border-b-2 border-amber-500 shadow-2xl backdrop-blur-md px-3 sm:px-6 py-2.5">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0 text-amber-400 shadow-sm">
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black text-amber-300 flex items-center justify-center sm:justify-start gap-1.5 uppercase tracking-wide">
                    <span>⚠️ MODO PRÉVIA — RECURSO EXCLUSIVO PACK DO AMOR ETERNO</span>
                  </p>
                  <p className="text-[11px] sm:text-xs text-stone-200 leading-tight mt-0.5">
                    Você está em modo de demonstração. Para salvar suas fotos permanentemente, liberar a música 24/7 e compartilhar o link oficial do seu amor sem travas, assine o plano <strong className="text-amber-300 font-bold">Pack do Amor Eterno (R$ 29,90)</strong>.
                  </p>
                </div>
              </div>

              {onUpgradePlan && (
                <button
                  type="button"
                  onClick={onUpgradePlan}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-950/50 transition-all active:scale-95 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-stone-950" />
                  <span>⚡ Assinar Pack Eterno (R$ 29,90)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Top Navbar */}
        <header className="backdrop-blur-md bg-stone-950/90 border-b border-rose-950/60 px-3 sm:px-8 py-3 flex items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToApp}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">{backButtonLabel || 'Voltar ao Editor'}</span>
              <span className="sm:hidden">{backButtonLabel ? 'Voltar' : 'Voltar'}</span>
            </button>

            {isDemoMode && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/50 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm animate-pulse">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>MODO PRÉVIA</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isDemoMode && onUpgradePlan && (
              <button
                type="button"
                onClick={onUpgradePlan}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 px-3.5 py-1.5 rounded-xl transition-all active:scale-95 shadow-md shadow-amber-950/30 cursor-pointer"
                title="Ativar no Pack do Amor Eterno"
              >
                <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
                <span>Assinar Pack Eterno (R$ 29,90)</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-rose-900/40 hover:bg-rose-900/70 border border-rose-700/50 text-rose-200 px-3 py-1.5 rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer"
              title="Compartilhar página do casal"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>
          </div>
        </header>
      </div>

      {/* Share Restriction Toast Alert for Demo Mode */}
      <AnimatePresence>
        {demoShareAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] p-4 rounded-2xl bg-stone-900 border-2 border-amber-500 text-stone-100 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-300">
                  ⚠️ Este link está em modo prévia!
                </p>
                <p className="text-[11px] text-stone-300 mt-1 leading-relaxed">
                  Assine o Pack do Amor Eterno (R$ 29,90) para gerar o link definitivo e personalizado do casal. Abrindo checkout...
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDemoShareAlert(false)}
                className="text-stone-400 hover:text-white p-1"
                aria-label="Fechar alerta"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-10 sm:space-y-14">

        {/* ================= HERO SECTION ================= */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/70 border border-rose-700/60 text-rose-300 text-xs font-semibold shadow-inner">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Nossa História Oficial Registrada</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-serif">
            <span className="bg-gradient-to-r from-rose-200 via-amber-100 to-rose-300 bg-clip-text text-transparent">
              {data.partner1 || 'Você'}
            </span>
            <span className="text-rose-500 font-serif italic mx-3 font-normal">&</span>
            <span className="bg-gradient-to-r from-rose-300 via-amber-100 to-rose-200 bg-clip-text text-transparent">
              {data.partner2 || 'Seu Amor'}
            </span>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-stone-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Juntos desde <strong>{formatDateBR(data.startDate)}</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{data.city || 'Curitiba'}, {data.state || 'PR'}</span>
            </div>
          </div>

          {/* Central de Personalização - Banner Chamativo de Apoio */}
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-stone-900/90 via-rose-950/80 to-stone-900/90 border-2 border-amber-400/60 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/40 text-xl shadow-inner">
                ✨
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-amber-200">
                  Quer alterar os Nomes, Data, Música do YouTube ou Fotos?
                </p>
                <p className="text-[11px] sm:text-xs text-stone-300 leading-snug">
                  Todas as modificações da página são feitas pelo botão de personalização!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpenEditModal}
              className="shrink-0 w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:opacity-95 text-stone-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/50 transition-all active:scale-95 border border-amber-200 ring-2 ring-amber-400/30 animate-pulse hover:animate-none"
            >
              <Edit3 className="w-3.5 h-3.5 text-stone-950" />
              <span>Personalizar Minha Página</span>
            </button>
          </div>
        </section>

        {/* ================= CONTADOR DE TEMPO EM TEMPO REAL ================= */}
        <section className="bg-gradient-to-br from-rose-950/40 via-stone-900/80 to-amber-950/30 rounded-3xl p-6 sm:p-8 border border-rose-900/40 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
                <Clock className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex flex-wrap items-center gap-2">
                  <span>Contador de Amor em Tempo Real</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-rose-100 bg-gradient-to-r from-rose-600/90 via-red-600/90 to-rose-600/90 border border-rose-400/60 shadow-md shadow-rose-950/60 backdrop-blur-xs whitespace-nowrap shrink-0">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-300 opacity-80" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    <span>Ao Vivo</span>
                  </span>
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Cada segundo que passa é mais um momento que escolhemos estar juntos.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenEditModal}
              title="Clique para alterar a data de início do casal"
              className="group text-xs font-semibold text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm hover:border-amber-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform shrink-0" />
              <span>{liveTime.milestoneTitle} ({liveTime.compactBadge})</span>
              <span className="text-[10px] text-amber-400/80 group-hover:text-amber-200 flex items-center gap-0.5 ml-1 pl-1.5 border-l border-amber-400/30 font-bold">
                <Edit3 className="w-2.5 h-2.5" />
                <span>Alterar Data</span>
              </span>
            </button>
          </div>

          {/* Time Digits Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 text-center">
            
            {/* Anos */}
            <div className="bg-stone-950/70 rounded-2xl p-3 border border-white/5 shadow-inner">
              <span className="block text-2xl sm:text-4xl font-black text-rose-300 font-mono">
                {liveTime.years}
              </span>
              <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">
                {liveTime.years === 1 ? 'Ano' : 'Anos'}
              </span>
            </div>

            {/* Meses */}
            <div className="bg-stone-950/70 rounded-2xl p-3 border border-white/5 shadow-inner">
              <span className="block text-2xl sm:text-4xl font-black text-rose-200 font-mono">
                {liveTime.months}
              </span>
              <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">
                {liveTime.months === 1 ? 'Mês' : 'Meses'}
              </span>
            </div>

            {/* Dias */}
            <div className="bg-stone-950/70 rounded-2xl p-3 border border-white/5 shadow-inner">
              <span className="block text-2xl sm:text-4xl font-black text-amber-200 font-mono">
                {liveTime.days}
              </span>
              <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">
                {liveTime.days === 1 ? 'Dia' : 'Dias'}
              </span>
            </div>

            {/* Horas */}
            <div className="bg-stone-950/70 rounded-2xl p-3 border border-white/5 shadow-inner">
              <span className="block text-2xl sm:text-4xl font-black text-amber-300 font-mono">
                {String(liveTime.hours).padStart(2, '0')}
              </span>
              <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">
                Horas
              </span>
            </div>

            {/* Minutos */}
            <div className="bg-stone-950/70 rounded-2xl p-3 border border-white/5 shadow-inner">
              <span className="block text-2xl sm:text-4xl font-black text-rose-200 font-mono">
                {String(liveTime.minutes).padStart(2, '0')}
              </span>
              <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">
                Minutos
              </span>
            </div>

            {/* Segundos (Ticking live) */}
            <div className="bg-stone-950/70 rounded-2xl p-3 border border-rose-500/40 shadow-inner ring-1 ring-rose-500/30">
              <span className="block text-2xl sm:text-4xl font-black text-rose-400 font-mono animate-pulse">
                {String(liveTime.seconds).padStart(2, '0')}
              </span>
              <span className="text-[11px] uppercase font-bold text-rose-400 tracking-wider">
                Segundos
              </span>
            </div>

          </div>

          {/* Total Days Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
            <span>
              Total acumulado: <strong className="text-white font-mono">{liveTime.totalDays.toLocaleString('pt-BR')} dias</strong> de conexão inabalável.
            </span>
            <div className="flex items-center gap-1.5 text-rose-300">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Nosso amor cresce a cada batimento cardíaco.</span>
            </div>
          </div>
        </section>

        {/* ================= MÚSICA DO CASAL 24/7 ================= */}
        <section className="bg-stone-900/70 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <span>Trilha Sonora Oficial do Casal</span>
                  <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full uppercase">
                    24/7
                  </span>
                </h3>
                <p className="text-xs text-stone-400">
                  A melodia que toca toda vez que nosso QR Code é escaneado.
                </p>
              </div>
            </div>
          </div>

          {/* If Spotify or YouTube embed exists */}
          {musicEmbed && (
            <div className="pt-2">
              {musicEmbed.type === 'spotify' && (
                <iframe
                  title="Player do Spotify do Casal"
                  src={musicEmbed.src}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-2xl shadow-lg border border-white/10"
                />
              )}
              {musicEmbed.type === 'youtube' && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black">
                  <iframe
                    title="Vídeo ou Música do YouTube do Casal"
                    src={musicEmbed.src}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          )}

          {!musicEmbed && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  Nenhuma música configurada ainda. Toque em "Personalizar Minha Página" ou no botão ao lado para conectar seu YouTube ou Spotify!
                </span>
              </div>
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="text-amber-300 hover:text-white font-bold underline flex items-center gap-1 shrink-0"
              >
                <span>Configurar YouTube / Spotify</span>
              </button>
            </div>
          )}
        </section>

        {/* ================= CARTA ANIMADA DE AMOR (ENVELOPE 3D) ================= */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center justify-center gap-2">
              <span>Carta Secreta & Cláusulas do Amor</span>
              <Sparkles className="w-5 h-5 text-amber-300" />
            </h3>
            <p className="text-xs text-stone-400">
              Toque no envelope lacrado com cera para abrir a carta com as declarações oficiais.
            </p>
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white font-bold bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-3 py-1 rounded-xl transition-all active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                <span>Editar Texto dos Votos & Carta</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              
              {/* Envelope Container */}
              <div 
                onClick={handleToggleLetter}
                className="cursor-pointer group relative bg-gradient-to-br from-[#8a1435] via-[#5e0c24] to-[#3a0615] rounded-3xl p-6 sm:p-8 border-2 border-amber-400/50 shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] text-center overflow-hidden"
              >
                {/* Gold Envelope Flap Lines */}
                <div className="absolute inset-x-0 top-0 h-16 border-b border-amber-400/30 pointer-events-none" />

                {/* Wax Seal Button */}
                <div className="relative z-10 flex flex-col items-center justify-center my-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-800 to-rose-600 border-2 border-amber-300 flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-300">
                    <Heart className="w-7 h-7 text-amber-200 fill-amber-200" />
                  </div>
                  <span className="mt-3 text-xs font-bold text-amber-200 tracking-wider uppercase">
                    {isLetterOpen ? 'Clique para Fechar a Carta' : 'Toque no Selo para Abrir a Carta'}
                  </span>
                </div>

                <p className="text-[11px] text-rose-200/80 italic font-serif">
                  « Declarações protegidas sob sigilo e autenticidade perpétua »
                </p>
              </div>

              {/* Unfolded Letter Body */}
              <AnimatePresence>
                {isLetterOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="bg-[#fcf8f0] text-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-[#c5a059] shadow-2xl font-serif space-y-4 relative">
                      
                      {/* Watermark Crest */}
                      <div className="flex justify-center">
                        <span className="text-[10px] font-bold tracking-[0.25em] text-[#72092c] uppercase border-b border-[#c5a059] pb-1">
                          Cartório do Amor • Cláusula de Afeto
                        </span>
                      </div>

                      {/* Couple Dedication */}
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-[#72092c]">
                          De {data.partner1} para {data.partner2}
                        </h4>
                        <p className="text-xs text-stone-500 italic">
                          Registrado sob fé pública com promessas mútuas
                        </p>
                      </div>

                      {/* Letter Text */}
                      <div className="text-sm leading-relaxed text-stone-800 italic text-justify px-2 whitespace-pre-line bg-white/60 p-4 rounded-xl border border-stone-200">
                        {data.vows || 'Prometo te amar em todos os dias de sol e tempestade, dividindo sonhos, risadas e a eternidade juntos.'}
                      </div>

                      {/* Signatures */}
                      <div className="pt-4 border-t border-stone-300 grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="font-cursive text-xl text-stone-900">
                            {data.signature1 || data.partner1}
                          </div>
                          <span className="block text-[10px] uppercase font-bold text-stone-500 mt-1">
                            {data.partner1}
                          </span>
                        </div>
                        <div>
                          <div className="font-cursive text-xl text-stone-900">
                            {data.signature2 || data.partner2}
                          </div>
                          <span className="block text-[10px] uppercase font-bold text-stone-500 mt-1">
                            {data.partner2}
                          </span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </section>

        {/* ================= GALERIA DE FOTOS DO CASAL ================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Images className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-lg text-white">
                Galeria de Momentos Inesquecíveis
              </h3>
            </div>
            
            <button
              type="button"
              onClick={handleOpenEditModal}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-stone-950" />
              <span>Adicionar / Trocar Fotos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {gallery.map((photoUrl, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03, rotate: idx % 2 === 0 ? -1.5 : 1.5 }}
                className="bg-white p-3 pb-5 rounded-2xl shadow-xl border border-stone-200 text-stone-800 cursor-pointer group"
                onClick={() => setActivePhotoModal(photoUrl)}
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100">
                  <img
                    src={photoUrl}
                    alt={`Momento do casal ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 className="w-5 h-5 drop-shadow" />
                  </div>
                </div>
                <div className="mt-2.5 text-center">
                  <span className="text-xs font-serif font-bold text-stone-700">
                    {idx === 0 ? 'Nossa Foto Oficial' : idx === 1 ? 'Nosso Sorriso' : 'Amor para Sempre'}
                  </span>
                  <span className="block text-[10px] text-stone-400 font-mono">
                    Momento #{idx + 1}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= CERTIDÃO OFICIAL & AUTENTICIDADE ================= */}
        <section className="bg-gradient-to-r from-stone-900 via-rose-950/40 to-stone-900 rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300 font-bold">
                REGISTRO CARTORIAL VÁLIDO
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white">
                {data.registryNumber || 'TERMO REG-8942/AM'} • {data.bookNumber || 'LIVRO: 01-AFETO'}
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Emitido pelo Cartório do Amor sob fé pública solene e amor perpétuo.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-600 hover:to-rose-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all active:scale-95"
            >
              <Scroll className="w-4 h-4" />
              <span>Ver Certidão em PDF</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4 text-rose-300" />
              <span>Enviar via WhatsApp</span>
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-rose-950/60 py-6 text-center text-xs text-stone-500 space-y-1">
        <p>Cartório do Amor Oficial • Todos os direitos do coração reservados © 2026</p>
        <p className="text-[10px] text-stone-600">
          Página interativa com música 24/7 e contador em tempo real exclusiva do Pack do Amor Eterno (R$ 29,90).
        </p>
      </footer>

      {/* ================= MODAL DE PERSONALIZAÇÃO DIRETA DA PÁGINA ================= */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 bg-stone-950/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-stone-900 border border-rose-900/60 rounded-3xl shadow-2xl overflow-hidden z-10 my-6 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-[#72092c] via-[#8c1d40] to-amber-700 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/10 text-amber-200">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base sm:text-lg flex items-center gap-2">
                      <span>Central de Personalização Completa da Página</span>
                      <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full uppercase">
                        Painel Único
                      </span>
                    </h3>
                    <p className="text-xs text-rose-200">
                      Modifique tudo aqui: Vídeo/Música do YouTube, Nomes do Casal, Data, Carta e Fotos!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-200 flex-1">
                
                {/* 1. MÚSICA DO CASAL (YOUTUBE OU SPOTIFY) */}
                <div className="bg-stone-950/80 p-4 rounded-2xl border border-rose-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <Music className="w-4 h-4 text-amber-400" />
                    <span>Música do Casal (YouTube ou Spotify)</span>
                  </div>

                  <p className="text-stone-400 text-[11px] leading-relaxed">
                    Copie e cole o link de qualquer clipe do <strong>YouTube</strong> (ex: <code className="text-amber-300">https://youtube.com/watch?v=...</code> ou <code className="text-amber-300">https://youtu.be/...</code>) ou faixa do <strong>Spotify</strong>.
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={editMusicUrl}
                        onChange={(e) => setEditMusicUrl(e.target.value)}
                        placeholder="Ex: https://www.youtube.com/watch?v=kJQP7kiw5Fk ou link do Spotify"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  {/* Sugestões rápidas de teste */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-stone-500">Exemplos rápidos:</span>
                    <button
                      type="button"
                      onClick={() => setEditMusicUrl('https://www.youtube.com/watch?v=2Vv-BfVoq4g')}
                      className="text-[10px] bg-red-950/70 hover:bg-red-900 text-red-200 px-2 py-0.5 rounded-md border border-red-800/60 flex items-center gap-1"
                    >
                      <Video className="w-3 h-3 text-red-400" />
                      <span>Ed Sheeran - Perfect (YouTube)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMusicUrl('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT')}
                      className="text-[10px] bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded-md border border-emerald-800/60 flex items-center gap-1"
                    >
                      <Disc className="w-3 h-3 text-emerald-400" />
                      <span>Never Gonna Give You Up (Spotify)</span>
                    </button>
                  </div>
                </div>

                {/* 2. NOMES DO CASAL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-300 mb-1">
                      Nome do Cônjuge 1
                    </label>
                    <input
                      type="text"
                      value={editPartner1}
                      onChange={(e) => setEditPartner1(e.target.value)}
                      placeholder="Ex: Vinicius"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-base sm:text-sm focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1">
                      Nome do Cônjuge 2
                    </label>
                    <input
                      type="text"
                      value={editPartner2}
                      onChange={(e) => setEditPartner2(e.target.value)}
                      placeholder="Ex: Beatriz"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-base sm:text-sm focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                {/* 3. DATA DE INÍCIO & LOCALIDADE */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-stone-300 mb-1">
                      Data de Início do Relacionamento
                    </label>
                    <input
                      type="date"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white focus:ring-2 focus:ring-rose-500"
                    />
                    <div className="mt-2 py-1.5 px-3 rounded-xl border border-amber-400/40 bg-amber-950/40 text-center">
                      <span className="text-[11px] font-bold text-amber-200">
                        ⏱️ Contador: {calculateRelationshipTime(editStartDate).formattedText}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      placeholder="Ex: Curitiba"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1">
                      Estado (UF)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={editState}
                      onChange={(e) => setEditState(e.target.value.toUpperCase())}
                      placeholder="PR"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white focus:ring-2 focus:ring-rose-500 uppercase"
                    />
                  </div>
                </div>

                {/* 4. CARTA / VOTOS DO CASAL */}
                <div>
                  <label className="block font-bold text-stone-300 mb-1 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Declaração de Amor (Exibida na Carta Animada)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={editVows}
                    onChange={(e) => setEditVows(e.target.value)}
                    placeholder="Escreva seus votos, declaração ou promessas mútuas..."
                    className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder:text-stone-500 focus:ring-2 focus:ring-rose-500 leading-relaxed font-serif"
                  />
                </div>

                {/* 5. GALERIA DE FOTOS DO CASAL */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-300 flex items-center gap-1.5">
                      <Images className="w-4 h-4 text-amber-400" />
                      <span>Fotos da Galeria ({editGalleryPhotos.length} fotos)</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 font-bold text-xs flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Adicionar Fotos do Celular/PC</span>
                    </button>
                    <input
                      ref={galleryFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleAddPhotosFromDevice}
                    />
                  </div>

                  {/* Photo Thumbnails */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {editGalleryPhotos.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-stone-950 border border-stone-800 group">
                        <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-900/80 hover:bg-red-700 text-white rounded-lg opacity-80 group-hover:opacity-100 transition-opacity"
                          title="Remover foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSaveCustomization}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar e Atualizar Página</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Photo Modal */}
      <AnimatePresence>
        {activePhotoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
              aria-label="Fechar foto"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={activePhotoModal}
              alt="Foto ampliada do casal"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border-2 border-white/20"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Visualização Oficial da Certidão em Alta Resolução */}
      <AnimatePresence>
        {isPdfModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-stone-900 border border-rose-900/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] my-auto text-white"
            >
              {/* Modal Top Bar */}
              <div className="p-4 bg-gradient-to-r from-[#72092c] via-[#8c1d40] to-amber-700 flex flex-wrap items-center justify-between gap-3 shrink-0 border-b border-amber-400/30">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/10 text-amber-200">
                    <Scroll className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">
                      Certidão Oficial de Namoro & Compromisso
                    </h3>
                    <p className="text-xs text-rose-200">
                      Visualização oficial em alta resolução (300 DPI) para download e impressão
                    </p>
                  </div>
                </div>

                {/* Actions & Zoom Controls */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPdfModalAutoFit(false);
                        setPdfModalScale((prev) => Math.max(Number((prev - 0.08).toFixed(2)), 0.3));
                      }}
                      className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
                      title="Diminuir Zoom"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-[11px] font-mono px-1 font-bold text-amber-200 min-w-[36px] text-center">
                      {Math.round(pdfModalScale * 100)}%
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPdfModalAutoFit(false);
                        setPdfModalScale((prev) => Math.min(Number((prev + 0.08).toFixed(2)), 1.3));
                      }}
                      className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
                      title="Aumentar Zoom"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPdfModalAutoFit(true);
                        calculatePdfModalAutoFit();
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                        isPdfModalAutoFit ? 'bg-amber-400 text-stone-950' : 'text-stone-300 hover:text-white hover:bg-white/10'
                      }`}
                      title="Ajustar à tela inteira"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Ajustar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPdfModalAutoFit(false);
                        setPdfModalScale(1);
                      }}
                      className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
                      title="Tamanho Real (100%)"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actions: Download PDF, Save Image, Print & Close */}
                  <button
                    type="button"
                    onClick={handleDownloadCertificatePdf}
                    disabled={isDownloadingPdf}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloadingPdf ? 'Gerando...' : 'Baixar PDF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadCertificateImage}
                    disabled={isDownloadingImage}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/15 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Images className="w-3.5 h-3.5 text-amber-300" />
                    <span className="hidden sm:inline">Salvar Imagem</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => printCertificate()}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/15 active:scale-95 transition-all"
                    title="Imprimir Certidão"
                  >
                    <Printer className="w-3.5 h-3.5 text-rose-300" />
                    <span className="hidden sm:inline">Imprimir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPdfModalOpen(false)}
                    className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors ml-1"
                    aria-label="Fechar visualização"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Certificate Scrollable Container - Starts at top, never cuts off header */}
              <div 
                ref={pdfModalContainerRef}
                className="flex-1 min-h-[460px] overflow-auto p-4 sm:p-6 flex items-start justify-center bg-stone-950/80 relative"
              >
                <div 
                  className="transition-transform duration-150 origin-top flex justify-center py-2"
                  style={{
                    transform: `scale(${pdfModalScale})`,
                    transformOrigin: 'top center',
                    marginBottom: `${(pdfModalScale - 1) * 1123}px`,
                  }}
                >
                  <div className="shadow-2xl rounded-sm">
                    <CertificateDocument data={data} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Permanent Offscreen Certificate Container so element is always located in DOM */}
      <div 
        id="certificate-fallback-container"
        className="fixed -left-[9999px] top-0 pointer-events-none" 
        style={{ width: '794px', height: '1123px' }} 
        aria-hidden="true"
      >
        <CertificateDocument data={data} />
      </div>

      {/* Floating Action Button (FAB) - Fixo no canto inferior direito para acesso instantâneo */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={handleOpenEditModal}
          className="group flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 via-rose-600 to-pink-600 hover:from-amber-400 hover:via-rose-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm shadow-2xl shadow-rose-950/80 border-2 border-amber-300 hover:scale-105 active:scale-95 transition-all ring-4 ring-rose-950/60 animate-bounce hover:animate-none"
          title="Clique aqui para alterar qualquer informação da página (YouTube, Nomes, Fotos, Votos)"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>✏️ Personalizar Página</span>
          <span className="hidden sm:inline-block bg-black/40 text-amber-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
            Música, Nomes & Fotos
          </span>
        </button>
      </div>

    </div>
  );
};
