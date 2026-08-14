import { useEffect, useState } from 'react';

export type Theme = 'pixel' | 'official';

const THEME_KEY = 'nm-theme';

/** The official theme loads Noto Sans JP (the museum ticket site's body font)
 *  on demand; the pixel theme stays fully self-contained. */
const NOTO_FONT_HREF = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap';
const FONT_LINK_ID = 'nm-noto-font';

function getInitialTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === 'official' ? 'official' : 'pixel';
  } catch {
    return 'pixel';
  }
}

/**
 * Two visual themes:
 *  - "pixel"    — the default retro Nintendo-style look.
 *  - "official" — mirrors the Nintendo Museum ticket site design language
 *    (Noto Sans JP + Avant Garde-style display font, #3C3C3C body text,
 *    #76738A slate accents, white flat rounded surfaces).
 *
 * The active theme is applied as `theme-pixel` / `theme-official` on
 * <html>; every Tailwind color/font utility resolves through CSS variables
 * that each theme redefines (see index.css).
 *
 * An inline script in index.html pre-applies the class before React loads,
 * so there is no flash of the wrong theme.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-pixel', 'theme-official');
    root.classList.add(theme === 'official' ? 'theme-official' : 'theme-pixel');

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch { /* ignore */ }

    const existing = document.getElementById(FONT_LINK_ID);
    if (theme === 'official') {
      if (!existing) {
        const link = document.createElement('link');
        link.id = FONT_LINK_ID;
        link.rel = 'stylesheet';
        link.href = NOTO_FONT_HREF;
        document.head.appendChild(link);
      }
    } else if (existing) {
      existing.remove();
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'pixel' ? 'official' : 'pixel'));

  return { theme, toggleTheme, isOfficial: theme === 'official' };
}
