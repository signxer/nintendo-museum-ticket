import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English is statically bundled as the fallback, so the very first paint never
// depends on a network round trip. Every other locale is code-split into its
// own chunk and fetched on demand (see ensureLocaleBundle).
import en from './locales/en.json';

const localeLoaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  'zh-CN': () => import('./locales/zh-CN.json'),
  'zh-TW': () => import('./locales/zh-TW.json'),
  ja: () => import('./locales/ja.json'),
  ko: () => import('./locales/ko.json'),
  es: () => import('./locales/es.json'),
  fr: () => import('./locales/fr.json'),
  de: () => import('./locales/de.json'),
  it: () => import('./locales/it.json'),
  pt: () => import('./locales/pt.json'),
  ru: () => import('./locales/ru.json'),
  nl: () => import('./locales/nl.json'),
  sv: () => import('./locales/sv.json'),
  ar: () => import('./locales/ar.json'),
  th: () => import('./locales/th.json'),
};

/** LanguageDetector can report "zh" for Simplified Chinese — normalize it. */
function normalizeLng(lng: string): string {
  return lng.toLowerCase() === 'zh' ? 'zh-CN' : lng;
}

/**
 * Ensure a locale's resource bundle is loaded, then re-emit `languageChanged`
 * so React re-renders with the real strings (i18next already fell back to
 * English while the chunk was loading).
 */
export async function ensureLocaleBundle(lng: string): Promise<void> {
  const key = normalizeLng(lng);
  const load = localeLoaders[key];
  if (!load || i18n.hasResourceBundle(key, 'translation')) return;
  const bundle = await load();
  i18n.addResourceBundle(key, 'translation', bundle.default as never);
  if (i18n.language === key || i18n.resolvedLanguage === key) {
    // Re-announce so components pick up the freshly added strings.
    i18n.emit('languageChanged', i18n.language);
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
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

i18n.on('languageChanged', (lng) => {
  syncDocumentLangDir(lng);
  // Kick off lazy loading for the newly selected language (no-op for the
  // statically bundled 'en' and for already-loaded locales).
  void ensureLocaleBundle(lng);
});
syncDocumentLangDir(i18n.language);

export default i18n;
