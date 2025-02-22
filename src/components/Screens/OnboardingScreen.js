import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CustomText } from '../../commonComponents/CommonComponent';
import { theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';

export const OnboardingScreen = () => {
  const { t } = useTranslation();
  const Styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScrollView contentContainerStyle={Styles.scrollViewContent}>
      <View style={Styles.container}>
        <Icon name="rocket" size={70} color={theme.colors.primary} style={Styles.icon} />
        <View style={Styles.textContainer}>
          <CustomText title={t('welcome_to_our_app')} style={Styles.titleText} />
          <CustomText
            title={t('discover_existinf_rewards')}
            style={Styles.subText}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = ({ text: { subheading, body }, colors: { secondary, background, primary }, dimensions: { height, width } }) => {
  return StyleSheet.create({
    scrollViewContent: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: width * 0.05,
    },
    container: {
      padding: width * 0.05,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      marginBottom: height * 0.02,
    },
    textContainer: {
      alignItems: 'center',
    },
    titleText: {
      fontSize: subheading.fontSize + 6,
      fontWeight: '700',
      color: primary,
      textAlign: 'center',
      textTransform: 'uppercase',
      marginBottom: height * 0.015,
      letterSpacing: 1.5,
    },
    subText: {
      fontSize: body.fontSize,
      color: secondary,
      textAlign: 'center',
      marginTop: height * 0.01,
      paddingHorizontal: width * 0.05,
      fontWeight: '500',
    },
  });
};