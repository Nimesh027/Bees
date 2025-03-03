import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableWithoutFeedback, ToastAndroid, BackHandler, Alert, Linking } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDataContext } from '../service/DataContext';
import { theme } from '../theme/theme';
import { useTranslation } from 'react-i18next';

export const HomeScreen = () => {
  const { t } = useTranslation();
  const { isConnected } = useDataContext();
  const navigation = useNavigation();
  const Styles = useMemo(() => createStyles(theme), [theme]);
  const [loadingCard, setLoadingCard] = useState(null);
  const [backPressCount, setBackPressCount] = useState(0);

  const gameList = useMemo(() => [
    { title: 'Spins', icon: 'gift', name: t('daily_free_spin'), color: "#FF6347" },
    { title: 'CM Guide', icon: 'book', name: t('cm_guide'), color: "#6495ED" },
    { title: 'Tips', icon: 'lightbulb-o', name: t('tips_and_tricks'), color: "#008080" },
    { title: 'Privacy Policy', icon: 'info-circle', name: t('privacy_and_policy'), color: "#8A2BE2" },
  ], [t]);

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
    }, [backPressCount])
  );

  const openLink = (url) => {
    Linking.openURL(url).catch(() => Alert.alert('Error', t('failed_to_open_link')));
  };

  const handlePress = (screenName, index) => {
    setLoadingCard(index);

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

  return (
    <ScrollView contentContainerStyle={Styles.gameContainer}>
      {gameList.map((item, index) => (
        <TouchableWithoutFeedback key={index} onPress={() => handlePress(item.title, index)}>
          <View style={[Styles.cardContainer, { backgroundColor: item.color }, loadingCard === index && Styles.dullCard]}>
            <View style={Styles.titleContainer}>
              <View style={Styles.circle}>
                <Icon name={item.icon} size={theme.dimensions.width * 0.07} color={item?.color} />
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
    </ScrollView>
  );
};

const createStyles = ({ text: { subheading }, colors: { secondary, background }, dimensions: { width } }) =>
  StyleSheet.create({
    gameContainer: {
      padding: width * 0.03,
      backgroundColor: background,
      flex: 1
    },
    cardContainer: {
      marginVertical: width * 0.01,
      borderRadius: width * 0.025,
      padding: width * 0.0375,
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
    },
    loadingIndicator: {
      opacity: 1,
      marginLeft: width * 0.03,
    },
  });
