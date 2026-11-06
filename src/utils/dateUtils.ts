import type { TimeCalculation } from '../types/certificate';

const MONTH_NAMES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

const NUMBERS_PT: { [key: number]: string } = {
  1: 'um', 2: 'dois', 3: 'três', 4: 'quatro', 5: 'cinco', 6: 'seis', 7: 'sete', 8: 'oito', 9: 'nove', 10: 'dez',
  11: 'onze', 12: 'doze', 13: 'treze', 14: 'quatorze', 15: 'quinze', 16: 'dezesseis', 17: 'dezessete', 18: 'dezoito', 19: 'dezenove', 20: 'vinte',
  21: 'vinte e um', 22: 'vinte e dois', 23: 'vinte e três', 24: 'vinte e quatro', 25: 'vinte e cinco', 26: 'vinte e seis', 27: 'vinte e sete', 28: 'vinte e oito', 29: 'vinte e nove', 30: 'trinta', 31: 'trinta e um'
};

export function calculateRelationshipTime(startDateStr: string): TimeCalculation {
  if (!startDateStr) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      totalHours: 0,
      formattedText: 'Data não informada',
      compactBadge: 'Amor eterno',
      milestoneTitle: 'O Início de Tudo'
    };
  }

  const start = new Date(startDateStr + 'T00:00:00');
  const now = new Date();

  // If start is invalid
  if (isNaN(start.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      totalHours: 0,
      formattedText: 'Data em preenchimento...',
      compactBadge: 'Amor eterno',
      milestoneTitle: 'O Início de Tudo'
    };
  }

  // If start is in the future
  if (start.getTime() > now.getTime()) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      totalHours: 0,
      formattedText: 'Início agendado para o futuro',
      compactBadge: 'Em breve',
      milestoneTitle: 'Contagem Regressiva'
    };
  }

  // Precise year, month, day difference
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    // Days in previous month
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Total milliseconds and days
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffTime / (1000 * 60 * 60));

  // Build human-friendly formatted text
  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
  }
  if (days > 0 || parts.length === 0) {
    parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);
  }

  let formattedText = '';
  if (parts.length === 1) {
    formattedText = parts[0];
  } else if (parts.length === 2) {
    formattedText = `${parts[0]} e ${parts[1]}`;
  } else {
    formattedText = `${parts[0]}, ${parts[1]} e ${parts[2]}`;
  }

  // Milestone designation
  let milestoneTitle = 'Fase da Paixão';
  if (years === 0 && months === 0) milestoneTitle = 'Primeiros Passos de Amor';
  else if (years === 0 && months <= 3) milestoneTitle = 'Bodas de Algodão Doce (Meses)';
  else if (years === 0 && months <= 6) milestoneTitle = 'Bodas de Plumas (6 meses)';
  else if (years === 1) milestoneTitle = 'Bodas de Papel (1 Ano)';
  else if (years === 2) milestoneTitle = 'Bodas de Algodão (2 Anos)';
  else if (years === 3) milestoneTitle = 'Bodas de Trigo / Couro (3 Anos)';
  else if (years === 4) milestoneTitle = 'Bodas de Flores & Frutas (4 Anos)';
  else if (years === 5) milestoneTitle = 'Bodas de Madeira (5 Anos)';
  else if (years >= 10 && years < 15) milestoneTitle = 'Bodas de Estanho (10+ Anos)';
  else if (years >= 15 && years < 25) milestoneTitle = 'Bodas de Cristal (15+ Anos)';
  else if (years >= 25) milestoneTitle = 'Bodas de Prata (25+ Anos)';

  const compactBadge = `${totalDays.toLocaleString('pt-BR')} dias de cumplicidade`;

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    formattedText,
    compactBadge,
    milestoneTitle
  };
}

export function formatFullDatePortuguese(dateInput?: Date | string): string {
  const d = dateInput 
    ? (typeof dateInput === 'string' ? new Date(dateInput + 'T00:00:00') : dateInput)
    : new Date();

  const day = d.getDate();
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();

  const dayWord = day === 1 ? 'primeiro' : (NUMBERS_PT[day] || `${day}`);

  // Basic Portuguese year to words
  let yearWord = `${year}`;
  if (year === 2023) yearWord = 'dois mil e vinte e três';
  else if (year === 2024) yearWord = 'dois mil e vinte e quatro';
  else if (year === 2025) yearWord = 'dois mil e vinte e cinco';
  else if (year === 2026) yearWord = 'dois mil e vinte e seis';
  else if (year === 2027) yearWord = 'dois mil e vinte e sete';
  else if (year === 2028) yearWord = 'dois mil e vinte e oito';

  const prefix = day === 1 ? 'Ao' : 'Aos';
  return `${prefix} ${dayWord} dias do mês de ${month} do ano de ${yearWord}`;
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  if (!y || !m || !d) return dateStr;
  return `${d}/${m}/${y}`;
}

export interface LiveTimeCalculation {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  milestoneTitle: string;
  compactBadge: string;
  isFuture: boolean;
}

export function calculateLiveRelationshipTime(startDateStr: string, now: Date = new Date()): LiveTimeCalculation {
  if (!startDateStr) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalDays: 0,
      totalHours: 0,
      milestoneTitle: 'O Início de Tudo',
      compactBadge: 'Amor eterno',
      isFuture: false,
    };
  }

  const start = new Date(startDateStr + 'T00:00:00');
  if (isNaN(start.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalDays: 0,
      totalHours: 0,
      milestoneTitle: 'O Início de Tudo',
      compactBadge: 'Amor eterno',
      isFuture: false,
    };
  }

  const isFuture = start.getTime() > now.getTime();
  const diffMs = Math.max(0, now.getTime() - start.getTime());

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;

  const baseMilestones = calculateRelationshipTime(startDateStr);

  if (isFuture) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalDays: 0,
      totalHours: 0,
      milestoneTitle: baseMilestones.milestoneTitle,
      compactBadge: baseMilestones.compactBadge,
      isFuture: true,
    };
  }

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    hours,
    minutes,
    seconds,
    totalDays,
    totalHours,
    milestoneTitle: baseMilestones.milestoneTitle,
    compactBadge: baseMilestones.compactBadge,
    isFuture: false,
  };
}

