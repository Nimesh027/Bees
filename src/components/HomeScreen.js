import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableWithoutFeedback, ToastAndroid, BackHandler, Alert, Linking } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDataContext } from '../service/DataContext';
import { theme } from '../theme/theme';
import { useTranslation } from 'react-i18next';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import NetInfo from '@react-native-community/netinfo';

const bannerAdUnitId = 'ca-app-pub-4241920534057829/5236041422';

export const HomeScreen = () => {
  const { t } = useTranslation();
  const { isConnected } = useDataContext();
  const navigation = useNavigation();
  const Styles = useMemo(() => createStyles(theme), [theme]);
  const [loadingCard, setLoadingCard] = useState(null);
  const [backPressCount, setBackPressCount] = useState(0);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(null);
  const [bannerAdLoading, setBannerAdLoading] = useState(true);
  const [showAd, setShowAd] = useState(false);
  const [navigationCount, setNavigationCount] = useState(0);

  const gameList = useMemo(() => [
    { title: 'Spins', icon: 'gift', name: t('daily_free_spin'), color: '#FF6347' },
    { title: 'CM Guide', icon: 'book', name: t('cm_guide'), color: '#6495ED' },
    { title: 'Tips', icon: 'lightbulb-o', name: t('tips_and_tricks'), color: '#008080' },
    { title: 'Privacy Policy', icon: 'info-circle', name: t('privacy_and_policy'), color: '#8A2BE2' },
  ], [t]);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setAdError(t('no_internet_connection'));
      }
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (backPressCount === 0) {
          setBackPressCount(1);
          ToastAndroid.show(t('tap_again_to_exit'), ToastAndroid.SHORT);
          setTimeout(() => setBackPressCount(0), 2000);
          return true;
        } else {
          BackHandler.exitApp();
          return true;
        }
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [backPressCount, t])
  );

  const openLink = async (url) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        throw new Error('Cannot open URL');
      }
    } catch (error) {
      Alert.alert(t('error'), t('failed_to_open_link'));
    }
  };

  const handlePress = async (screenName, index) => {
    setLoadingCard(index);

    const newCount = navigationCount + 1;
    setNavigationCount(newCount);

    if (newCount % 3 === 0) {
      setShowAd(true);
    }

    setTimeout(() => {
      if (!isConnected) {
        navigation.navigate('DefaultScreen', { screen: screenName });
      } else if (screenName === 'Privacy Policy') {
        openLink('https://coinmasterfreespin.tech/privacy-policy.php');
      } else {
        navigation.navigate(screenName);
      }
      setLoadingCard(null);
    }, 1000);
  };

  const handleAdLoad = () => {
    setAdLoaded(true);
    setAdError(null);
    setBannerAdLoading(false);
  };

  const handleAdError = (error) => {
    setAdLoaded(false);
    setAdError(`${t('ad_failed_to_load')}`);
    setBannerAdLoading(false);

    setTimeout(() => {
      setAdError(null);
    }, 30000);
  };

  return (
    <ScrollView
      contentContainerStyle={Styles.gameContainer}
      showsVerticalScrollIndicator={false}
    >
      {gameList.map((item, index) => (
        <TouchableWithoutFeedback
          key={index}
          onPress={() => handlePress(item.title, index)}
          disabled={loadingCard !== null}
        >
          <View style={[Styles.cardContainer, { backgroundColor: item.color }, loadingCard === index && Styles.dullCard]}>
            <View style={Styles.titleContainer}>
              <View style={Styles.circle}>
                <Icon name={item.icon} size={theme.dimensions.width * 0.07} color={item.color} />
              </View>
              <Text style={Styles.title}>{item.name}</Text>
              {loadingCard === index ? (
                <ActivityIndicator size="large" color="#fff" style={Styles.loadingIndicator} />
              ) : (
                <Icon name="angle-right" size={theme.dimensions.width * 0.09} color={theme.colors.background} />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      ))}

      <View style={Styles.adContainer}>
        {bannerAdLoading && (
          <View style={Styles.adPlaceholder}>
            <Text style={Styles.errorText}>Loading...</Text>
          </View>
        )}
        {!adError && (
          <BannerAd
            unitId={bannerAdUnitId}
            size={BannerAdSize.MEDIUM_RECTANGLE}
            requestOptions={{
              requestNonPersonalizedAdsOnly: false, // Allow personalized ads if compliant
              keywords: ['games', 'gaming', 'mobile gaming', 'entertainment', 'rewards', 'shopping', 'lifestyle', 'technology'],
              testDevices: ['eed37b42-00be-4416-9483-64f207f00fc5'], // Replace with your test device ID
            }}
            onAdLoaded={handleAdLoad}
            onAdFailedToLoad={handleAdError}
          />
        )}
        {adError && !bannerAdLoading && (
          <View style={Styles.adPlaceholder}>
            <Text style={Styles.errorText}>{adError}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const createStyles = ({ text: { subheading }, colors: { secondary, background, primary }, dimensions: { width } }) =>
  StyleSheet.create({
    gameContainer: {
      padding: width * 0.03,
      backgroundColor: background,
      flexGrow: 1,
      paddingBottom: width * 0.1,
    },
    cardContainer: {
      marginVertical: width * 0.01,
      borderRadius: width * 0.025,
      padding: width * 0.0375,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    dullCard: {
      opacity: 0.8,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      flex: 1,
      fontSize: subheading.fontSize,
      fontWeight: '700',
      color: '#fff',
      marginLeft: width * 0.03,
    },
    circle: {
      width: width * 0.125,
      height: width * 0.125,
      borderRadius: width * 0.0625,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      elevation: 2,
    },
    loadingIndicator: {
      opacity: 1,
      marginLeft: width * 0.03,
    },
    adContainer: {
      marginTop: width * 0.05,
      alignItems: 'center',
      padding: width * 0.03,
      minHeight: 250,
      justifyContent: 'center',
      backgroundColor: background,
      borderRadius: width * 0.02,
      marginBottom: width * 0.03,
    },
    adPlaceholder: {
      width: '100%',
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: width * 0.02,
      position: 'absolute',
    },
    errorText: {
      color: '#000',
      fontSize: subheading.fontSize * 0.8,
      textAlign: 'center',
      padding: width * 0.02,
    },
  });