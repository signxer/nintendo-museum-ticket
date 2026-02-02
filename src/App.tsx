import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-nintendo-red border-b-4 border-nintendo-dark p-4 shadow-pixel sticky top-0 z-50">
        <div className="container-pixel flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Logo / Title */}
            <div className="bg-white p-2 border-2 border-nintendo-dark shadow-pixel-sm transform rotate-[-2deg]">
              <span className="font-pixel text-nintendo-red text-2xl font-bold">M</span>
            </div>
            <h1 className="text-white text-sm md:text-lg font-bold font-pixel tracking-wider drop-shadow-md">
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
        <p className="font-pixel text-xs opacity-70 mb-2">&copy; {new Date().getFullYear()} Nintendo Museum Ticket Tool</p>
        <p className="text-xs text-gray-400 mb-1">{t('common.footerDisclaimer')}</p>
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
