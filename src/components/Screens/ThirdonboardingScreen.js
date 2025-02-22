import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { CustomText } from '../../commonComponents/CommonComponent';
import { theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';

export const ThirdonboardingScreen = () => {
    const { t } = useTranslation();
    const Styles = useMemo(() => createStyles(theme), [theme]);

    const card_data = [
        {
            id: 1,
            title: t('game_installed'),
            path: require('../../../assets/Images/second.png')
        },
        {
            id: 2,
            title: t('complate_the_first_village'),
            path: require('../../../assets/Images/third.jpg')
        },
    ];

    return (
        <ScrollView contentContainerStyle={Styles.scrollViewContent}>
            {card_data.map((card, index) => (
                <View key={card.id} style={Styles.cardSection}>
                    <View style={Styles.stepWrapper}>
                        <CustomText title={`${t('step')} - ${index + 1}`} style={Styles.stepTitle} />
                    </View>
                    <CustomText title={card.title} style={Styles.cardTitleText} />
                    <View style={Styles.cardWrapper}>
                        <Image source={card.path} style={Styles.cardImage} />
                    </View>
                </View>
            ))}
            <CustomText title={t('to_receved_rewards_links')} style={Styles.bottomText} />
        </ScrollView>
    );
};

const createStyles = ({ text: { body }, colors: { primary, background, secondary }, dimensions: { width, height } }) => {
    return StyleSheet.create({
        scrollViewContent: {
            alignItems: 'center',
            paddingVertical: width * 0.05,
        },
        cardSection: {
            width: width * 0.85,
            marginBottom: width * 0.04,
            alignItems: 'flex-start',
            borderColor:primary,
            borderRadius: width * 0.03,
            backgroundColor: '#f8f9fb', 
            padding: width * 0.04,
        },
        stepTitle: {
            fontSize: body.fontSize * 1.1,
            fontWeight: '700',
            color: background,
            textAlign: 'center',
        },
        cardTitleText: {
            fontSize: body.fontSize,
            color: secondary,
            fontWeight: '600',
            marginBottom: width * 0.02,
        },
        cardWrapper: {
            borderColor: primary,
            borderWidth: 1,
            backgroundColor: background,
            elevation: 3,
            borderRadius: width * 0.02,
            shadowColor: secondary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            width: '100%',
            alignItems: 'center',
            padding: width * 0.03,
        },
        cardImage: {
            width: '100%',
            height: width * 0.4,
            resizeMode: 'contain',
            borderRadius: width * 0.02,
        },
        bottomText: {
            marginTop: height * 0.02,
            fontSize: body.fontSize,
            fontWeight: '600',
            textAlign: 'center',
            color: primary,
            paddingHorizontal: width * 0.05,
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
    });
};
