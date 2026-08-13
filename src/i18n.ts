import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import zhCN from './locales/zh-CN.json';
import zhTW from './locales/zh-TW.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import nl from './locales/nl.json';
import sv from './locales/sv.json';
import ar from './locales/ar.json';
import th from './locales/th.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'zh-CN': { translation: zhCN },
      'zh': { translation: zhCN },
      'zh-TW': { translation: zhTW },
      ja: { translation: ja },
      ko: { translation: ko },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      it: { translation: it },
      pt: { translation: pt },
      ru: { translation: ru },
      nl: { translation: nl },
      sv: { translation: sv },
      ar: { translation: ar },
      th: { translation: th },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    }
  });

/** Locales that must render right-to-left. */
const RTL_LOCALES = new Set(['ar']);

/**
 * Keep `<html lang>` and `dir` in sync with the active language, so screen
 * readers announce correctly and RTL locales (e.g. Arabic) actually mirror.
 */
function syncDocumentLangDir(lng: string): void {
  if (typeof document === 'undefined') return;
  const primary = (lng || '').toLowerCase().split('-')[0];
  document.documentElement.lang = lng || 'en';
  document.documentElement.dir = RTL_LOCALES.has(primary) ? 'rtl' : 'ltr';
}

i18n.on('languageChanged', syncDocumentLangDir);
syncDocumentLangDir(i18n.language);

export default i18n;
