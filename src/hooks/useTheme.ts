import { create } from 'zustand';

export type Theme = 'pixel' | 'official';

const THEME_KEY = 'nm-theme';

function getInitialTheme(): Theme {
  try {
    // Museum is the default on first visit; only an explicit "pixel" choice
    // (persisted) overrides it.
    return localStorage.getItem(THEME_KEY) === 'pixel' ? 'pixel' : 'official';
  } catch {
    return 'official';
  }
}

/**
 * Shared theme state so every consumer (header toggle, confetti colors, …)
 * sees the same value. The DOM side-effects (html class, Noto Sans JP link,
 * persistence) are applied once in App's Layout effect.
 */
interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'pixel' ? 'official' : 'pixel' })),
}));

export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  return { theme, toggleTheme, isOfficial: theme === 'official' };
}
