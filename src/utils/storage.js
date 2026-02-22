/**
 * Safe wrapper for localStorage access
 * Prevents crashes in environments where storage is restricted (iframes, private mode, etc.)
 */
const storage = {
    get: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn(`Storage GET failed for key: ${key}`, e);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.warn(`Storage SET failed for key: ${key}`, e);
            return false;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn(`Storage REMOVE failed for key: ${key}`, e);
            return false;
        }
    },
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.warn('Storage CLEAR failed', e);
            return false;
        }
    }
};

export default storage;
