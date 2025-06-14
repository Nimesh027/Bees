import React, { useMemo } from 'react';
import {
    View, TouchableOpacity, Text, StyleSheet,
    Alert, Linking, Share
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';

export const Menu = () => {
    const { t } = useTranslation();
    const Styles = useMemo(() => createStyles(theme), [theme]);
    const navigation = useNavigation();

    const openLink = (url) => {
        Linking.openURL(url).catch(() => {
            Alert.alert('Error', t('fail_to_open_link'));
        });
    };

    const onShare = async (data) => {
        try {
            await Share.share({
                message: `${t('check_out_this_link')} ${data}`,
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const sendFeedback = () => {
        const email = 'support@coinmasterfreespin.tech';
        const subject = 'Feedback';
        const body = 'Hello, I would like to provide the following feedback:';

        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        openLink(mailtoUrl);
    };

    const menuItems = [
        {
            id: 'language',
            title: t('select_language'),
            icon: 'language',
            action: () => navigation.navigate('Language'),
        },
        {
            id: 'share',
            title: t('share_app'),
            icon: 'share-alt',
            action: () => onShare('https://play.google.com/store/apps/details?id=com.masterspin')
        },
        {
            id: 'privacy_policy',
            title: t('privacy_and_policy'),
            icon: 'file-text-o',
            action: () => openLink('https://coinmasterfreespin.tech/privacy-policy.php')
        },
        {
            id: 'feedback',
            title: t('send_feedback'),
            icon: 'envelope',
            action: sendFeedback
        }
    ];

    return (
        <View style={Styles.container}>
            {menuItems.map(item => (
                <TouchableOpacity
                    key={item.id}
                    style={Styles.cardContainer}
                    onPress={item.action}
                >
                    <View style={Styles.contentContainer}>
                        <FontAwesome
                            name={item.icon}
                            size={theme.dimensions.width * 0.08}
                            color={theme.colors.secondary}
                            style={Styles.icon}
                        />
                        <View style={Styles.textContainer}>
                            <Text style={Styles.title}>{item.title}</Text>
                        </View>
                        <FontAwesome
                            name="angle-right"
                            size={theme.dimensions.width * 0.06}
                            color={theme.colors.secondary}
                        />
                    </View>
                </TouchableOpacity>
            ))}

        </View>
    );
};

const createStyles = ({ colors, dimensions }) => {
    const { width, height } = dimensions;
    return StyleSheet.create({
        container: {
            flex: 1,
            paddingVertical: height * 0.02,
            backgroundColor: colors.background,
            paddingHorizontal: width * 0.03,
        },
        cardContainer: {
            marginBottom: height * 0.015,
            padding: width * 0.02,
            borderColor: colors.primary,
            borderWidth: 1,
            borderRadius: width * 0.025,
            backgroundColor: colors.background,
            elevation: 3,
        },
        contentContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        icon: {
            marginRight: width * 0.02,
        },
        textContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        title: {
            fontSize: width * 0.05,
            fontWeight: 'bold',
            color: colors.secondary,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalContent: {
            backgroundColor: colors.background,
            padding: width * 0.05,
            borderRadius: width * 0.05,
            width: '85%',
            alignItems: 'center',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'center', // Center the title
            alignItems: 'center',
            width: '100%',
            marginBottom: height * 0.02,
            position: 'relative', // For absolute positioning of the close icon
        },
        modalTitle: {
            fontSize: width * 0.06,
            fontWeight: 'bold',
            color: colors.primary,
            textAlign: 'center', // Center the text
        },
        closeIcon: {
            position: 'absolute', // Position the close icon absolutely
            right: 0, // Align to the right
        },
        headerLine: {
            width: '100%',
            height: 1,
            backgroundColor: colors.primary,
            marginBottom: height * 0.02,
        },
        starContainer: {
            flexDirection: 'row',
            marginBottom: height * 0.02,
        },
        star: {
            marginHorizontal: width * 0.015, // Added spacing between stars
        },
        textArea: {
            width: '100%',
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: width * 0.025,
            padding: width * 0.03,
            height: height * 0.12,
            textAlignVertical: 'top',
            marginBottom: height * 0.015,
            color: colors.secondary,
        },
        submitButton: {
            backgroundColor: colors.primary,
            paddingVertical: height * 0.015,
            paddingHorizontal: width * 0.1,
            borderRadius: width * 0.025,
        },
        submitButtonText: {
            color: '#fff',
            fontWeight: 'bold',
        },
    });
};

export default Menu;
