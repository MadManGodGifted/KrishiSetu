import { districtsFor, matchDistrict, matchState } from '@/constants/india';

export type GeoCoords = { lat: number; lon: number };

export type ResolvedAddress = {
  state: string;
  district: string;
  subDistrict: string;
  village: string;
  pin: string;
  coords: GeoCoords;
  label: string;
};

type NominatimAddress = {
  state?: string;
  state_district?: string;
  county?: string;
  district?: string;
  municipality?: string;
  city_district?: string;
  suburb?: string;
  village?: string;
  town?: string;
  city?: string;
  hamlet?: string;
  postcode?: string;
  taluk?: string;
  county_code?: string;
};

type NominatimResult = {
  display_name?: string;
  lat: string;
  lon: string;
  address?: NominatimAddress;
};

const NOMINATIM = 'https://nominatim.openstreetmap.org';

async function nominatim<T>(path: string): Promise<T> {
  const res = await fetch(`${NOMINATIM}${path}`, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en-IN,en',
    },
  });
  if (!res.ok) throw new Error('Could not look up that place right now.');
  return res.json() as Promise<T>;
}

export function getDeviceCoords(): Promise<GeoCoords> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Location is not available in this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => {
        if (err.code === 1) reject(new Error('Location permission was denied.'));
        else if (err.code === 3) reject(new Error('Location request timed out.'));
        else reject(new Error('Could not read your current location.'));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30_000 },
    );
  });
}

function pickVillage(address: NominatimAddress) {
  return address.village || address.town || address.city || address.hamlet || address.suburb || '';
}

function pickSubDistrict(address: NominatimAddress, district: string) {
  const candidates = [
    address.municipality,
    address.city_district,
    address.suburb,
    address.county,
    address.state_district,
  ].filter(Boolean) as string[];
  return candidates.find((item) => item.toLowerCase() !== district.toLowerCase()) ?? '';
}

function pickDistrictName(address: NominatimAddress) {
  return address.state_district || address.county || address.district || address.city || address.town || '';
}

export function resolveFromNominatim(result: NominatimResult, coords?: GeoCoords): ResolvedAddress | null {
  const address = result.address ?? {};
  const state = matchState(address.state ?? '');
  if (!state) return null;

  const districtGuess = pickDistrictName(address);
  const district = matchDistrict(state, districtGuess) || matchDistrict(state, pickVillage(address));

  return {
    state,
    district,
    subDistrict: pickSubDistrict(address, district),
    village: pickVillage(address),
    pin: (address.postcode ?? '').replace(/\D/g, '').slice(0, 6),
    coords: coords ?? { lat: Number(result.lat), lon: Number(result.lon) },
    label: result.display_name ?? [pickVillage(address), district, state].filter(Boolean).join(', '),
  };
}

export async function reverseGeocode(coords: GeoCoords): Promise<ResolvedAddress> {
  const result = await nominatim<NominatimResult>(
    `/reverse?format=jsonv2&addressdetails=1&lat=${coords.lat}&lon=${coords.lon}`,
  );
  const resolved = resolveFromNominatim(result, coords);
  if (!resolved) throw new Error('Could not map that pin to an Indian district.');
  return resolved;
}

export async function searchPlaces(query: string): Promise<ResolvedAddress[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const results = await nominatim<NominatimResult[]>(
    `/search?format=jsonv2&addressdetails=1&countrycodes=in&limit=8&q=${encodeURIComponent(q)}`,
  );
  const mapped = results
    .map((item) => resolveFromNominatim(item))
    .filter((item): item is ResolvedAddress => Boolean(item));

  const seen = new Set<string>();
  return mapped.filter((item) => {
    const key = `${item.state}|${item.district}|${item.village}|${item.pin}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function isValidPin(pin: string) {
  return /^[1-9][0-9]{5}$/.test(pin);
}

export function districtsOf(state: string) {
  return districtsFor(state);
}
