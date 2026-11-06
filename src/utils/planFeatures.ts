import type { CheckoutPlan } from '../constants/plansData';
import type { TrialStatus } from './trialManager';

export type LoveDocumentType = 'certidao' | 'contrato' | 'rg';

export interface PlanPermissions {
  canDownloadPdf: boolean;
  canDownloadImage: boolean;
  canUseAiVows: boolean;
  canUseQrMusic: boolean;
  canAccessAllDocuments: boolean;
  canAccessVipSupport: boolean;
  canAccessFullCouplePage: boolean;
  planId: 'none' | 'essencial' | 'vip' | 'completo';
  planName: string;
}

export function getPlanPermissions(
  activePlan: CheckoutPlan | null,
  trialStatus: TrialStatus
): PlanPermissions {
  // If user has active paid plan
  if (activePlan) {
    switch (activePlan.id) {
      case 'completo':
        return {
          canDownloadPdf: true,
          canDownloadImage: true,
          canUseAiVows: true,
          canUseQrMusic: true,
          canAccessAllDocuments: true,
          canAccessVipSupport: true,
          canAccessFullCouplePage: true,
          planId: 'completo',
          planName: 'Pack do Amor Eterno (R$ 29,90)',
        };
      case 'vip':
        return {
          canDownloadPdf: true,
          canDownloadImage: true,
          canUseAiVows: true,
          canUseQrMusic: true,
          canAccessAllDocuments: false, // 3 documents locked to Pack Eterno
          canAccessVipSupport: false,
          canAccessFullCouplePage: false, // Exclusivo do Pack do Amor Eterno (R$ 29,90)
          planId: 'vip',
          planName: 'Combo VIP Interativo (R$ 19,90)',
        };
      case 'essencial':
      default:
        return {
          canDownloadPdf: true,
          canDownloadImage: true,
          canUseAiVows: false, // Locked to VIP
          canUseQrMusic: false, // Locked to VIP
          canAccessAllDocuments: false, // Locked to Pack Eterno
          canAccessVipSupport: false,
          canAccessFullCouplePage: false,
          planId: 'essencial',
          planName: 'Certidão Digital Oficial (R$ 9,90)',
        };
    }
  }

  // If user is within 30-day free trial and has no paid plan
  if (trialStatus.isActive) {
    return {
      canDownloadPdf: true,
      canDownloadImage: true,
      canUseAiVows: false, // Locked to VIP
      canUseQrMusic: false, // Locked strictly to VIP plan (Combo VIP or Pack Eterno)
      canAccessAllDocuments: false, // Additional documents require Pack Eterno
      canAccessVipSupport: false,
      canAccessFullCouplePage: false,
      planId: 'none',
      planName: 'Teste Grátis de 30 Dias',
    };
  }

  // Free trial expired and no paid plan
  return {
    canDownloadPdf: false,
    canDownloadImage: false,
    canUseAiVows: false,
    canUseQrMusic: false,
    canAccessAllDocuments: false,
    canAccessVipSupport: false,
    canAccessFullCouplePage: false,
    planId: 'none',
    planName: 'Nenhum Plano (Expirado)',
  };
}
