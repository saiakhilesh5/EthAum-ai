/**
 * Page-level cache utility for fast navigation
 * DISABLED - Always fetch fresh data to ensure consistency
 */

const CACHE_DURATION = 0; // Disabled - always fetch fresh

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export function getPageCache<T>(key: string): T | null {
  // Cache disabled - always return null to force fresh fetch
  return null;
}

export function setPageCache<T>(key: string, data: T): void {
  // Cache disabled - do nothing
}

export function clearPageCache(key?: string): void {
  // Clear any existing caches from session storage
  if (typeof window === 'undefined') return;
  try {
    const keys = Object.keys(sessionStorage).filter(k => k.startsWith('ethaum_page_'));
    keys.forEach(k => sessionStorage.removeItem(k));
  } catch {
    // Ignore
  }
}
