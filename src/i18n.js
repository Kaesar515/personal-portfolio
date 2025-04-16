import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend'; // Loads translations via http
import LanguageDetector from 'i18next-browser-languagedetector'; // Keep detector

i18n
  .use(HttpApi) // Use backend to load translations
  .use(LanguageDetector) // Keep detector
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    lng: 'en', // Force initial language if no cache detected
    supportedLngs: ['en', 'de'],
    fallbackLng: 'en',
    // debug: true, // Set to false in production
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag'], 
      caches: ['localStorage', 'cookie'],
      load: 'languageOnly', 
      checkWhitelist: true, 
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
    },
    react: {
      useSuspense: true, // Set to true if using Suspense
    },
  });

export default i18n; 