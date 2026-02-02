import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { cn } from '../lib/utils';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'zh-CN', label: '简体中文' },
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'pt', label: 'Português' },
    { code: 'ru', label: 'Русский' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'sv', label: 'Svenska' },
    { code: 'ar', label: 'العربية' },
    { code: 'th', label: 'ไทย' },
  ];

  // Simple check to match available languages
  const currentLang = languages.find(l => i18n.language.startsWith(l.code))?.code || 'en';

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <Languages className="w-4 h-4 text-nintendo-grey" />
      <select
        value={currentLang}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent font-sans text-nintendo-dark focus:outline-none cursor-pointer border-b border-dashed border-nintendo-grey hover:border-nintendo-red transition-colors max-w-[120px]"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
