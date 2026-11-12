import type { Role, UserDto } from '@gympilot/shared';

const TOKEN_KEY = 'gympilot_token';
const REFRESH_TOKEN_KEY = 'gympilot_refresh_token';
const USER_KEY = 'gympilot_user';

// In-memory fallback if localStorage is unavailable (e.g., SSR or node test environment)
const memoryStore = new Map<string, string>();

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStore.get(key) ?? null;
    } catch {
      return memoryStore.get(key) ?? null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      } else {
        memoryStore.set(key, value);
      }
    } catch {
      memoryStore.set(key, value);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      memoryStore.delete(key);
    } catch {
      memoryStore.delete(key);
    }
  },
  clear: (): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
      memoryStore.clear();
    } catch {
      memoryStore.clear();
    }
  },
};

export const authStorage = {
  getToken: (): string | null => safeStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => safeStorage.setItem(TOKEN_KEY, token),
  clearToken: (): void => {
    safeStorage.removeItem(TOKEN_KEY);
    safeStorage.removeItem(REFRESH_TOKEN_KEY);
    safeStorage.removeItem(USER_KEY);
  },
  getRefreshToken: (): string | null => safeStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string): void => safeStorage.setItem(REFRESH_TOKEN_KEY, token),

  getUser: (): UserDto | null => {
    const raw = safeStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserDto;
    } catch {
      return null;
    }
  },
  setUser: (user: UserDto): void => {
    safeStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUserRole: (): Role | null => {
    const user = authStorage.getUser();
    return user?.role ?? null;
  },
};
