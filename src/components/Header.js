import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CustomText } from '../commonComponents/CommonComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { useDataContext } from '../service/DataContext';
import { useTranslation } from 'react-i18next';

export const Header = ({ title }) => {
    const { t } = useTranslation();
    const Styles = useMemo(() => createStyles(theme), [theme]);
    const navigation = useNavigation();
    const { termsAccepted } = useDataContext();
    const route = useRoute();
    const routeTitleMapping = {
        "SplashScreen": "splash_screen",
        "WelcomeScreen": "welcome_screen",
        "DetailsScreen": "details_screen",
        "Spin Master": "spin_master",
        "CM Guide": "cm_guide",
        "Tips": "tips",
        "Spins": "spins",
        "Collect Spin": "collect_spin",
        "Settings": "settings",
        "DefaultScreen": "default_screen",
        "ErrorScreen": "error_screen",
        "Language": "language"
    };

    const localizedTitle = t(routeTitleMapping[title] || title);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleList = () => {
        navigation.navigate('Settings');
    };

    const isHomeScreen = route.name === 'Spin Master';
    const isMenu = route.name === 'Settings';

    return (
        <View style={Styles.headerContainer}>
            <View style={Styles.iconContainer}>
                {!isHomeScreen && termsAccepted && (
                    <TouchableOpacity onPress={handleGoBack}>
                        <Icon
                            name="angle-left"
                            size={theme.dimensions.width * 0.07}
                            color={theme.colors.background}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <View style={Styles.titleContainer}>
                <CustomText title={localizedTitle} style={Styles.title} />
            </View>

            <View style={Styles.iconContainer}>
                {!isMenu && termsAccepted && (
                    <TouchableOpacity onPress={handleList}>
                        <Icon
                            name="cog"
                            size={theme.dimensions.width * 0.07}
                            color={theme.colors.background}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const createStyles = ({ text: { subheading, body }, colors: { primary, background }, dimensions: { width, height } }) => {
    return StyleSheet.create({
        headerContainer: {
            backgroundColor: primary,
            height: height * 0.085,
            paddingHorizontal: width * 0.04,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        iconContainer: {
            width: width * 0.1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        titleContainer: {
            flex: 1,
            alignItems: 'center',
        },
        title: {
            fontSize: subheading.fontSize * 1.1,
            textTransform: 'uppercase',
            letterSpacing: 2,
            color: background,
        },
        saveButtonContainer: {
            width: width * 0.1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        saveButton: {
            backgroundColor: background,
            paddingVertical: height * 0.007,
            paddingHorizontal: width * 0.04,
            borderRadius: width * 0.02,
            alignItems: 'center',
            justifyContent: 'center',
            height: height * 0.045,
            minWidth: width * 0.15,
        },
        saveText: {
            fontSize: body.fontSize,
            fontWeight: '600',
            color: primary,
            textAlign: 'center',
        },
    });
};


