export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export type SeasonName = 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial' | 'Custom';

export function monthIndexInRange(month: number, start: number, end: number) {
  if (start <= end) return month >= start && month <= end;
  return month >= start || month <= end;
}

export function rangeLength(start: number, end: number) {
  if (start <= end) return end - start + 1;
  return 12 - start + end + 1;
}

export function inferSeason(sowingMonth: number, harvestMonth: number): SeasonName {
  const span = rangeLength(sowingMonth, harvestMonth);
  if (span >= 10) return 'Perennial';

  // Typical Indian sowing windows; used only as a hint, not a hard season lock.
  if (sowingMonth >= 5 && sowingMonth <= 7) return 'Kharif';
  if (sowingMonth >= 9 || sowingMonth <= 0) return 'Rabi';
  if (sowingMonth >= 1 && sowingMonth <= 4) return 'Zaid';
  return 'Custom';
}

export function seasonHint(sowingMonth: number, harvestMonth: number) {
  const season = inferSeason(sowingMonth, harvestMonth);
  const from = MONTHS[sowingMonth];
  const to = MONTHS[harvestMonth];
  if (season === 'Perennial') return `${from} – ${to} looks like a perennial or year-round window.`;
  if (season === 'Custom') return `${from} – ${to} is an off-calendar window.`;
  return `This window typically aligns with ${season} in most of India.`;
}
