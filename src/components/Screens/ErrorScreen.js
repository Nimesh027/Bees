import React, { useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CustomText } from '../../commonComponents/CommonComponent';
import { theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';

export const ErrorScreen = () => {
    const { t } = useTranslation();
    const Styles = useMemo(() => createStyles(theme), [theme]);
    return (
        <View style={Styles.container}>
            <Icon name='envelope' size={theme.dimensions.width * 0.4} color={theme.colors.secondary} />
            <CustomText title={t('error')} style={Styles.title} />
            <CustomText title={t('somethinf_went_wrong')} style={Styles.message} />
        </View>
    )
}

const createStyles = ({ text: { heading, subheading }, colors: { primary, secondary, background }, dimensions: { height } }) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'center',
            alignItems: 'center',
            padding: height * 0.05,
        },
        title: {
            fontSize: heading.fontSize,
            fontWeight: 'bold',
            color: background,
            marginBottom: height * 0.02,
            textTransform: 'uppercase',
        },
        message: {
            fontSize: subheading.fontSize,
            color: background,
            textAlign: 'center',
            marginBottom: height * 0.03,
            textTransform: 'uppercase',
        },
    });
};
