import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend'; // Loads translations via http
import LanguageDetector from 'i18next-browser-languagedetector'; // Re-enable detector for persistence

i18n
  .use(HttpApi) // Use backend to load translations
  .use(LanguageDetector) // Re-enable detector
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    lng: 'en', // Force initial language if no cache detected
    supportedLngs: ['en', 'de'],
    fallbackLng: 'en',
    // debug: true, // Set to false in production - Keep this commented or uncommented as needed
    detection: {
      // Order: Check cache first, then html tag. Avoid navigator.
      order: ['localStorage', 'cookie', 'htmlTag'], 
      caches: ['localStorage', 'cookie'], // Where to cache the language
      // We can keep checkWhitelist and load languageOnly if desired, but primary fix is the order
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