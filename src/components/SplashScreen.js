import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { CustomText } from '../commonComponents/CommonComponent';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { useDataContext } from '../service/DataContext';

export const SplashScreen = () => {
  const navigation = useNavigation();
  const { spinData, loading, error, termsAccepted } = useDataContext();
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
            navigation.replace('DetailsScreen');
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
      {/* This View is for the entire screen with a white background */}
      <FontAwesome name="skype" size={80} color="#1BA1F2" />
      <View style={styles.bottomView}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <CustomText title="Loading..." style={styles.loadingText} />
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
    backgroundColor: '#FFFFFF', // Set background color to white
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight, // Add padding for status bar on Android
  },
  bottomView: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    fontSize: 18,
    color: '#000000', // Set text color to black for better visibility on white background
    marginTop: 10,
    textAlign: 'center',
  },
});