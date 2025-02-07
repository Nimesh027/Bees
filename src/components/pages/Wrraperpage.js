import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { CardButton } from '../../commonComponents/CommonComponent';
import { theme } from '../../theme/theme';

export const Wrraperpage = () => {
  const Styles = useMemo(() => createStyles(theme), [theme]);

  const cardData = [
    { title: 'CM Guide', iconName: 'book' },
    { title: 'Tips', iconName: 'lightbulb-o' },
  ];

  return (
    <View style={Styles.container}>
      <View style={Styles.subsContainer}>

        <View style={Styles.row}>
          {cardData.map((card, index) => (
            <CardButton
              key={index}
              title={card.title}
              iconName={card.iconName}
              isMainWrapper={false}
              style={Styles.halfWidthCard}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const createStyles = ({ dimensions: { width } }) => {
  return StyleSheet.create({
    container: {
      width: '100%',
    },
    subsContainer: {
      paddingHorizontal: width * 0.03,
    },
    fullWidthCard: {
      width: '100%', // Full width for the first card
      // marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    halfWidthCard: {
      width: '49%', // Each of the two cards takes up 48% of the width
    },
  });
};
