import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Landmark, Github } from 'lucide-react';
import Home from "./pages/Home";
import About from "./pages/About";
import { PixelClock } from "./components/PixelClock";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { TimezoneDisplay } from "./components/TimezoneDisplay";
import { PageTransition } from "./components/PageTransition";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { useTimezone } from "./hooks/useTimezone";
import { useTheme } from "./hooks/useTheme";
import { useTranslation } from "react-i18next";

function Layout({ children }: { children: React.ReactNode }) {
  const { timezone, useAutoTimezone, setTimezone } = useTimezone();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();

  // Apply the active theme to <html> (classes + Noto Sans JP for the official
  // theme) and persist it. The index.html inline script pre-applies the class
  // before first paint, so there is no flash of the wrong theme.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-pixel', 'theme-official');
    root.classList.add(theme === 'official' ? 'theme-official' : 'theme-pixel');

    try {
      localStorage.setItem('nm-theme', theme);
    } catch { /* ignore */ }

    const existing = document.getElementById('nm-noto-font');
    if (theme === 'official') {
      if (!existing) {
        const link = document.createElement('link');
        link.id = 'nm-noto-font';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap';
        document.head.appendChild(link);
      }
    } else if (existing) {
      existing.remove();
    }
  }, [theme]);

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
      <header className="bg-nintendo-red border-b-4 border-nintendo-dark p-4 shadow-pixel sticky top-0 z-50">
        <div className="container-pixel flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Logo / Title */}
            <div className="logo-tile bg-white p-2 border-2 border-nintendo-dark shadow-pixel-sm transform rotate-[-2deg]">
              <Landmark className="text-nintendo-red w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h1 className="text-white text-sm md:text-lg font-bold font-pixel tracking-wider drop-shadow-md truncate max-w-[200px] md:max-w-none">
              {t('common.title')}
            </h1>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            {/* Live clock is decorative chrome — hide it on small screens so
                the sticky header stays compact on phones. */}
            <div className="hidden md:block">
              <PixelClock className="text-white drop-shadow-md" />
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 glass-pixel p-1.5 sm:p-2 rounded border-2 border-nintendo-dark shadow-pixel-sm">
              <LanguageSwitcher />
              <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
              <TimezoneDisplay timezone={timezone} useAutoTimezone={useAutoTimezone} onTimezoneChange={setTimezone} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <PageTransition>{children}</PageTransition>
      </main>

      <footer className="bg-nintendo-dark text-white p-8 text-center mt-auto border-t-4 border-nintendo-grey">
        <p className="font-pixel text-xs opacity-70 mb-2">{t('common.copyright', { year: new Date().getFullYear() })}</p>
        <p className="font-pixel text-xs opacity-70 mb-2">Created by Livrestrela</p>
        <a 
          href="https://github.com/signxer/nintendo-museum-ticket" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors mb-4 border border-gray-600 rounded px-2 py-1 hover:border-white"
        >
          <Github className="w-3 h-3" />
          <span>{t('common.viewOnGithub')}</span>
        </a>

        <p className="text-xs text-nintendo-red mb-1">{t('common.footerDisclaimer')}</p>
        <p className="text-[10px] text-gray-500">{t('common.trademark')}</p>

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
