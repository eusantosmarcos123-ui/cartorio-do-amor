import { useState } from 'react';
import type { 
  CertificateData, 
  RelationshipType, 
  PhotoFrame, 
  CertificateTheme, 
  SealColor,
  TitleFont,
  BodyFont,
  SignatureFont
} from '../types/certificate';
import { PhotoUpload } from './PhotoUpload';
import { ThemeSelector } from './ThemeSelector';
import { FontBoxSelector } from './FontBoxSelector';
import { BRAZILIAN_STATES, QR_LANGUAGES } from '../constants/initialData';
import type { CheckoutPlan } from '../constants/plansData';
import { calculateRelationshipTime } from '../utils/dateUtils';
import { getTrialStatus, type TrialStatus } from '../utils/trialManager';
import type { FeatureUpgradeData } from './FeatureUpgradeModal';
import { Sparkles, Trash2, Heart, Users, PenTool, Palette, Calendar, MapPin, QrCode, Type, Globe2, Printer, Check, Crown, Zap, Music, Images, Upload, Lock, Copy, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export type EditorTabId = 'couple' | 'photo' | 'vows' | 'webpage' | 'fonts' | 'style' | 'plan';

interface EditorFormProps {
  data: CertificateData;
  onChange: <K extends keyof CertificateData>(field: K, value: CertificateData[K]) => void;
  onOpenAiModal: () => void;
  onOpenPrivacyModal: () => void;
  onOpenQrModal: () => void;
  activePlan?: CheckoutPlan | null;
  onOpenCheckout?: () => void;
  onDownloadPdf?: () => void;
  currentTab?: EditorTabId;
  onTabChange?: (tab: EditorTabId) => void;
  onOpenVipShowcase?: () => void;
  trialStatus?: TrialStatus;
  canUseAiVows?: boolean;
  canUseQrMusic?: boolean;
  onPromptUpgrade?: (data: FeatureUpgradeData) => void;
  onOpenCouplePage?: () => void;
}

export const EditorForm: React.FC<EditorFormProps> = ({
  data,
  onChange,
  onOpenAiModal,
  onOpenPrivacyModal,
  onOpenQrModal,
  activePlan = null,
  onOpenCheckout,
  onDownloadPdf,
  currentTab,
  onTabChange,
  onOpenVipShowcase: _onOpenVipShowcase,
  trialStatus: passedTrialStatus,
  canUseAiVows = true,
  canUseQrMusic: _canUseQrMusic = false,
  onPromptUpgrade,
  onOpenCouplePage,
}) => {
  const trialStatus = passedTrialStatus || getTrialStatus();
  const isVipUser = activePlan?.id === 'vip' || activePlan?.id === 'completo';
  const [internalTab, setInternalTab] = useState<EditorTabId>('couple');
  const activeTab = currentTab !== undefined ? currentTab : internalTab;
  const timeInfo = calculateRelationshipTime(data.startDate);

  const handleTabClick = (tabId: EditorTabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalTab(tabId);
    }
  };
  const [confirmClearVows, setConfirmClearVows] = useState(false);

  const handleClearVows = () => {
    if (confirmClearVows) {
      onChange('vows', '');
      setConfirmClearVows(false);
    } else {
      setConfirmClearVows(true);
      setTimeout(() => setConfirmClearVows(false), 4000);
    }
  };

  const handleApplyFontPreset = (title: TitleFont, body: BodyFont, sig: SignatureFont) => {
    onChange('titleFont', title);
    onChange('bodyFont', body);
    onChange('signatureFont', sig);
  };

  const [copiedWebLink, setCopiedWebLink] = useState(false);

  const getCoupleWebPageUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cartorio-do-amor-nine.vercel.app';
    const params = new URLSearchParams();
    params.set('view', 'casal');
    if (data.partner1) params.set('p1', data.partner1);
    if (data.partner2) params.set('p2', data.partner2);
    if (data.startDate) params.set('d', data.startDate);
    if (data.city) params.set('c', data.city);
    if (data.state) params.set('s', data.state);
    if (data.musicUrl) params.set('m', data.musicUrl);
    return `${origin}/?${params.toString()}`;
  };

  const handleCopyWebLink = () => {
    const url = getCoupleWebPageUrl();
    navigator.clipboard.writeText(url);
    setCopiedWebLink(true);
    setTimeout(() => setCopiedWebLink(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const url = getCoupleWebPageUrl();
    const message = `Meu amor, preparei uma surpresa oficial no Cartório do Amor para celebrar a nossa história! Veja a nossa página com nossa música e votos: ${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const tabs: { id: EditorTabId; label: string; icon: React.ReactNode }[] = [
    { id: 'couple', label: '1. Casal', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'photo', label: '2. Foto', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'vows', label: '3. Votos', icon: <PenTool className="w-3.5 h-3.5" /> },
    { id: 'webpage', label: '4. Página Web', icon: <Globe2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> },
    { id: 'fonts', label: '5. Fontes', icon: <Type className="w-3.5 h-3.5" /> },
    { id: 'style', label: '6. Estilo', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'plan', label: '7. Meu Plano', icon: <Crown className="w-3.5 h-3.5 text-amber-500" /> },
  ];

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-border-romantic dark:border-stone-800 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Navigation Tabs */}
      <div className="flex border-b border-border-romantic/70 dark:border-stone-800 bg-parchment-base/60 dark:bg-stone-950/40 p-1.5 gap-1.5 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`flex-shrink-0 sm:flex-1 min-w-[70px] sm:min-w-[80px] py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-wine-rich text-white shadow-sm ring-1 ring-wine-rich'
                : 'text-ink-muted hover:text-wine-rich hover:bg-blush-surface'
            }`}
          >
            {tab.icon}
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
        
        {/* ================= TAB 1: DADOS DO CASAL ================= */}
        {activeTab === 'couple' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-[#72092c] dark:text-rose-400" />
                Qualificação dos Cônjuges
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Estes nomes serão inscritos em destaque no livro oficial do amor.
              </p>
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="partner1-input"
                  className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5"
                >
                  Nome do Cônjuge 1 *
                </label>
                <input
                  id="partner1-input"
                  type="text"
                  value={data.partner1}
                  onChange={(e) => {
                    onChange('partner1', e.target.value);
                    if (!data.signature1 || data.signature1 === data.partner1) {
                      onChange('signature1', e.target.value);
                    }
                  }}
                  placeholder="Ex: Vinicius dos Santos"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 text-base sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#72092c] focus:border-transparent transition-all shadow-sm"
                />
              </div>

              <div>
                <label 
                  htmlFor="partner2-input"
                  className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5"
                >
                  Nome do Cônjuge 2 *
                </label>
                <input
                  id="partner2-input"
                  type="text"
                  value={data.partner2}
                  onChange={(e) => {
                    onChange('partner2', e.target.value);
                    if (!data.signature2 || data.signature2 === data.partner2) {
                      onChange('signature2', e.target.value);
                    }
                  }}
                  placeholder="Ex: Beatriz Ferreira"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 text-base sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#72092c] focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Date of relationship */}
            <div>
              <label 
                htmlFor="startDate-input"
                className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
                Data de Início do Relacionamento *
              </label>
              <input
                id="startDate-input"
                type="date"
                value={data.startDate}
                onChange={(e) => onChange('startDate', e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#72092c] focus:border-transparent transition-all shadow-sm"
              />

              {/* Badge Dinâmico em Pílula (Design System Stitch) */}
              <div className="mt-2.5 w-full bg-blush-tint dark:bg-stone-800/90 rounded-full py-2 px-4 flex items-center justify-center gap-2 ring-1 ring-border-romantic dark:ring-stone-700 text-center shadow-xs transition-all transform hover:scale-[1.01]">
                <Heart className="w-3.5 h-3.5 fill-wine-rich text-wine-rich animate-pulse shrink-0" />
                <span className="font-serif text-xs sm:text-sm font-bold text-wine-rich dark:text-rose-300">
                  {timeInfo.formattedText}
                </span>
                <span className="text-[10px] text-wine-crimson uppercase tracking-wider font-bold hidden sm:inline-block">
                  de amor puro
                </span>
              </div>
            </div>

            {/* City & State */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label 
                  htmlFor="city-input"
                  className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
                  Cidade *
                </label>
                <input
                  id="city-input"
                  type="text"
                  value={data.city}
                  onChange={(e) => onChange('city', e.target.value)}
                  placeholder="Ex: Curitiba"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#72092c] focus:border-transparent transition-all shadow-sm"
                />
              </div>

              <div>
                <label 
                  htmlFor="state-select"
                  className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5"
                >
                  UF
                </label>
                <select
                  id="state-select"
                  value={data.state}
                  onChange={(e) => onChange('state', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#72092c] focus:border-transparent transition-all shadow-sm"
                >
                  {BRAZILIAN_STATES.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Registry Info (Book, Page, Term) */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Dados Cartoriais Simbólicos (Personalizáveis)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Livro</span>
                  <input
                    type="text"
                    value={data.bookNumber}
                    onChange={(e) => onChange('bookNumber', e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Folha</span>
                  <input
                    type="text"
                    value={data.pageNumber}
                    onChange={(e) => onChange('pageNumber', e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Termo / Registro</span>
                  <input
                    type="text"
                    value={data.registryNumber}
                    onChange={(e) => onChange('registryNumber', e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: FOTO DO CASAL ================= */}
        {activeTab === 'photo' && (
          <div className="animate-in fade-in duration-200">
            <PhotoUpload
              photoUrl={data.photoUrl}
              photoFrame={data.photoFrame}
              photoZoom={data.photoZoom}
              showPhoto={data.showPhoto}
              onPhotoChange={(url) => onChange('photoUrl', url)}
              onFrameChange={(frame: PhotoFrame) => onChange('photoFrame', frame)}
              onZoomChange={(zoom) => onChange('photoZoom', zoom)}
              onToggleShowPhoto={(show) => onChange('showPhoto', show)}
            />

            {/* Galeria de Fotos da Página Web VIP */}
            <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Images className="w-4 h-4 text-amber-500" />
                    <span>Galeria de Fotos da Página VIP</span>
                    <span className="text-[9px] bg-amber-400 text-stone-900 font-black px-1.5 py-0.2 rounded uppercase">
                      VIP
                    </span>
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Adicione fotos do casal para o álbum da página interativa aberta pelo QR Code.
                  </p>
                </div>

                {!isVipUser ? (
                  <button
                    type="button"
                    onClick={() => onPromptUpgrade?.({
                      title: 'Galeria de Fotos da Página VIP',
                      description: 'Crie um lindo álbum de recordações do casal na página interativa do QR Code. Exclusivo do Combo VIP (R$ 19,90) ou Pack Eterno.',
                      requiredPlanId: 'vip',
                      featureName: 'Galeria de Fotos da Página VIP'
                    })}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 shadow-sm active:scale-95"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Desbloquear VIP</span>
                  </button>
                ) : (
                  <label className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Adicionar Fotos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (!e.target.files || e.target.files.length === 0) return;
                        Array.from(e.target.files).forEach((file) => {
                          if (!file.type.startsWith('image/')) return;
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              const base64 = event.target.result as string;
                              const current = data.galleryPhotos || [];
                              onChange('galleryPhotos', [...current, base64]);
                            }
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2.5 pt-1">
                {(data.galleryPhotos && data.galleryPhotos.length > 0 ? data.galleryPhotos : [
                  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=400&q=80',
                ]).map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 group">
                    <img src={url} alt={`Foto galeria ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const current = data.galleryPhotos || [];
                        onChange('galleryPhotos', current.filter((_, i) => i !== idx));
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-80 group-hover:opacity-100 transition-opacity"
                      title="Remover foto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CLÁUSULAS & VOTOS ================= */}
        {activeTab === 'vows' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-rose-50/70 via-white to-amber-50/50 dark:from-stone-800/80 dark:via-stone-900 dark:to-stone-800/80 rounded-2xl border border-rose-100 dark:border-stone-700/80 shadow-sm">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <PenTool className="w-4 h-4 text-[#72092c] dark:text-rose-400" />
                  Cláusulas Contratuais & Votos
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Escreva os votos do casal ou gere cláusulas personalizadas com Inteligência Artificial.
                </p>
              </div>

              {/* Único Gerador de Cláusulas com IA */}
              <button
                type="button"
                onClick={() => {
                  if (canUseAiVows === false) {
                    onPromptUpgrade?.({
                      title: 'Gerador de Votos com IA Ilimitado',
                      description: 'O seu plano atual (Certidão Digital R$ 9,90) dá direito a downloads e edições ilimitadas da certidão. O Gerador de Votos com IA Ilimitado faz parte do Combo VIP (R$ 19,90/mês). Faça upgrade por apenas R$ 10 a mais!',
                      requiredPlanId: 'vip',
                      featureName: 'Votos com IA'
                    });
                    return;
                  }
                  onOpenAiModal();
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#72092c] to-[#9e1b45] hover:opacity-95 transition-all shadow-md shadow-rose-900/20 active:scale-95 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                <span>Gerar Cláusulas com IA</span>
                {canUseAiVows === false && (
                  <span className="text-[9px] bg-amber-400 text-stone-900 font-black px-1.5 py-0.5 rounded uppercase">
                    VIP
                  </span>
                )}
              </button>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                id="vows-textarea"
                rows={7}
                value={data.vows}
                onChange={(e) => onChange('vows', e.target.value)}
                placeholder="Insira as cláusulas do relacionamento, declarações de amor e promessas mútuas..."
                className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 text-sm font-serif leading-relaxed text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#72092c] focus:border-transparent transition-all shadow-sm"
              />
              
              {/* Character Counter & Clear Action */}
              <div className="flex items-center justify-between mt-1 px-1">
                <span className="text-[11px] text-stone-400 font-mono">
                  {data.vows.length} caracteres
                </span>

                <button
                  type="button"
                  onClick={handleClearVows}
                  className={`text-xs font-medium transition-colors flex items-center gap-1 ${
                    confirmClearVows ? 'text-red-600 font-bold' : 'text-stone-500 hover:text-red-600'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {confirmClearVows ? 'Confirmar limpeza?' : 'Limpar texto'}
                </button>
              </div>
            </div>

            {/* Signatures customization */}
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-2">
                Texto das Assinaturas Manuscritas
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-stone-500">Assinatura do Cônjuge 1</span>
                  <input
                    type="text"
                    value={data.signature1}
                    onChange={(e) => onChange('signature1', e.target.value)}
                    placeholder={data.partner1 || "Vinicius dos Santos"}
                    className="w-full mt-1 px-3 py-2 text-base sm:text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-stone-500">Assinatura do Cônjuge 2</span>
                  <input
                    type="text"
                    value={data.signature2}
                    onChange={(e) => onChange('signature2', e.target.value)}
                    placeholder={data.partner2 || "Beatriz Ferreira"}
                    className="w-full mt-1 px-3 py-2 text-base sm:text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: PÁGINA WEB DO CASAL (VIP) ================= */}
        {activeTab === 'webpage' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Hero Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#72092c] via-rose-900 to-amber-900 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-stone-950">
                    <Crown className="w-3 h-3 fill-stone-950" />
                    Recurso VIP Exclusivo
                  </span>
                  <span className="text-[11px] text-rose-200 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Página Ativa na Web
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold font-serif text-white">
                  Página Web Interativa do Casal
                </h3>
                <p className="text-xs text-rose-100/90 leading-relaxed">
                  Uma página exclusiva na internet feita para emocionar seu amor: toca a trilha sonora de vocês, conta os segundos juntos em tempo real, guarda uma carta 3D com selo de cera e exibe a certidão oficial em PDF.
                </p>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenCouplePage?.();
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir Página Web do Casal</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyWebLink}
                    className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    title="Copiar link para enviar ao seu amor"
                  >
                    {copiedWebLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Link Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    title="Enviar declaração com link no WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Mandar no WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Trilha Sonora do Casal (Spotify ou YouTube) */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-rose-500" />
                  <span>Trilha Sonora da Página (Spotify ou YouTube)</span>
                </label>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-transparent dark:border-amber-800/50 px-2 py-0.5 rounded-full">
                  24 Horas no Ar
                </span>
              </div>

              <input
                type="url"
                value={data.musicUrl || ''}
                onChange={(e) => onChange('musicUrl', e.target.value)}
                placeholder="Ex: https://open.spotify.com/track/... ou https://youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-base sm:text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                🎵 Cole o link da música que marca a história de vocês. Se deixar em branco, o Cartório tocará nossa melodia orquestrada clássica em piano e violoncelo.
              </p>
            </div>

            {/* Mensagem da Carta Secreta (Envelope com Selo de Cera 3D) */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Carta Secreta & Cláusulas do Amor</span>
                </label>
                <span className="text-[10px] text-stone-400 dark:text-stone-400">
                  Aparece no envelope animado
                </span>
              </div>

              <textarea
                rows={3}
                value={data.secretMessage || ''}
                onChange={(e) => onChange('secretMessage', e.target.value)}
                placeholder="Escreva uma mensagem especial que ficará guardada no envelope lacrado na página..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-base sm:text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none leading-relaxed"
              />

              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                💌 Na página web, o seu amor clica no selo de cera 3D para abrir a carta com as declarações de vocês.
              </p>
            </div>

            {/* Galeria de Fotos VIP */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                  <Images className="w-4 h-4 text-rose-500" />
                  <span>Galeria de Momentos Especiais</span>
                </label>
                <span className="text-[10px] text-stone-400 dark:text-stone-400">
                  {(data.galleryPhotos || []).length} de 6 fotos
                </span>
              </div>

              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Adicione fotos marcantes da viagem, do primeiro encontro ou momentos inesquecíveis para o mural interativo da página web.
              </p>

              {/* Photos Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(data.galleryPhotos || []).map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-stone-300 dark:border-stone-700 group">
                    <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (data.galleryPhotos || []).filter((_, i) => i !== index);
                        onChange('galleryPhotos', updated);
                      }}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remover foto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {(data.galleryPhotos || []).length < 6 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-rose-400 dark:hover:border-rose-400 bg-stone-100/50 dark:bg-stone-950/60 flex flex-col items-center justify-center cursor-pointer transition-colors text-stone-400 dark:text-stone-400 hover:text-rose-500 dark:hover:text-rose-400">
                    <Upload className="w-4 h-4 mb-1" />
                    <span className="text-[9px] font-bold">+ Adicionar</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            if (result) {
                              const current = data.galleryPhotos || [];
                              onChange('galleryPhotos', [...current, result]);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: CAIXA DE FONTES & TIPOGRAFIA ================= */}
        {activeTab === 'fonts' && (
          <div className="animate-in fade-in duration-200">
            <FontBoxSelector
              titleFont={data.titleFont}
              bodyFont={data.bodyFont}
              signatureFont={data.signatureFont}
              onTitleFontChange={(font) => onChange('titleFont', font)}
              onBodyFontChange={(font) => onChange('bodyFont', font)}
              onSignatureFontChange={(font) => onChange('signatureFont', font)}
              onApplyPreset={handleApplyFontPreset}
            />
          </div>
        )}

        {/* ================= TAB 5: ESTILO & DOCUMENTO ================= */}
        {activeTab === 'style' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ThemeSelector
              currentTheme={data.theme}
              currentSeal={data.sealColor}
              relationshipType={data.relationshipType}
              onThemeChange={(theme: CertificateTheme) => onChange('theme', theme)}
              onSealChange={(seal: SealColor) => onChange('sealColor', seal)}
              onRelationshipTypeChange={(type: RelationshipType) => onChange('relationshipType', type)}
            />

            {/* QR Code Section */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                  QR Code Interativo de Autenticidade
                </label>
                <div className="flex items-center gap-2">
                  {!isVipUser && (
                    <span className="text-[9px] bg-amber-400 text-stone-950 font-black px-1.5 py-0.2 rounded uppercase flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Exclusivo VIP</span>
                    </span>
                  )}
                  <input
                    type="checkbox"
                    checked={data.showQrCode}
                    onChange={(e) => {
                      if (!isVipUser) {
                        onPromptUpgrade?.({
                          title: 'QR Code Exclusivo do Combo VIP',
                          description: 'O QR Code interativo que conecta a certidão à página web do casal com música e votos é exclusivo a partir do Combo VIP (R$ 19,90) ou Pack Eterno.',
                          requiredPlanId: 'vip',
                          featureName: 'QR Code Interativo de Autenticidade (VIP)'
                        });
                        return;
                      }
                      onChange('showQrCode', e.target.checked);
                    }}
                    className="w-4 h-4 rounded text-[#72092c] focus:ring-rose-500 accent-[#72092c] cursor-pointer"
                  />
                </div>
              </div>

              {/* Botão de destaque para o Gerador e Impressão Individual do Cartão QR Code */}
              <button
                type="button"
                onClick={() => {
                  if (!isVipUser) {
                    onPromptUpgrade?.({
                      title: 'Cartão QR Code Exclusivo do Combo VIP',
                      description: 'Gere e imprima cartões individuais de QR Code para presentear ou colocar na carteira. Disponível no Combo VIP (R$ 19,90) ou Pack Eterno.',
                      requiredPlanId: 'vip',
                      featureName: 'Cartão QR Code Individual (VIP)'
                    });
                    return;
                  }
                  onOpenQrModal();
                }}
                className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 shadow-sm transition-all group ${
                  isVipUser
                    ? 'border-amber-300/60 dark:border-amber-500/30 bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 hover:from-amber-100 hover:to-rose-100 dark:hover:from-stone-850 dark:hover:to-stone-800 text-stone-800 dark:text-amber-200 text-xs font-bold'
                    : 'border-amber-400/80 dark:border-amber-500/40 bg-gradient-to-r from-amber-50 via-rose-50/40 to-amber-50 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 hover:from-amber-100 hover:to-rose-100 dark:hover:from-stone-850 dark:hover:to-stone-800 text-stone-900 dark:text-amber-300 text-xs font-bold hover:scale-[1.01]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Gerador & Imprimir Cartão QR Code Individual</span>
                {!isVipUser ? (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded uppercase ml-auto flex items-center gap-1 bg-amber-400 text-stone-950 ring-1 ring-amber-500/50 shadow-xs">
                    <Lock className="w-2.5 h-2.5" />
                    <span>VIP</span>
                  </span>
                ) : (
                  <Printer className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 ml-auto" />
                )}
              </button>

              {/* Botão de destaque para Abrir Página Interativa do Casal no Celular (Música + Contador) */}
              <button
                type="button"
                onClick={() => {
                  onOpenCouplePage?.();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-300/80 dark:border-rose-900/60 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 hover:opacity-95 text-stone-900 dark:text-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm group cursor-pointer"
              >
                <Music className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
                <span>Espiar Página Web do Casal (Música + Contador em Tempo Real)</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded uppercase ml-auto bg-amber-400 text-stone-950 shadow-xs">
                  PACK ETERNO
                </span>
              </button>

              {data.showQrCode && (
                <div className="space-y-3.5 bg-stone-50/80 dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800">
                  {/* Link da Música do Casal (Spotify ou YouTube) */}
                  <div className={`relative ${!isVipUser ? 'opacity-90' : ''}`}>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-200 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-rose-500" />
                        Música do Casal (Link do Spotify ou YouTube)
                      </span>
                      {!isVipUser && (
                        <span className="text-[9px] bg-amber-400 text-stone-950 font-black px-1.5 py-0.2 rounded uppercase flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Exclusivo VIP</span>
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={data.musicUrl || ''}
                        disabled={!isVipUser}
                        onClick={() => {
                          if (!isVipUser) {
                            onPromptUpgrade?.({
                              title: 'Trilha Sonora Exclusiva do Combo VIP',
                              description: 'Personalize o QR Code da certidão com sua música preferida do YouTube ou Spotify tocando 24/7 na página interativa do casal. Disponível no Combo VIP (R$ 19,90) ou Pack Eterno.',
                              requiredPlanId: 'vip',
                              featureName: 'Música 24/7 do YouTube/Spotify (VIP)'
                            });
                          }
                        }}
                        onChange={(e) => {
                          if (isVipUser) onChange('musicUrl', e.target.value);
                        }}
                        placeholder={isVipUser ? "https://open.spotify.com/track/... ou link do YouTube" : "Disponível a partir do Combo VIP (R$ 19,90)"}
                        className={`w-full px-3 py-2 text-base sm:text-xs rounded-xl border text-stone-900 dark:text-stone-100 ${
                          !isVipUser 
                            ? 'border-amber-300/80 dark:border-amber-600/40 bg-amber-50/50 dark:bg-stone-950/80 cursor-pointer placeholder:text-amber-800/80 dark:placeholder:text-stone-400'
                            : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 focus:ring-2 focus:ring-[#72092c]'
                        }`}
                      />
                      {!isVipUser && (
                        <button
                          type="button"
                          onClick={() => onPromptUpgrade?.({
                            title: 'Trilha Sonora Exclusiva do Combo VIP',
                            description: 'Personalize o QR Code da certidão com sua música preferida do YouTube ou Spotify tocando 24/7 na página interativa do casal. Disponível no Combo VIP (R$ 19,90) ou Pack Eterno.',
                            requiredPlanId: 'vip',
                            featureName: 'Música 24/7 do YouTube/Spotify (VIP)'
                          })}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Desbloquear</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                      {isVipUser 
                        ? 'Essa música toca automaticamente 24/7 na página interativa do casal aberta pelo QR Code.' 
                        : 'Recurso exclusivo do Combo VIP: sua música toca automaticamente ao escanear o QR Code.'}
                    </p>
                  </div>

                  {/* Link ou Mensagem Secreta */}
                  <div className={`relative ${!isVipUser ? 'opacity-90' : ''}`}>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-200 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <QrCode className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                        Link ou Mensagem Secreta do QR Code
                      </span>
                      {!isVipUser && (
                        <span className="text-[9px] bg-amber-400 text-stone-950 font-black px-1.5 py-0.2 rounded uppercase flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Exclusivo VIP</span>
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={data.secretMessage || ''}
                        disabled={!isVipUser}
                        onClick={() => {
                          if (!isVipUser) {
                            onPromptUpgrade?.({
                              title: 'Mensagem Secreta do QR Code Exclusiva VIP',
                              description: 'Personalize o destino do QR Code com uma declaração secreta ou link exclusivo que abre direto no celular. Disponível no Combo VIP (R$ 19,90) ou Pack Eterno.',
                              requiredPlanId: 'vip',
                              featureName: 'Mensagem Secreta do QR Code (VIP)'
                            });
                          }
                        }}
                        onChange={(e) => {
                          if (isVipUser) onChange('secretMessage', e.target.value);
                        }}
                        placeholder={isVipUser ? "https://spotify.com/... ou nossa declaração de amor" : "Disponível a partir do Combo VIP (R$ 19,90)"}
                        className={`w-full px-3 py-2 text-base sm:text-xs rounded-xl border text-stone-900 dark:text-stone-100 ${
                          !isVipUser 
                            ? 'border-amber-300/80 dark:border-amber-600/40 bg-amber-50/50 dark:bg-stone-950/80 cursor-pointer placeholder:text-amber-800/80 dark:placeholder:text-stone-400'
                            : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 focus:ring-2 focus:ring-[#72092c]'
                        }`}
                      />
                      {!isVipUser && (
                        <button
                          type="button"
                          onClick={() => onPromptUpgrade?.({
                            title: 'Mensagem Secreta do QR Code Exclusiva VIP',
                            description: 'Personalize o destino do QR Code com uma declaração secreta ou link exclusivo que abre direto no celular. Disponível no Combo VIP (R$ 19,90) ou Pack Eterno.',
                            requiredPlanId: 'vip',
                            featureName: 'Mensagem Secreta do QR Code (VIP)'
                          })}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Desbloquear</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                      {isVipUser 
                        ? 'Ao apontar a câmera no QR Code, esse link ou declaração será aberto.' 
                        : 'Recurso exclusivo do Combo VIP: sua mensagem ou link secreto abre ao escanear o QR Code.'}
                    </p>
                  </div>

                  {/* Frase Curta Personalizada Embaixo do QR Code */}
                  <div className={`relative ${!isVipUser ? 'opacity-90' : ''}`}>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-200 mb-1 flex items-center justify-between">
                      <span>Frase Curta Embaixo do QR Code</span>
                      {!isVipUser && (
                        <span className="text-[9px] bg-amber-400 text-stone-950 font-black px-1.5 py-0.2 rounded uppercase flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Exclusivo VIP</span>
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={70}
                        value={data.qrPhrase || ''}
                        disabled={!isVipUser}
                        onClick={() => {
                          if (!isVipUser) {
                            onPromptUpgrade?.({
                              title: 'Frase Personalizada do QR Code Exclusiva VIP',
                              description: 'Personalize a legenda que acompanha o QR Code na certidão física e digital. Disponível no Combo VIP (R$ 19,90) ou Pack Eterno.',
                              requiredPlanId: 'vip',
                              featureName: 'Frase Curta do QR Code (VIP)'
                            });
                          }
                        }}
                        onChange={(e) => {
                          if (isVipUser) onChange('qrPhrase', e.target.value);
                        }}
                        placeholder={isVipUser ? "Ex: Escaneie e ouça nossa música especial..." : "Disponível a partir do Combo VIP (R$ 19,90)"}
                        className={`w-full px-3 py-2 text-base sm:text-xs rounded-xl border text-stone-900 dark:text-stone-100 ${
                          !isVipUser 
                            ? 'border-amber-300/80 dark:border-amber-600/40 bg-amber-50/50 dark:bg-stone-950/80 cursor-pointer placeholder:text-amber-800/80 dark:placeholder:text-stone-400'
                            : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 focus:ring-2 focus:ring-[#72092c]'
                        }`}
                      />
                      {!isVipUser && (
                        <button
                          type="button"
                          onClick={() => onPromptUpgrade?.({
                            title: 'Frase Personalizada do QR Code Exclusiva VIP',
                            description: 'Personalize a legenda que acompanha o QR Code na certidão física e digital. Disponível no Combo VIP (R$ 19,90) ou Pack Eterno.',
                            requiredPlanId: 'vip',
                            featureName: 'Frase Curta do QR Code (VIP)'
                          })}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Desbloquear</span>
                        </button>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                      <span>
                        {isVipUser 
                          ? 'Exibida de forma delicada sob o QR Code na certidão'
                          : 'Recurso exclusivo do Combo VIP: personalize a frase delicada sob o QR Code.'}
                      </span>
                      <span>{(data.qrPhrase || '').length}/70</span>
                    </div>
                  </div>

                  {/* Seleção de Idiomas da Frase */}
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-200 flex items-center gap-1.5 mb-2">
                      <Globe2 className="w-3.5 h-3.5 text-[#72092c] dark:text-rose-400" />
                      Idiomas da Frase Curta (Sugestões Rápidas)
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {QR_LANGUAGES.map((lang) => {
                        const isSelected = data.qrLanguage === lang.id;
                        return (
                          <button
                            key={lang.id}
                            type="button"
                            onClick={() => {
                              if (!isVipUser) {
                                onPromptUpgrade?.({
                                  title: 'Frase Personalizada do QR Code Exclusiva VIP',
                                  description: 'Personalize a legenda que acompanha o QR Code na certidão em múltiplos idiomas. Disponível no Combo VIP (R$ 19,90) ou Pack Eterno.',
                                  requiredPlanId: 'vip',
                                  featureName: 'Frase Curta do QR Code (VIP)'
                                });
                                return;
                              }
                              onChange('qrLanguage', lang.id);
                              onChange('qrPhrase', lang.sample);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 border ${
                              isSelected
                                ? 'bg-[#72092c] text-white border-[#72092c] shadow-sm'
                                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-[#72092c]/50 dark:hover:bg-stone-750 dark:hover:border-stone-600'
                            }`}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 6: MEU PLANO ================= */}
        {activeTab === 'plan' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-amber-500" />
                Meu Plano Atual
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Informações e benefícios do plano que você está utilizando no momento.
              </p>
            </div>

            {activePlan ? (
              /* Plano Pago Ativo */
              <div className="bg-gradient-to-br from-amber-50 via-rose-50/60 to-amber-100/30 dark:from-amber-950/30 dark:via-rose-950/20 dark:to-stone-900 rounded-2xl p-4 sm:p-5 border-2 border-amber-300 dark:border-amber-700/60 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-950/70 dark:text-green-300 border border-green-300 dark:border-green-800">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Plano Ativo
                  </span>
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Renovação Mensal
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      {activePlan.name}
                    </h4>
                    <span className="text-base font-extrabold text-[#72092c] dark:text-rose-400">
                      R$ {activePlan.price.toFixed(2).replace('.', ',')}{activePlan.billingPeriod}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                    {activePlan.description}
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700">
                  <p className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Recursos Inclusos no seu Pacote:
                  </p>
                  <ul className="space-y-1.5">
                    {activePlan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-200 font-medium">
                        <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  {onDownloadPdf && (
                    <button
                      type="button"
                      onClick={onDownloadPdf}
                      className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#72092c] text-white hover:bg-[#580520] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-300" />
                      Baixar Certidão Oficial (PDF)
                    </button>
                  )}
                  {onOpenCheckout && (
                    <button
                      type="button"
                      onClick={onOpenCheckout}
                      className="py-2.5 px-4 rounded-xl font-bold text-xs bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>Trocar de Plano</span>
                    </button>
                  )}
                </div>
              </div>
            ) : trialStatus?.isActive ? (
              /* Plano em Uso: Teste Grátis de 30 Dias */
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50/60 to-emerald-100/30 dark:from-emerald-950/40 dark:via-stone-900 dark:to-emerald-950/20 rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 dark:border-emerald-700/60 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Plano Ativo
                  </span>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                    Restam {trialStatus.daysRemaining} dias
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      Teste Grátis de 30 Dias
                    </h4>
                    <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                      R$ 0,00 (Gratuito)
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                    Você pode editar, salvar e baixar suas certidões gratuitamente até <strong>{trialStatus.endDateFormatted}</strong>.
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-stone-800/80 rounded-xl p-3 border border-emerald-200/60 dark:border-stone-700">
                  <p className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    Recursos Inclusos no seu Pacote:
                  </p>
                  <ul className="space-y-1.5">
                    <li className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-200 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Edição e personalização completa da certidão</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-200 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Prévia interativa em tempo real</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-200 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Acesso gratuito por 30 dias para testar todos os recursos</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  {onDownloadPdf && (
                    <button
                      type="button"
                      onClick={onDownloadPdf}
                      className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-300" />
                      Baixar Certidão (PDF)
                    </button>
                  )}
                  {onOpenCheckout && (
                    <button
                      type="button"
                      onClick={onOpenCheckout}
                      className="py-2.5 px-4 rounded-xl font-bold text-xs bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>Mudar de Plano</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Período de 30 Dias Grátis Expirou */
              <div className="bg-rose-50/90 dark:bg-rose-950/40 rounded-2xl p-4 sm:p-5 border-2 border-rose-400 dark:border-rose-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-200 border border-rose-300 dark:border-rose-700">
                    <Crown className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                    Plano Expirado
                  </span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    {trialStatus ? `Venceu em ${trialStatus.endDateFormatted}` : 'Prazo Esgotado'}
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Teste Grátis de 30 Dias (Encerrado)
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                    Seu período de teste de 30 dias encerrou. Para continuar editando, salvando e baixando certidões em alta resolução, ative sua assinatura oficial.
                  </p>
                </div>
                {onOpenCheckout && (
                  <button
                    type="button"
                    onClick={onOpenCheckout}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#72092c] hover:bg-[#580520] text-white transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Escolher um Plano para Ativar</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Editor LGPD & Privacy Footer */}
      <div className="px-4 py-3 bg-blush-surface/70 dark:bg-stone-950/60 border-t border-border-romantic/80 dark:border-stone-800 flex items-center justify-between text-[11px] text-ink-muted dark:text-stone-400">
        <span className="flex items-center gap-1.5 truncate">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">Processamento seguro e criptografado (LGPD)</span>
        </span>
        <button
          type="button"
          onClick={onOpenPrivacyModal}
          className="text-wine-crimson dark:text-rose-400 font-bold hover:underline shrink-0 ml-2 cursor-pointer"
        >
          Políticas & Termos
        </button>
      </div>
    </div>
  );
};
