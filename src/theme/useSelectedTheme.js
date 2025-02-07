import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const useSelectedTheme = () => {
    const [selectedTheme, setSelectedTheme] = useState({
        themeType: 'orange',
        primary: '#FFFACD',
        secondary: '#000',
        accent: '#FFA500',
        background: '#FFF',
        color: '#F39C12',
    });

    const loadTheme = async () => {
        try {
            const storedTheme = await AsyncStorage.getItem('selectedTheme');
            if (storedTheme !== null) {
                setSelectedTheme(JSON.parse(storedTheme));
            }
        } catch (error) {
            console.error("Failed to load selectedTheme from AsyncStorage", error);
        }
    };

    const saveTheme = async (newTheme) => {
        try {
            await AsyncStorage.setItem('selectedTheme', JSON.stringify(newTheme));
            setSelectedTheme(newTheme);
        } catch (error) {
            console.error("Failed to save selectedTheme to AsyncStorage", error);
        }
    };

    useEffect(() => {
        loadTheme();
    }, []);

    return { selectedTheme, saveTheme };
};
