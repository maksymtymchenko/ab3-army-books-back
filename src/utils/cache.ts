type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Get a cached value by key, or null if missing or expired.
 */
export const getFromCache = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value as T;
};

/**
 * Store a value in the cache with a time-to-live.
 */
export const setInCache = <T>(
  key: string,
  value: T,
  ttlSeconds: number
): void => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
};

/**
 * Remove a cached entry by key.
 */
export const deleteFromCache = (key: string): void => {
  cache.delete(key);
};

/**
 * Clear all cached entries.
 */
export const clearCache = (): void => {
  cache.clear();
};

