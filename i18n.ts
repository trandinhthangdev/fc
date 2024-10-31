import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './src/locales/en.json';
import vi from './src/locales/vi.json';
import {LANG_CODE} from './src/utils/constants';

const resources = {
  en: {translation: en},
  vi: {translation: vi},
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (lang: string) => void) => {
    callback(LANG_CODE);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: LANG_CODE,
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
