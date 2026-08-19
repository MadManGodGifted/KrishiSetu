import {
  cropCatalog,
  getCropById,
  rankCrops,
  type RankedCrop,
  type Season,
  type Topology,
  type TopologyFit,
} from '@/constants/crops';
import { loadJson, saveJson } from '@/lib/cache';
import { farmFingerprint, getFarmProfile } from '@/lib/farmProfile';
import { ensureMarketPrices, refreshMarketPrices } from '@/lib/marketCache';
import { currentIndianSeason } from '@/lib/season';

const KEY = 'ks.recommend.v1';

type PersistedCrop = { id: string; score: number; topologyFit: TopologyFit };

type Persisted = {
  fingerprint: string;
  season: Season;
  topology: Topology;
  acres: number;
  crops: PersistedCrop[];
  savedAt: number;
};

export type RecommendSnapshot = {
  fingerprint: string;
  season: Season;
  topology: Topology;
  acres: number;
  crops: RankedCrop[];
  savedAt: number;
};

function reconstruct(row: PersistedCrop): RankedCrop | null {
  const crop = cropCatalog.find((item) => item.id === row.id);
  if (!crop) return null;
  return { ...crop, score: row.score, topologyFit: row.topologyFit };
}

function toPersisted(snap: RecommendSnapshot): Persisted {
  return {
    fingerprint: snap.fingerprint,
    season: snap.season,
    topology: snap.topology,
    acres: snap.acres,
    savedAt: snap.savedAt,
    crops: snap.crops.map((crop) => ({
      id: crop.id,
      score: crop.score,
      topologyFit: crop.topologyFit,
    })),
  };
}

function fromPersisted(row: Persisted): RecommendSnapshot | null {
  const crops = row.crops.map(reconstruct).filter((item): item is RankedCrop => Boolean(item));
  if (!crops.length) return null;
  return {
    fingerprint: row.fingerprint,
    season: row.season,
    topology: row.topology,
    acres: row.acres,
    savedAt: row.savedAt,
    crops,
  };
}

function compute(): RecommendSnapshot {
  const profile = getFarmProfile();
  const season = currentIndianSeason();
  const crops = rankCrops({
    season,
    topology: profile.topology,
    location: profile.location,
  });
  const snap: RecommendSnapshot = {
    fingerprint: farmFingerprint(profile, season),
    season,
    topology: profile.topology,
    acres: profile.farmSize,
    crops,
    savedAt: Date.now(),
  };
  saveJson(KEY, toPersisted(snap));
  return snap;
}

function readPersistedIfValid(): RecommendSnapshot | null {
  const profile = getFarmProfile();
  const season = currentIndianSeason();
  const fingerprint = farmFingerprint(profile, season);
  const stored = loadJson<Persisted>(KEY);
  if (!stored || stored.fingerprint !== fingerprint) return null;
  return fromPersisted(stored);
}

let memory: RecommendSnapshot | null = readPersistedIfValid();

export function getRecommendSnapshot(): RecommendSnapshot {
  const profile = getFarmProfile();
  const season = currentIndianSeason();
  const fingerprint = farmFingerprint(profile, season);

  if (memory && memory.fingerprint === fingerprint) {
    ensureMarketPrices();
    return memory;
  }

  const restored = readPersistedIfValid();
  if (restored) {
    memory = restored;
    ensureMarketPrices();
    return restored;
  }

  ensureMarketPrices();
  memory = compute();
  return memory;
}

export function refreshRecommendations(): RecommendSnapshot {
  const profile = getFarmProfile();
  const season = currentIndianSeason();
  const fingerprint = farmFingerprint(profile, season);
  refreshMarketPrices();

  if (memory && memory.fingerprint === fingerprint) {
    memory = { ...memory, savedAt: Date.now() };
    saveJson(KEY, toPersisted(memory));
    return memory;
  }

  memory = compute();
  return memory;
}

export function getRankedCrop(id: string): RankedCrop {
  const snap = getRecommendSnapshot();
  const hit = snap.crops.find((crop) => crop.id === id);
  if (hit) return hit;
  const crop = getCropById(id);
  if (crop) return { ...crop, score: 70, topologyFit: 'fair' };
  return snap.crops[0] ?? { ...cropCatalog[0], score: 70, topologyFit: 'fair' };
}
