import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from "./locals/en.json";
import fr from "./locals/fr.json";
import hi from "./locals/hi.json";
import es from "./locals/es.json";
import de from "./locals/de.json";
import th from "./locals/th.json";
import it from "./locals/it.json";
import pt from "./locals/pt.json";
import ro from "./locals/ro.json";

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      const storedLanguage = await AsyncStorage.getItem('language');
      if (storedLanguage) {
        callback(JSON.parse(storedLanguage));
      } else {
        const bestLanguage = RNLocalize.findBestAvailableLanguage(['en', 'pt', 'es', 'hi', 'th', 'it', 'fr', 'ro', 'de']);
        callback(bestLanguage?.languageTag || 'en');
      }
    } catch (error) {
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem('language', JSON.stringify(language));
    } catch (error) {
      console.error('Error caching language', error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      th: { translation: th },
      it: { translation: it },
      pt: { translation: pt },
      ro: { translation: ro },
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // Disable suspense to avoid issues during initialization
    },
  });

export default i18n;
