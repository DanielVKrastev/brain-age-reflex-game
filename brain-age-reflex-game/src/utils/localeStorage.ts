import type { AppLocale } from '../i18n/translations';

const LOCALE_KEY = 'brain_age_reflex_locale_v1';
const VALID_LOCALES: AppLocale[] = ['bg', 'en', 'de', 'es', 'fr', 'it', 'tr', 'ro'];

export function loadSavedLocale(): AppLocale {
  try {
    const saved = window.localStorage.getItem(LOCALE_KEY);
    if (saved && (VALID_LOCALES as string[]).includes(saved)) {
      return saved as AppLocale;
    }
  } catch {
    // Ignore storage errors
  }

  const browserLang =
    typeof navigator !== 'undefined' ? navigator.language.slice(0, 2).toLowerCase() : 'bg';
  if ((VALID_LOCALES as string[]).includes(browserLang)) {
    return browserLang as AppLocale;
  }

  return 'bg';
}

export function saveLocale(locale: AppLocale): void {
  try {
    window.localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // Ignore storage errors
  }
}