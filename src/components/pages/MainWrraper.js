import React, { useMemo, useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CustomText } from '../../commonComponents/CommonComponent';
import { useNavigation } from '@react-navigation/native';
import { useDataContext } from '../../service/DataContext';
import { theme } from '../../theme/theme';
Icon.loadFont();

export const MainWrraper = () => {
    const { isConnected } = useDataContext();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);

    const Styles = useMemo(() => createStyles(theme), [theme]);

    const handlePress = useCallback((screenName) => {
        setLoading(true);

        setTimeout(() => {
            if (!isConnected) {
                navigation.navigate('DefaultScreen', { screen: screenName });
            } else {
                navigation.navigate(screenName);
            }
            setLoading(false);
        }, 1000); 
    }, [isConnected, navigation]);

    return (
        <View style={Styles.container}>
            <View style={Styles.subsContainer}>
                <TouchableOpacity
                    style={Styles.subsBox}
                    onPress={() => handlePress('Spins')}
                    accessibilityLabel="Daily Free Spin"
                >
                    <View style={Styles.subsContent}>
                        {loading ? (
                            <ActivityIndicator size="large" color={theme.colors.secondary} />
                        ) : (
                            <>
                                <Icon
                                    name='refresh'
                                    size={theme.dimensions.width * 0.21}
                                    color={theme.colors.secondary}
                                    style={Styles.iconWrapper}
                                />
                                <CustomText title='Daily Free Spin' style={Styles.stepText} />
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = ({ text: { subheading }, colors: { primary, secondary, accent }, dimensions: { width } }) => {
    return StyleSheet.create({
        container: {
            width: '100%',
        },
        subsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            width: '100%',
            paddingHorizontal: width * 0.03,
        },
        subsBox: {
            width: '100%',
            backgroundColor: primary,
            borderRadius: width * 0.025,
            padding: width * 0.04,
            alignItems: 'center',
            elevation: 3,
            marginVertical: width * 0.02,
        },
        subsContent: {
            alignItems: 'center',
            justifyContent: 'center',
            height: width * 0.25, 
            width: '100%', 
        },
        iconWrapper: {
            marginBottom: width * 0.02,
        },
        stepText: {
            color: secondary,
            fontSize: subheading.fontSize,
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'uppercase',
        },
    });
};
