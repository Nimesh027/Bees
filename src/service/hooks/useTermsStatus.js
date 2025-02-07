import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';

export const useTermsStatus = () => {
    const [termsAccepted, setTermsAccepted] = useState(null);  

    const getTermsAccepted = async () => {
        try {
            const value = await AsyncStorage.getItem('isTermsAccepted');
            if (value !== null) {
                setTermsAccepted(value);
            }
        } catch (e) {
            console.log("Error retrieving data from AsyncStorage", e);
        }
    };

    const setTermsAcceptedStatus = async (value) => {
        try {
            await AsyncStorage.setItem('isTermsAccepted', value);
            setTermsAccepted(value);  
            ToastAndroid.show("Welcome to Spin Master", ToastAndroid.SHORT);
        } catch (e) {
            console.log("Error saving data to AsyncStorage", e);
        }
    };

    useEffect(() => {
        getTermsAccepted();  
    }, []);

    return [termsAccepted, setTermsAcceptedStatus];
};
