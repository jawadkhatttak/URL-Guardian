const NAMESPACE = 'urlGuardian';

/**
 * Thin wrapper around localStorage so the rest of the app never touches
 * window.localStorage directly and never throws on quota errors, disabled
 * storage (private browsing in some browsers), or corrupted JSON.
 */
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(`${NAMESPACE}:${key}`);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`[storage] read failed for "${key}":`, err);
      return fallback;
    }
  },

  set(key, value) {
    try {
      window.localStorage.setItem(`${NAMESPACE}:${key}`, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`[storage] write failed for "${key}":`, err);
      return false;
    }
  },

  remove(key) {
    try {
      window.localStorage.removeItem(`${NAMESPACE}:${key}`);
      return true;
    } catch (err) {
      console.warn(`[storage] remove failed for "${key}":`, err);
      return false;
    }
  },
};
