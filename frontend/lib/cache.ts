type MemoryEntry = { value: string; at: number };

const memory = new Map<string, MemoryEntry>();

function disk(): Storage | null {
  try {
    const store = (globalThis as { localStorage?: Storage }).localStorage;
    return store ?? null;
  } catch {
    return null;
  }
}

export function cacheGet(key: string): string | null {
  const hit = memory.get(key);
  if (hit) return hit.value;
  try {
    const raw = disk()?.getItem(key) ?? null;
    if (raw != null) memory.set(key, { value: raw, at: Date.now() });
    return raw;
  } catch {
    return null;
  }
}

export function cacheSet(key: string, value: string) {
  memory.set(key, { value, at: Date.now() });
  try {
    disk()?.setItem(key, value);
  } catch {
    /* quota / private mode */
  }
}

export function loadJson<T>(key: string): T | null {
  const raw = cacheGet(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveJson(key: string, value: unknown) {
  try {
    cacheSet(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}
