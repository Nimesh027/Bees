import React, { useEffect, useState, useMemo, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CustomButton, CustomText } from '../../commonComponents/CommonComponent';
import { useNavigation } from '@react-navigation/native';
import { useDataContext } from '../../service/DataContext';
import { theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';

export const DefaultScreen = ({ route }) => {
    const { t } = useTranslation();
    const Styles = useMemo(() => createStyles(theme), [theme]);
    const navigation = useNavigation();
    const { fetchData, playDetails, blogDetails, isConnected, termsAccepted } = useDataContext();
    const [loading, setLoading] = useState(false);
    const [navigated, setNavigated] = useState(false); // To prevent multiple navigations
    const { screen } = route?.params || {};
    const prevIsConnected = useRef(isConnected);

    useEffect(() => {
        if (prevIsConnected.current !== isConnected) {
            prevIsConnected.current = isConnected; // Update ref to track state change
            if (isConnected) {
                ToastAndroid.show(t('online'), ToastAndroid.SHORT);
                if (!navigated) {
                    setNavigated(true); // Prevent duplicate navigations
                    handleRetry();
                }
            }
        }
    }, [isConnected]);

    const handleRetry = async () => {
        if (!isConnected) {
            ToastAndroid.show(t('check_internet_connection'), ToastAndroid.SHORT);
            return;
        }

        setLoading(true);
        try {
            if (termsAccepted === 'Accepted') {
                await Promise.all([fetchData(), playDetails(), blogDetails()]);
                setLoading(false);

                switch (screen) {
                    case 'Spins':
                        navigation.replace('Spins');
                        break;
                    case 'CM Guide':
                        navigation.replace('CM Guide');
                        break;
                    case 'Tips':
                        navigation.replace('Tips');
                        break;
                    case 'Collect Spin':
                        navigation.replace('Collect Spin');
                        break;
                    default:
                        navigation.replace('Spin Master');
                        break;
                }
            } else {
                setLoading(false);
                navigation.replace('DetailsScreen');
            }
        } catch (err) {
            console.error(t('error_during_fetch'), err);
            setLoading(false);
        }
    };

    return (
        <View style={Styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.secondary} />
            ) : (
                <>
                    <Icon name='wifi' size={theme.dimensions.width * 0.4} color={theme.colors.background} />
                    <CustomText title={t('offline')} style={Styles.title} />
                    <CustomText title={t('check_internet')} style={Styles.message} />

                    <View style={{ padding: theme.dimensions.width * 0.07 }}>
                        <CustomButton
                            title={t('retry')}
                            onPress={handleRetry}
                        />
                    </View>
                </>
            )}
        </View>
    );
};

const createStyles = ({ text: { heading, subheading }, colors: { primary, secondary, background }, dimensions: { height } }) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'center',
            alignItems: 'center',
            padding: height * 0.05,
        },
        title: {
            fontSize: heading.fontSize,
            fontWeight: 'bold',
            color: background,
            marginBottom: height * 0.02,
            textTransform: 'uppercase',
        },
        message: {
            fontSize: subheading.fontSize,
            color: background,
            textAlign: 'center',
            marginBottom: height * 0.03,
            textTransform: 'uppercase',
        },
    });
};
