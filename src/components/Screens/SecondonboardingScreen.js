import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CustomText } from '../../commonComponents/CommonComponent';
import { theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';

export const SecondOnboardingScreen = () => {
  const { t } = useTranslation();
  const Styles = useMemo(() => createStyles(theme), [theme]);

  const cardsData = [
    {
      id: 1,
      title: t('point_1'),
      description: t('point_we_provide_user_to_link'),
    },
    {
      id: 2,
      title: t('point_2'),
      description: t('provided_by_game_publisher'),
    },
    {
      id: 3,
      title: t('point_3'),
      description: t('we_aggregate_those'),
    },
  ];

  return (
    <ScrollView contentContainerStyle={Styles.scrollViewContent}>
      {cardsData.map((card) => (
        <View key={card.id} style={Styles.cardWrapper}>
          <View style={Styles.cardContainer}>
            <View style={Styles.stepWrapper}>
              <CustomText title={card.title} style={Styles.stepTitle} />
            </View>
            <CustomText title={card.description} style={Styles.cardDescription} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const createStyles = ({ text: { subheading, body }, colors: { primary, background, secondary }, dimensions: { width } }) => {
  return StyleSheet.create({
    scrollViewContent: {
      alignItems: 'center',
      paddingVertical: width * 0.05,
    },
    cardWrapper: {
      borderColor: primary,
      borderWidth: 1,
      backgroundColor: background,
      elevation: 3,
      alignItems: 'flex-start',
      marginBottom: width * 0.04,
      width: width * 0.85,
      borderRadius: width * 0.02,
      shadowColor: secondary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    cardContainer: {
      padding: width * 0.05,
    },
    cardDescription: {
      fontSize: body.fontSize,
      color: secondary,
      fontWeight: '400',
      textAlign: 'left', 
    },
    stepWrapper: {
      backgroundColor: primary,
      paddingHorizontal: width * 0.04,
      paddingVertical: width * 0.015,
      borderRadius: width * 0.05,
      marginBottom: width * 0.02,
      alignSelf: 'flex-start',
      elevation: 2,
    },
    stepTitle: {
      fontSize: body.fontSize * 1.1,
      fontWeight: '700',
      color: background,
      textAlign: 'center',
    },
  });
};
