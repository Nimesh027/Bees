import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, BackHandler, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ThirdonboardingScreen } from './ThirdonboardingScreen';
import { SecondOnboardingScreen } from './SecondonboardingScreen';
import { OnboardingScreen } from './OnboardingScreen';
import { CustomText } from '../../commonComponents/CommonComponent';
import { useDataContext } from '../../service/DataContext';
import { theme } from '../../theme/theme';

export const WelcomeScreen = () => {
    const { setTermsAcceptedStatus } = useDataContext();
    const [currentScreen, setCurrentScreen] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const Styles = useMemo(() => createStyles(theme), [theme]);
    const [backPressCount, setBackPressCount] = useState(0);

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                if (isLoading) {
                    return true; // Prevent back action when loading
                }

                if (currentScreen === 0) {
                    if (backPressCount === 0) {
                        setBackPressCount(1);
                        ToastAndroid.show('Tap again to Exit', ToastAndroid.SHORT);
                        setTimeout(() => setBackPressCount(0), 2000);
                        return true;
                    } else {
                        BackHandler.exitApp();
                        return true;
                    }
                } else {
                    setCurrentScreen(currentScreen - 1);
                    return true;
                }
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
            return () => backHandler.remove();
        }, [backPressCount, currentScreen, isLoading]) // Added `isLoading` as a dependency
    );

    const handleNextPress = () => {
        if (currentScreen < 2) setCurrentScreen(currentScreen + 1);
    };

    const handlePreviousPress = () => {
        if (currentScreen > 0) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    const handleGoPress = async () => {
        setIsLoading(true);
        setTermsAcceptedStatus("Accepted");

        setTimeout(() => {
            setIsLoading(false);
            navigation.replace('Spin Master');
        }, 2000);
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case 0: return <OnboardingScreen />;
            case 1: return <SecondOnboardingScreen />;
            case 2: return <ThirdonboardingScreen />;
            default: return null;
        }
    };

    return (
        <View style={Styles.container}>
            <View style={Styles.smileyContainer}>
                {renderScreen()}
            </View>

            <View style={Styles.WrapButton}>
                <TouchableOpacity
                    style={[Styles.arrowButton, currentScreen === 0 && Styles.disabledArrowButton]}
                    onPress={currentScreen !== 0 ? handlePreviousPress : null}
                    disabled={currentScreen === 0}
                >
                    <Icon
                        name="angle-double-left"
                        size={30}
                        color={currentScreen === 0 ? theme.colors.primary : theme.colors.secondary}
                    />
                </TouchableOpacity>

                <View style={Styles.pagination}>
                    {[0, 1, 2].map(i => (
                        <View key={i} style={[Styles.dot, currentScreen === i && Styles.activeDot]} />
                    ))}
                </View>

                <TouchableOpacity
                    style={Styles.arrowButton}
                    onPress={currentScreen < 2 ? handleNextPress : handleGoPress}
                    disabled={isLoading}
                >
                    <Icon name="angle-double-right" size={30} color={theme.colors.secondary} />
                </TouchableOpacity>
            </View>

            <Modal
                transparent
                visible={isLoading}
                animationType="fade"
            >
                <View style={Styles.modalOverlay}>
                    <View style={Styles.modalContent}>
                        <ActivityIndicator size="large" color={theme.colors.secondary} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const createStyles = ({ text: { subheading, heading }, colors: { primary, secondary, accent, background, disabled }, dimensions: { width, height } }) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: background,
            paddingHorizontal: 20,
        },
        smileyContainer: {
            borderColor: primary,
            borderWidth: 1,
            backgroundColor: background,
            elevation: 3,
            width: '100%',
            height: height * 0.82,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: height * 0.03,
            marginBottom: height * 0.15,
            paddingBottom: height * 0.002,
            borderRadius: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
        },
        WrapButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            position: 'absolute',
            bottom: height * 0.03,
            paddingVertical: 15,
            backgroundColor: primary,
            paddingHorizontal: 30,
            borderRadius: 15,
        },
        pagination: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        dot: {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: secondary,
            marginHorizontal: 5,
            opacity: 0.5,
        },
        activeDot: {
            backgroundColor: background,
            opacity: 1,
            transform: [{ scale: 1.2 }],
        },
        arrowButton: {
            paddingVertical: width * 0.02,
            paddingHorizontal: width * 0.07,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: background,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 5,
        },
        disabledArrowButton: {
            backgroundColor: primary,
            shadowColor: primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        },
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            width: 100,
            height: 100,
            backgroundColor: background,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};

