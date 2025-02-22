import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet, Platform, Image } from 'react-native';
import { CustomText } from '../commonComponents/CommonComponent';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { useDataContext } from '../service/DataContext';
import { useTranslation } from 'react-i18next';

export const SplashScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { language, spinData, loading, error, termsAccepted } = useDataContext();
  const timeoutRef = useRef(null);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    const handleNavigation = () => {
      if (!hasNavigated) {
        if (error) {
          if (error === 'Network Error') {
            timeoutRef.current = setTimeout(() => {
              navigation.replace('DefaultScreen');
              setHasNavigated(true);
            }, 2000);
          } else {
            navigation.replace('ErrorScreen');
            setHasNavigated(true);
          }
        } else if (!loading && spinData) {
          if (termsAccepted === 'Accepted') {
            navigation.replace('Spin Master');
          } else {
            navigation.replace('Language');
          }
          setHasNavigated(true);
        }
      }
    };

    handleNavigation();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [spinData, loading, error, termsAccepted, navigation, hasNavigated]);

  return (
    <View style={styles.background}>
      {/* Replacing FontAwesome with an Image */}
      <Image source={require("../../assets/Images/MainLogoPNG.png")} style={styles.logo} resizeMode="contain" />
      
      <View style={styles.bottomView}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <CustomText title={`${t('loading')}...`} style={styles.loadingText} />
        {error && error !== 'Network Error' && (
          <CustomText title={`Error: ${error}`} style={styles.loadingText} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight, 
  },
  logo: {
    width: 120,  // Same size as the previous icon
    height: 120,
  },
  bottomView: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    fontSize: 18,
    color: '#000000', 
    marginTop: 10,
    textAlign: 'center',
  },
});

