import { normalizeFarmSize, type AreaUnit, type FarmSizePayload } from '@/lib/area';

export type LocationPayload = {
  state: string;
  district: string;
  subDistrict: string;
  village: string;
  postalCode: string;
  coordinates: { lat: number; lon: number } | null;
};

export type SowingPeriodPayload = {
  sowingMonth: number;
  harvestMonth: number;
};

export type RecommendationRequest = {
  location: LocationPayload;
  sowingPeriod: SowingPeriodPayload;
  farmSize: FarmSizePayload & { acres: number };
};

export function buildRecommendationRequest(input: {
  location: LocationPayload;
  sowingPeriod: SowingPeriodPayload;
  farmSize: { value: number; unit: AreaUnit };
}): RecommendationRequest {
  return {
    location: input.location,
    sowingPeriod: input.sowingPeriod,
    farmSize: normalizeFarmSize(input.farmSize, input.location.state),
  };
}
