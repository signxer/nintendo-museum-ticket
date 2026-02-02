import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landmark, Github } from 'lucide-react';
import Home from "./pages/Home";
import About from "./pages/About";
import { PixelClock } from "./components/PixelClock";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { TimezoneDisplay } from "./components/TimezoneDisplay";
import { useTimezone } from "./hooks/useTimezone";
import { useTranslation } from "react-i18next";

function Layout({ children }: { children: React.ReactNode }) {
  const { timezone, setTimezone } = useTimezone();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('common.title');
    
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
  }, [t]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-nintendo-red border-b-4 border-nintendo-dark p-4 shadow-pixel sticky top-0 z-50">
        <div className="container-pixel flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Logo / Title */}
            <div className="bg-white p-2 border-2 border-nintendo-dark shadow-pixel-sm transform rotate-[-2deg]">
              <Landmark className="text-nintendo-red w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h1 className="text-white text-sm md:text-lg font-bold font-pixel tracking-wider drop-shadow-md truncate max-w-[200px] md:max-w-none">
              {t('common.title')}
            </h1>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <PixelClock className="text-white drop-shadow-md" />
            <div className="flex flex-wrap justify-center gap-4 bg-white/95 p-2 rounded border-2 border-nintendo-dark shadow-pixel-sm">
              <LanguageSwitcher />
              <TimezoneDisplay timezone={timezone} onTimezoneChange={setTimezone} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-nintendo-dark text-white p-8 text-center mt-auto border-t-4 border-nintendo-grey">
        <p className="font-pixel text-xs opacity-70 mb-2">{t('common.copyright', { year: new Date().getFullYear() })}</p>
        
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
    <Router basename="/nintendo-museum-ticket">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}
