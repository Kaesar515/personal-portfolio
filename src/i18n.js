import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend'; // Loads translations via http
import LanguageDetector from 'i18next-browser-languagedetector'; // Detects user language

i18n
  .use(HttpApi) // Use backend to load translations
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    fallbackLng: 'en', // Use 'en' if detected language is not available
    debug: true, // Set to false in production
    detection: {
      // Order and from where user language should be detected
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'], // Cache user language preference
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
    },
    react: {
      useSuspense: false, // Set to true if using Suspense
    },
  });

export default i18n; 