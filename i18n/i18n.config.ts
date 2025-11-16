// /i18n/i18n.config.ts

import fr from '../locales/fr'
import en from '../locales/en'
export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  globalInjection: true,
  messages: {
    fr,
    en
  }
}));