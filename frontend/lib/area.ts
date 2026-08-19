export const AREA_UNITS = [
  { value: 'bigha', label: 'Bigha', group: 'local' },
  { value: 'gaj', label: 'Gaj', group: 'local' },
  { value: 'guntha', label: 'Guntha', group: 'local' },
  { value: 'biswa', label: 'Biswa', group: 'local' },
  { value: 'kanal', label: 'Kanal', group: 'local' },
  { value: 'acre', label: 'Acres', group: 'standard' },
  { value: 'hectare', label: 'Hectares', group: 'standard' },
  { value: 'sqft', label: 'Square Feet', group: 'standard' },
  { value: 'sqm', label: 'Square Meters', group: 'standard' },
] as const;

export type AreaUnit = (typeof AREA_UNITS)[number]['value'];

export type FarmSizePayload = {
  value: number;
  unit: AreaUnit;
};

const SQFT_PER_ACRE = 43560;
const SQM_PER_ACRE = 4046.8564224;

function normState(state?: string) {
  return (state ?? '').toLowerCase();
}

/** Regional bigha → acres. Bigha is not a single national measure. */
export function bighaToAcres(state?: string): number {
  const s = normState(state);
  if (/(punjab|haryana|himachal|uttarakhand|jammu|kashmir)/.test(s)) return 0.2;
  if (/(west bengal|assam|tripura|odisha)/.test(s)) return 1 / 3;
  if (/rajasthan/.test(s)) return 0.618;
  if (/gujarat/.test(s)) return 0.4;
  if (/maharashtra/.test(s)) return 0.62;
  if (/madhya pradesh/.test(s)) return 0.5;
  // Pucca bigha used across much of the Gangetic plain
  return 0.625;
}

export function toAcres(value: number, unit: AreaUnit, state?: string): number {
  if (!Number.isFinite(value) || value < 0) return 0;

  switch (unit) {
    case 'acre':
      return value;
    case 'hectare':
      return value * (10000 / SQM_PER_ACRE);
    case 'sqft':
      return value / SQFT_PER_ACRE;
    case 'sqm':
      return value / SQM_PER_ACRE;
    case 'gaj':
      return (value * 9) / SQFT_PER_ACRE;
    case 'guntha':
      return value * 0.025;
    case 'kanal':
      return value * 0.125;
    case 'bigha':
      return value * bighaToAcres(state);
    case 'biswa':
      return value * (bighaToAcres(state) / 20);
    default:
      return value;
  }
}

export function formatAcres(acres: number): string {
  if (acres >= 10) return acres.toFixed(2);
  if (acres >= 1) return acres.toFixed(2);
  if (acres >= 0.01) return acres.toFixed(3);
  return acres.toFixed(4);
}

export function parseAreaInput(raw: string): number | null {
  const cleaned = raw.replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function normalizeFarmSize(payload: FarmSizePayload, state?: string) {
  return {
    value: payload.value,
    unit: payload.unit,
    acres: toAcres(payload.value, payload.unit, state),
  };
}
