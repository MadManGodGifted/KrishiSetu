import { farmer, farms } from '@/constants/dummy';
import type { Topology } from '@/constants/crops';
import { loadJson, saveJson } from '@/lib/cache';

const PROFILE_KEY = 'ks.farm.profile.v1';

export type FarmProfile = {
  location: string;
  farmSize: number;
  soilType: string;
  topology: Topology;
  irrigation: string;
};

export function inferTopology(location: string): Topology {
  const loc = location.toLowerCase();
  if (loc.includes('igatpuri') || loc.includes('hill')) return 'hills';
  if (loc.includes('coast') || loc.includes('konkan')) return 'coastal';
  if (loc.includes('valley') || loc.includes('niphad')) return 'valley';
  if (loc.includes('nashik') || loc.includes('sinnar') || loc.includes('deccan')) return 'plateau';
  return 'plateau';
}

export function getFarmProfile(): FarmProfile {
  const plot = farms[0];
  const next: FarmProfile = {
    location: farmer.location,
    farmSize: farmer.farmSize,
    soilType: farmer.soilType,
    topology: inferTopology(farmer.location),
    irrigation: plot?.irrigation ?? 'Borewell',
  };
  const cached = loadJson<FarmProfile>(PROFILE_KEY);
  if (
    cached &&
    cached.location === next.location &&
    cached.farmSize === next.farmSize &&
    cached.soilType === next.soilType &&
    cached.topology === next.topology &&
    cached.irrigation === next.irrigation
  ) {
    return cached;
  }
  saveJson(PROFILE_KEY, next);
  return next;
}

export function farmFingerprint(profile: FarmProfile, season: string): string {
  return [profile.location, profile.farmSize, profile.soilType, profile.topology, profile.irrigation, season].join('|');
}
