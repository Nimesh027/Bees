import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Linking, BackHandler, ToastAndroid, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import { theme } from '../theme/theme';
import { CustomButton } from '../commonComponents/CommonComponent';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

export const DetailsScreen = () => {
  const { t } = useTranslation();
  const Styles = useMemo(() => createStyles(theme), [theme]);
  const [backPressCount, setBackPressCount] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (backPressCount === 0) {
          setBackPressCount(1);
          ToastAndroid.show(t('tap_again_to_exit'), ToastAndroid.SHORT);

          setTimeout(() => {
            setBackPressCount(0);
          }, 2000);
          return true;
        } else if (backPressCount === 1) {
          BackHandler.exitApp();
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove();
    }, [backPressCount])
  );

  const openLink = (url) => {
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert(t('error'), t('failed_to_open_link'));
      });
    } else {
      Alert.alert(t('error'), t('no_url_rovide'));
    }
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.topView}>
        <View style={Styles.circleContainer}>
          <View style={Styles.outerCircle}>
            <View style={Styles.middleCircle}>
              <View style={Styles.innerCircle}>
                <Text style={Styles.iconText}>💬</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={Styles.welcomeText}>{t('welcom_to_paradise')}</Text>
        <View style={Styles.lineContainer}>
          <View style={Styles.lineone} />
          <View style={Styles.linetwo} />
          <View style={Styles.linethree} />
        </View>
      </View>

      <View style={Styles.bottomView}>
        <View style={Styles.checkboxContainer}>
          <CheckBox
            value={isChecked}
            onValueChange={setIsChecked}
            tintColors={{ true: '#8A2BE2', false: '#8A2BE2' }}
            style={Styles.checkbox}
          />
          <Text style={Styles.checkboxText}>{t('i_agrre_to_the')} </Text>
          <TouchableOpacity onPress={() => openLink('https://coinmasterfreespin.tech/privacy-policy.php')}>
            <Text style={Styles.privacyLink}>{t('privacy_policy')}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <CustomButton
            title={t('next')}
            routeName="WelcomeScreen"
            disabled={!isChecked} 
            style={[Styles.button, !isChecked && Styles.disabledButton]} 
          />
        </View>
      </View>
    </View>
  );
};

const createStyles = ({ text: { body, subheading }, colors: { primary, background } }) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: background,
      justifyContent: 'space-between',
    },
    topView: {
      alignItems: 'center',
      marginTop: height * 0.15,
    },
    circleContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: height * 0.02,
    },
    outerCircle: {
      width: width * 0.4,
      height: width * 0.4,
      borderRadius: width * 0.2,
      borderWidth: 2,
      borderColor: '#8A2BE2',
      alignItems: 'center',
      justifyContent: 'center',
    },
    middleCircle: {
      width: width * 0.3,
      height: width * 0.3,
      borderRadius: width * 0.15,
      borderWidth: 3,
      borderColor: primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerCircle: {
      width: width * 0.2,
      height: width * 0.2,
      borderRadius: width * 0.1,
      backgroundColor: '#C28CFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconText: {
      fontSize: width * 0.06,
      color: background,
    },
    welcomeText: {
      fontSize: subheading.fontSize,
      color: '#757575',
      marginTop: height * 0.01,
      letterSpacing: width * 0.005,
    },
    lineContainer: {
      marginVertical: height * 0.01,
    },
    lineone: {
      width: width * 0.4,
      height: height * 0.005,
      backgroundColor: '#8A2BE2',
      marginTop: 8
    },
    linetwo: {
      width: width * 0.4,
      height: height * 0.004,
      backgroundColor: '#8A2BE2',
      marginVertical: 8
    },
    linethree: {
      width: width * 0.4,
      height: height * 0.002,
      backgroundColor: '#C28CFF',
    },
    bottomView: {
      alignItems: 'center',
      marginBottom: height * 0.1,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: height * 0.02,
    },
    checkbox: {
      marginRight: 5,
    },
    checkboxText: {
      fontSize: body.fontSize + 3,
      color: '#757575',
    },
    privacyLink: {
      fontSize: width * 0.035,
      color: '#8A2BE2',
      textDecorationLine: 'underline',
    },
    button: {
      backgroundColor: '#8A2BE2',
      paddingVertical: height * 0.008,
      paddingHorizontal: width * 0.1,
      borderRadius: width * 0.02,
      alignItems: 'center',
    },
    disabledButton: {
      backgroundColor: '#E0E0E0',
    },
    buttonText: {
      color: background,
      fontSize: width * 0.045,
    },
  });
};
