import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CustomText } from '../../commonComponents/CommonComponent';
import { theme } from '../../theme/theme';

export const OnboardingScreen = () => {
  const Styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScrollView contentContainerStyle={Styles.scrollViewContent}>
      <View style={Styles.container}>
        <Icon name="rocket" size={70} color={theme.colors.primary} style={Styles.icon} />
        <View style={Styles.textContainer}>
          <CustomText title='Welcome to Our App!' style={Styles.titleText} />
          <CustomText
            title="Discover exciting rewards, exclusive bonuses, and a seamless gaming experience. Let's get started!"
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