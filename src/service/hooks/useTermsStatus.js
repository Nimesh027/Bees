import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';
import { useTranslation } from 'react-i18next';

export const useTermsStatus = () => {
    const [termsAccepted, setTermsAccepted] = useState(null); 
    const { t } = useTranslation(); 

    const getTermsAccepted = async () => {
        try {
            const value = await AsyncStorage.getItem('isTermsAccepted');
            if (value !== null) {
                setTermsAccepted(value);
            }
        } catch (e) {
        }
    };

    const setTermsAcceptedStatus = async (value) => {
        try {
            await AsyncStorage.setItem('isTermsAccepted', value);
            setTermsAccepted(value);  
            ToastAndroid.show(t('welcome_to_spinmaster'), ToastAndroid.SHORT);
        } catch (e) {
        }
    };

    useEffect(() => {
        getTermsAccepted();  
    }, []);

    return [termsAccepted, setTermsAcceptedStatus];
};
