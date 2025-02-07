import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CustomText } from '../../commonComponents/CommonComponent';
import { theme } from '../../theme/theme';

export const SecondOnboardingScreen = () => {
  const Styles = useMemo(() => createStyles(theme), [theme]);

  const cardsData = [
    {
      id: 1,
      title: 'Point-1',
      description: 'We provide users with links to receive CoinMaster game rewards.',
    },
    {
      id: 2,
      title: 'Point-2',
      description: 'These links are provided by the game publisher Coin Master - Moon Active to give players spins and coins in the game!',
    },
    {
      id: 3,
      title: 'Point-3',
      description: 'We aggregate those links to save players from wasting time searching and getting confused with repeated links!',
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
