import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../i18n';

const useLanguage = (initiallanguage) => {
  const [language, setLanguage] = useState(initiallanguage);

  const updateLanguage = useCallback(async (updatedLanguage) => {
    try {
      await AsyncStorage.setItem('language', JSON.stringify(updatedLanguage));
      setLanguage(updatedLanguage);
      i18n.changeLanguage(updatedLanguage);
    } catch (error) {
      console.error('Error updating language', error);
    }
  }, []);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('language');
        if (storedLanguage !== null) {
          const parsedLanguage = JSON.parse(storedLanguage);
          setLanguage(parsedLanguage);
          i18n.changeLanguage(parsedLanguage);
        } else {
          await AsyncStorage.setItem('language', JSON.stringify(initiallanguage));
          setLanguage(initiallanguage);
          i18n.changeLanguage(initiallanguage);
        }
      } catch (error) {
        console.error('Error loading language', error);
      }
    };
    loadLanguage();
  }, [initiallanguage]);

  return [language, updateLanguage];
};

export default useLanguage;
