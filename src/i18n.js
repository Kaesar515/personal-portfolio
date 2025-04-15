import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend'; // Loads translations via http

i18n
  .use(HttpApi) // Use backend to load translations
  // .use(LanguageDetector) // Temporarily remove detector to isolate FOUT issue
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    lng: 'en', // Force initial language to English
    supportedLngs: ['en', 'de'], // Add supported languages
    fallbackLng: 'en', // Default fallback language
    // debug: true, // Set to false in production - Keep this commented or uncommented as needed
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
    },
    react: {
      useSuspense: true, // Set to true if using Suspense
    },
  });

export default i18n; 