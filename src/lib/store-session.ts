export interface ActiveStoreData {
  id?: string;
  name?: string;
  slug?: string;
  phone?: string;
  address?: string;
}

/**
 * Safely retrieves active store metadata from client storage
 */
export function getActiveStore(): ActiveStoreData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("active_store");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {
    // Ignore JSON errors
  }
  return null;
}

/**
 * Returns dynamic store name or safe fallback
 */
export function getActiveStoreName(fallback = "Retail Boutique"): string {
  const store = getActiveStore();
  return store?.name?.trim() || fallback;
}
