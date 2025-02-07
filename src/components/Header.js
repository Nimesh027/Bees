import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CustomText } from '../commonComponents/CommonComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import { theme } from '../theme/theme';

export const Header = ({ title }) => {
    const Styles = useMemo(() => createStyles(theme), [theme]);
    const navigation = useNavigation();
    const route = useRoute();

    const handleGoBack = () => {
        navigation.goBack(); 
    };

    const handleList = () => {
        navigation.navigate('Menu')
    }

    const isHomeScreen = route.name === 'Spin Master';
    const isMenu = route.name === 'Menu';

    return (
        <View style={Styles.headerContainer}>
            {!isHomeScreen && (
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon
                        name="arrow-left"
                        size={theme.dimensions.width * 0.07}
                        color={theme.colors.background}
                    />
                </TouchableOpacity>
            )}
            <View style={Styles.titleContainer}>
                <CustomText title={title} style={Styles.title} />
            </View>
            {!isMenu && <TouchableOpacity onPress={handleList}>
                <Icon
                    name="cog"
                    size={theme.dimensions.width * 0.07}
                    color={theme.colors.background}
                />
            </TouchableOpacity>}
        </View>
    );
};

const createStyles = ({ text: { heading }, colors: { primary, background }, dimensions: { width, height } }) => {

    return StyleSheet.create({
        headerContainer: {
            backgroundColor: primary,
            height: height * 0.085,
            paddingHorizontal: width * 0.04,
            flexDirection: 'row',
            alignItems: 'center',
        },
        titleContainer: {
            flex: 1, 
            alignItems: 'center', 
        },
        title: {
            fontSize: heading.fontSize,
            textTransform: 'uppercase',
            letterSpacing: 2,
            textAlign: 'center', 
            color: background
        },
    });
}
