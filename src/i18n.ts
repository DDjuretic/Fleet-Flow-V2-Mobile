import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

// --- English Translations ---
const en = {
  // NOTE: All translation keys are defined here
};

// --- Montenegrin Translations (initially copied from English) ---
const me = {
  ...en, // Copy all from english
  // NOTE: We can override specific keys for Montenegrin here later
};


const resources = {
  en: {
    translation: en,
  },
  me: {
    translation: me,
  },
};

i18next
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: getLocales()[0].languageCode,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    react: {
      useSuspense: true,
    },
  });

export default i18next;