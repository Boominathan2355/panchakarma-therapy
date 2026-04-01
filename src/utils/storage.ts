/**
 * Safe wrapper for localStorage access
 * Prevents crashes in environments where storage is restricted (iframes, private mode, etc.)
 */

// Helper to check if localStorage is available and accessible
const isStorageAvailable = () => {
  try {
    if (typeof window === 'undefined' || !('localStorage' in window)) {
      return false;
    }
    const storage = window.localStorage;
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    // This catch block handles "Access to storage is not allowed from this context" 
    // and other security-related DOMExceptions.
    return false;
  }
};

const hasLocalStorage = isStorageAvailable();

const storage = {
  get: (key: string): string | null => {
    if (!hasLocalStorage) return null;
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  set: (key: string, value: string): boolean => {
    if (!hasLocalStorage) return false;
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  },
  remove: (key: string): boolean => {
    if (!hasLocalStorage) return false;
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },
  clear: (): boolean => {
    if (!hasLocalStorage) return false;
    try {
      window.localStorage.clear();
      return true;
    } catch (e) {
      return false;
    }
  }
};

export default storage;
