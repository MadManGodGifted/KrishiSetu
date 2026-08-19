import { cropMarkets } from '@/constants/market';
import { loadJson, saveJson } from '@/lib/cache';

const KEY = 'ks.market.prices.v1';
const TTL_MS = 15 * 60 * 1000;

type PriceSnap = {
  at: number;
  prices: Record<string, number>;
};

let memory: PriceSnap | null = loadJson<PriceSnap>(KEY);

function catalogPrices(): Record<string, number> {
  const prices: Record<string, number> = {};
  for (const [id, market] of Object.entries(cropMarkets)) {
    if (market?.apmc) prices[id] = market.apmc.today;
  }
  return prices;
}

function fresh(snap: PriceSnap | null): snap is PriceSnap {
  return Boolean(snap && Date.now() - snap.at < TTL_MS);
}

export function ensureMarketPrices(): Record<string, number> {
  if (fresh(memory)) return memory.prices;
  const stored = loadJson<PriceSnap>(KEY);
  if (fresh(stored)) {
    memory = stored;
    return stored.prices;
  }
  memory = { at: Date.now(), prices: catalogPrices() };
  saveJson(KEY, memory);
  return memory.prices;
}

export function getLiveApmcPrice(cropId: string): number | undefined {
  const prices = memory?.prices ?? ensureMarketPrices();
  if (prices[cropId] != null) return prices[cropId];
  return cropMarkets[cropId]?.apmc?.today;
}

/** Jitter live mandi quotes. Ranked crops are not recomputed. */
export function refreshMarketPrices(): Record<string, number> {
  const base = catalogPrices();
  const prices: Record<string, number> = {};
  for (const [id, amount] of Object.entries(base)) {
    const swing = Math.round(amount * (Math.random() * 0.02 - 0.01));
    prices[id] = Math.max(1, amount + swing);
  }
  memory = { at: Date.now(), prices };
  saveJson(KEY, memory);
  return prices;
}

export function hasFreshMarketPrices(): boolean {
  return fresh(memory);
}
