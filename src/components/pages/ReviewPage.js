import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CustomText } from '../../commonComponents/CommonComponent';
import { theme } from '../../theme/theme';

export const ReviewPage = () => {
    const Styles = useMemo(() => createStyles(theme), [theme]);
    const navigation = useNavigation();

    const cardData = [
        { title: 'Share', iconName: 'share-alt', screenName: 'ShareScreen' },
        { title: 'Feedback', iconName: 'comments-o', screenName: 'FeedbackScreen' },
        { title: 'Privacy Policy', iconName: 'info-circle', screenName: 'PrivacyPolicy' },
    ];

    const openLink = (url) => {
        if (url) {
            Linking.openURL(url).catch(() => {
                Alert.alert('Error', 'Failed to open the link');
            });
        } else {
            Alert.alert('Error', 'No URL provided');
        }
    };

    const handlePress = (screenName) => {
        if (screenName === 'PrivacyPolicy') {
            openLink('https://coinmasterfreespin.tech/privacy-policy.php')
        } else {
            // navigation.navigate(screenName);
            console.log(screenName)
        }
    };

    return (
        <View style={Styles.container}>
            <View style={Styles.subsContainer}>
                {cardData.map((card, index) => (
                    <TouchableOpacity
                        key={index}
                        style={Styles.subsBox}
                        onPress={() => handlePress(card.screenName)}
                    >
                        <View style={Styles.subsContent}>
                            <Icon
                                name={card.iconName}
                                size={theme.dimensions.width * 0.08}
                                color={theme.colors.secondary}
                                style={Styles.iconWrapper}
                            />
                            <CustomText title={card.title} style={Styles.stepText} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const createStyles = ({ text: { body }, colors: { primary, secondary, accent }, dimensions: { width } }) => {

    return StyleSheet.create({
        container: {
            width: '100%',
            marginTop: width * 0.015,
        },
        subsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',  // Space between buttons
            width: '100%',
            paddingHorizontal: width * 0.03,
        },
        subsBox: {
            width: '32%',  // Set to 30% to fit three buttons in a row
            backgroundColor: primary,
            borderRadius: width * 0.025,
            padding: width * 0.02,
            alignItems: 'center',
            elevation: 3,
        },
        subsContent: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconWrapper: {
            marginBottom: width * 0.02,
        },
        stepText: {
            color: secondary,
            fontSize: body.fontSize,
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'uppercase',
        },
    });
};
