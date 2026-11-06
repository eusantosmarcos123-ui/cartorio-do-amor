export interface User {
  id: string;
  name: string;
  email: string;
  partnerName?: string;
  avatarUrl?: string;
  savedCertificatesCount?: number;
}

export type AuthMode = 'login' | 'register' | 'forgot-password';
