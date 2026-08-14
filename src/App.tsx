import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Landmark, Github } from 'lucide-react';
import Home from "./pages/Home";
import About from "./pages/About";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { TimezoneDisplay } from "./components/TimezoneDisplay";
import { PageTransition } from "./components/PageTransition";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { DisclaimerModal } from "./components/DisclaimerModal";
import { useTimezone } from "./hooks/useTimezone";
import { useTheme } from "./hooks/useTheme";
import { useTranslation } from "react-i18next";

/** Google Fonts family name for the active language's Noto Sans variant. */
function getNotoFontFamily(lng: string): string {
  const lang = (lng || '').toLowerCase();
  if (lang === 'zh-tw' || lang === 'zh-hant') return 'Noto+Sans+TC';
  if (lang === 'zh-cn' || lang === 'zh' || lang === 'zh-hans') return 'Noto+Sans+SC';
  if (lang === 'ko') return 'Noto+Sans+KR';
  return 'Noto+Sans+JP';
}

function Layout({ children }: { children: React.ReactNode }) {
  const { timezone, useAutoTimezone, setTimezone } = useTimezone();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [headerShrunk, setHeaderShrunk] = useState(false);

  // Shrink the header (logo/title/padding) once the page scrolls — the
  // effect is CSS-gated to mobile, so desktop is untouched.
  useEffect(() => {
    const onScroll = () => setHeaderShrunk(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Apply the active theme to <html> (classes + Noto Sans font for the
  // official theme) and persist it. The index.html inline script pre-applies
  // the class before first paint, so there is no flash of the wrong theme.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-pixel', 'theme-official');
    root.classList.add(theme === 'official' ? 'theme-official' : 'theme-pixel');

    try {
      localStorage.setItem('nm-theme', theme);
    } catch { /* ignore */ }

    // Match the favicon to the theme: museum = slate bg + white logo,
    // pixel = the original red icon.
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.setAttribute('href', theme === 'official' ? '/favicon-museum.svg' : '/favicon.svg');
    }

    // The official theme loads the Noto Sans variant matching the active
    // language (JP/SC/TC/KR) so Chinese never renders with Japanese glyphs.
    if (theme === 'official') {
      const family = getNotoFontFamily(i18n.language);
      let link = document.getElementById('nm-noto-font') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.id = 'nm-noto-font';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;700&display=swap`;
    } else {
      document.getElementById('nm-noto-font')?.remove();
    }
  }, [theme, i18n.language]);

  useEffect(() => {
    // Route-aware, localized document title.
    document.title = location.pathname === '/about'
      ? `${t('about.title')} · ${t('common.title')}`
      : t('common.title');

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t('seo.description'));
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', t('seo.keywords'));
    }

    // Update OG tags
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', t('seo.description'));
    }

    const twitterDesc = document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc) {
      twitterDesc.setAttribute('content', t('seo.description'));
    }
  }, [t, location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`bg-nintendo-red border-b-4 border-nintendo-dark p-4 shadow-pixel sticky top-0 z-50${headerShrunk ? ' header-shrunk' : ''}`}>
        <div className="container-pixel flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand: shrink-to-fit — the slate block hugs logo + title. It
              shrinks (never grows) so long titles wrap inside instead of
              pushing the controls off one line. */}
          <div className="header-brand flex items-center gap-4 min-w-0 shrink">
            {/* Logo / Title */}
            <div className="logo-tile shrink-0 bg-white p-2 border-2 border-nintendo-dark shadow-pixel-sm transform rotate-[-2deg]">
              <Landmark className="text-nintendo-red w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h1 className="text-white text-sm md:text-lg font-bold font-pixel tracking-wider drop-shadow-md leading-snug min-w-0 flex-1">
              {t('common.title')}
            </h1>
          </div>
          
          <div className="header-controls flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-3 shrink-0">
            {/* Theme toggle sits outside the language/timezone panel. */}
            <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 glass-pixel p-1.5 sm:p-2 rounded border-2 border-nintendo-dark shadow-pixel-sm">
              <LanguageSwitcher />
              <TimezoneDisplay timezone={timezone} useAutoTimezone={useAutoTimezone} onTimezoneChange={setTimezone} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <PageTransition>{children}</PageTransition>
      </main>

      {/* First-visit disclaimer — blocks the page until acknowledged. */}
      <DisclaimerModal />

      <footer className="bg-nintendo-dark text-white p-5 text-center mt-auto border-t-4 border-nintendo-grey">
        {/* Compact two-row layout: identity row + legal row, both wrapping
            gracefully on phones. */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-2">
          <p className="font-pixel text-xs opacity-70">{t('common.copyright', { year: new Date().getFullYear() })}</p>
          <p className="font-pixel text-xs opacity-70">Created by Livrestrela</p>
          <a
            href="https://github.com/signxer/nintendo-museum-ticket"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors border border-gray-600 rounded px-2 py-0.5 hover:border-white"
          >
            <Github className="w-3 h-3" />
            <span>{t('common.viewOnGithub')}</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <p className="text-xs text-nintendo-red">{t('common.footerDisclaimer')}</p>
          <p className="text-[10px] text-gray-500">{t('common.trademark')}</p>
        </div>

      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}
