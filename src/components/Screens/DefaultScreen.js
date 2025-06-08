import React, { useEffect, useState, useMemo, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CustomButton, CustomText } from '../../commonComponents/CommonComponent';
import { useNavigation } from '@react-navigation/native';
import { useDataContext } from '../../service/DataContext';
import { theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';

// Define valid routes for dynamic navigation
const VALID_ROUTES = {
  Spins: 'Spins',
  'CM Guide': 'CM Guide',
  Tips: 'Tips',
  'Collect Spin': 'Collect Spin',
  Default: 'Spin Master',
  Details: 'DetailsScreen',
};

export const DefaultScreen = ({ route }) => {
  const { t } = useTranslation();
  const Styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation();
  const { fetchData, playDetails, blogDetails, isConnected, termsAccepted } = useDataContext();
  const [loading, setLoading] = useState(false);
  const [navigated, setNavigated] = useState(false);
  const prevIsConnected = useRef(isConnected);
  const retryTimeoutRef = useRef(null);
  const { screen } = route?.params || {};

  // Debounce function to prevent rapid retry attempts
  const debounce = (func, delay) => {
    return (...args) => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      retryTimeoutRef.current = setTimeout(() => func(...args), delay);
    };
  };

  const handleRetry = debounce(async () => {
    if (!isConnected) {
      ToastAndroid.show(t('check_internet_connection'), ToastAndroid.SHORT);
      return;
    }

    if (navigated) return; // Prevent retry if already navigated

    setLoading(true);
    try {
      if (termsAccepted === 'Accepted') {
        await Promise.all([fetchData(), playDetails(), blogDetails()]);
        setNavigated(true); // Set navigated only after successful data fetch

        // Dynamic routing based on valid routes
        const targetScreen = VALID_ROUTES[screen] || VALID_ROUTES.Default;
        navigation.replace(targetScreen);
      } else {
        navigation.replace(VALID_ROUTES.Details);
      }
    } catch (err) {
      console.error(t('error_during_fetch'), err);
      ToastAndroid.show(t('error_during_fetch'), ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  }, 500); // 500ms debounce delay

  useEffect(() => {
    let isMounted = true;

    if (prevIsConnected.current !== isConnected && isMounted) {
      prevIsConnected.current = isConnected;
      if (isConnected) {
        ToastAndroid.show(t('online'), ToastAndroid.SHORT);
        if (!navigated) {
          handleRetry();
        }
      }
    }

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [isConnected, navigated, handleRetry]);

  return (
    <View style={Styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.secondary} />
      ) : (
        <>
          <Icon name="wifi" size={theme.dimensions.width * 0.4} color={theme.colors.background} />
          <CustomText title={t('offline')} style={Styles.title} />
          <CustomText title={t('check_internet')} style={Styles.message} />
          <View style={{ padding: theme.dimensions.width * 0.07 }}>
            <CustomButton title={t('retry')} onPress={handleRetry} />
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