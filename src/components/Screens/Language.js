import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { CustomText } from '../../commonComponents/CommonComponent';
import { theme } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import i18n from '../../i18n';
import { useDataContext } from '../../service/DataContext';
import { useNavigation } from '@react-navigation/native';

export const Language = () => {
    const navigation = useNavigation();
    const Styles = useMemo(() => createStyles(theme), [theme]);
    const { termsAccepted, language, updateLanguage } = useDataContext();
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [loading, setLoading] = useState(false);

    const handleLanguageChange = async (newLanguageCode) => {
        setLoading(true);
        
        setTimeout(async () => {
            setSelectedLanguage(newLanguageCode);
            await updateLanguage(newLanguageCode);
            i18n.changeLanguage(newLanguageCode);
            setLoading(false);
            if (!termsAccepted) {
                navigation.replace('DetailsScreen'); 
            }
        }, 1500);
    };

    useEffect(() => {
        if (language) {
            i18n.changeLanguage(language);
        }
    }, [language]);

    const languages = [
        { id: 1, title: 'English', subtitle: 'Default Language', code: 'en' },
        { id: 2, title: 'Deutsch', subtitle: 'German', code: 'de' },
        { id: 3, title: 'Español', subtitle: 'Spanish', code: 'es' },
        { id: 4, title: 'Hindi', subtitle: 'हिन्दी', code: 'hi' },
        { id: 5, title: 'แบบไทย', subtitle: 'Thai', code: 'th' },
        { id: 6, title: 'Italiano', subtitle: 'Italian', code: 'it' },
        { id: 7, title: 'Française', subtitle: 'French', code: 'fr' },
        { id: 8, title: 'Română', subtitle: 'Romanian', code: 'ro' },
        { id: 9, title: 'Português', subtitle: 'Portuguese', code: 'pt' },
    ];

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={Styles.scrollViewContent}>
                {languages.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={Styles.cardSection}
                        onPress={() => handleLanguageChange(item.code)} // Pass language code
                        disabled={loading}
                    >
                        <View style={Styles.cardContent}>
                            <View>
                                <CustomText title={item.title} style={Styles.cardTitleText} />
                                <CustomText title={item.subtitle} style={Styles.cardSubtitleText} />
                            </View>
                            <View style={Styles.radioButton}>
                                {selectedLanguage === item.code ? (
                                    <Icon name="radio-button-checked" size={24} color={theme.colors.primary} />
                                ) : (
                                    <Icon name="radio-button-unchecked" size={24} color={theme.colors.secondary} />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {loading && (
                <Modal transparent={true} animationType="fade">
                    <View style={Styles.loaderContainer}>
                        <View style={Styles.innerContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const createStyles = ({ text: { body }, colors: { primary, background, secondary }, dimensions: { width, height } }) => {
    return StyleSheet.create({
        scrollViewContent: {
            alignItems: 'center',
            paddingVertical: width * 0.05,
        },
        cardSection: {
            width: width * 0.94,
            marginBottom: width * 0.02,
            borderRadius: width * 0.03,
            backgroundColor: '#f8f9fb',
            padding: width * 0.04,
            borderWidth: 1,
            borderColor: primary,
        },
        cardContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        cardTitleText: {
            fontSize: body.fontSize,
            color: secondary,
            fontWeight: '600',
        },
        cardSubtitleText: {
            fontSize: body.fontSize * 0.9,
            color: secondary,
            opacity: 0.7,
        },
        radioButton: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        loaderContainer: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        innerContainer: {
            width: "40%",
            padding: width * 0.07,
            backgroundColor: background,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: width * 0.03
        }
    });
};
