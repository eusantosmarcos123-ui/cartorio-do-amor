/**
 * Trial Period Manager for Cartório do Amor
 * Manages 30-day (1 month) free trial access.
 */

export const TRIAL_STORAGE_KEY = 'cartorio_trial_start';
export const TRIAL_DURATION_DAYS = 30;
export const TRIAL_DURATION_MS = TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;

export interface TrialStatus {
  startTime: number;
  endTime: number;
  isActive: boolean;
  isExpired: boolean;
  daysRemaining: number;
  startDateFormatted: string;
  endDateFormatted: string;
}

export function getTrialStatus(): TrialStatus {
  if (typeof window === 'undefined') {
    const now = Date.now();
    return {
      startTime: now,
      endTime: now + TRIAL_DURATION_MS,
      isActive: true,
      isExpired: false,
      daysRemaining: TRIAL_DURATION_DAYS,
      startDateFormatted: new Date(now).toLocaleDateString('pt-BR'),
      endDateFormatted: new Date(now + TRIAL_DURATION_MS).toLocaleDateString('pt-BR'),
    };
  }

  let savedStart = localStorage.getItem(TRIAL_STORAGE_KEY);
  if (!savedStart || isNaN(Number(savedStart))) {
    savedStart = Date.now().toString();
    localStorage.setItem(TRIAL_STORAGE_KEY, savedStart);
  }

  const startTime = parseInt(savedStart, 10);
  const endTime = startTime + TRIAL_DURATION_MS;
  const now = Date.now();

  const isExpired = now >= endTime;
  const isActive = !isExpired;
  const msRemaining = Math.max(0, endTime - now);
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

  return {
    startTime,
    endTime,
    isActive,
    isExpired,
    daysRemaining,
    startDateFormatted: new Date(startTime).toLocaleDateString('pt-BR'),
    endDateFormatted: new Date(endTime).toLocaleDateString('pt-BR'),
  };
}

/**
 * Manually expire the trial period immediately (simulates 30+ days passed)
 */
export function simulateExpireTrial(): TrialStatus {
  const expiredStartTime = Date.now() - (TRIAL_DURATION_MS + 1000 * 60 * 60 * 24);
  localStorage.setItem(TRIAL_STORAGE_KEY, expiredStartTime.toString());
  return getTrialStatus();
}

/**
 * Reset trial period to full 30 days starting now
 */
export function resetTrialTo30Days(): TrialStatus {
  const newStartTime = Date.now();
  localStorage.setItem(TRIAL_STORAGE_KEY, newStartTime.toString());
  return getTrialStatus();
}
