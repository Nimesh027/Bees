import React, { useState, useMemo } from 'react';
import { Text, StyleSheet, Share, TouchableOpacity, Image, View, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNetworkStatus } from '../service/hooks/useNetworkStatus';
import { useDataContext } from '../service/DataContext';
import { theme } from '../theme/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

export const CustomText = ({ title, style, ...props }) => {
    const Styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <Text style={[Styles.defaultText, style]} {...props}>
            {title}
        </Text>
    );
};

export const CustomCard = ({ id, title, path }) => {

    const Styles = useMemo(() => createStyles(theme), [theme]);

    return (

        <View style={Styles.problemContainer}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={Styles.problemTitle}>{id}. </Text>
                <CustomText title={title} style={Styles.problemTitle} />
            </View>
            <View style={Styles.stepsBox}>
                <Image source={path} style={Styles.logo} />
            </View>
        </View>
    );
};

export const CardButton = ({ title, iconName, style, isMainWrapper }) => {

    const Styles = useMemo(() => createStyles(theme), [theme]);
    const navigation = useNavigation();
    const isConnected = useNetworkStatus();

    const handlePress = (screenName) => {
        if (!isConnected) {
            navigation.navigate('DefaultScreen', { screen: screenName });
        } else {
            navigation.navigate(screenName);
        }
    };

    return (
        <TouchableOpacity style={[Styles.subsBox, style]} onPress={() => handlePress(title)}>
            <View style={Styles.subsContent}>
                <View style={Styles.iconWrapper}>
                    <Icon name={iconName} size={theme.dimensions.width * 0.1} color={theme.colors.secondary} />
                </View>
                <View style={Styles.textWrapper}>
                    <CustomText title={title} style={Styles.stepText} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export const CustomButton = ({ title, routeName, ...props }) => {
    const { t } = useTranslation();
    const isConnected = useNetworkStatus();
    const navigation = useNavigation();
    const Styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <TouchableOpacity
            style={Styles.navigationButton}
            onPress={() => {
                if (routeName && isConnected) {
                    navigation.replace(routeName);
                    ToastAndroid.show(t('t_and_c'), ToastAndroid.SHORT);
                } else {
                    navigation.replace('DefaultScreen');
                }
            }}
            {...props}
        >
            <CustomText title={title} style={Styles.buttonText} />
        </TouchableOpacity>
    );
};

export const DailyBonus = ({ data }) => {
    const { t } = useTranslation();
    const { isConnected, loadData } = useDataContext();
    const navigation = useNavigation();
    const Styles = createStyles(theme);

    const handleCard = () => {
        if (!isConnected) {
            navigation.replace('DefaultScreen', { screen: "Spins" });
            return;
        }
        if (data) {
            loadData(data);
            navigation.navigate('Collect Spin');
        } else {
            Alert.alert(t('no_data_avilable_to_load'));
        }
    };

    return (
        <View style={Styles.cardContainer}>
            <TouchableOpacity style={Styles.contentContainer} onPress={handleCard}>
                <Image source={require("../../assets/Images/SpinLogoPNG.png")} style={Styles.coinIcon} resizeMode="contain" />
                {/* <Icon name="money" size={50} color={theme.colors.primary} style={Styles.coinIcon} /> */}
                <View style={Styles.textContainer}>
                    <Text style={Styles.title}>{data?.rewards_title?.replace(/Spin Bonus/g, t('spin_bonus')) || t('no_title_available')}</Text>
                    <Text style={Styles.date}>{data?.rewards_date || t('no_date_available')}</Text>
                </View>
                <View style={Styles.arrowButton}>
                    <Icon name="angle-right" size={30} color={theme.colors.secondary} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

export const CustomTips = ({ id, question, answer }) => {

    const [isAnswerVisible, setIsAnswerVisible] = useState(false);
    const Styles = useMemo(() => createStyles(theme), [theme]);

    const toggleAnswerVisibility = () => {
        setIsAnswerVisible(!isAnswerVisible);
    };

    return (
        <>
            <TouchableOpacity style={Styles.problemContainer} onPress={toggleAnswerVisibility}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'center', justifyContent: 'space-between' }}>
                    <Text style={Styles.problemTitle}>{id}. {question}</Text>

                    <FontAwesome
                        name={!isAnswerVisible ? "angle-right" : "angle-down"}
                        size={theme.dimensions.width * 0.07}
                        color={theme.colors.secondary}
                    />
                </View>
            </TouchableOpacity>
            {isAnswerVisible && (<View style={[Styles.stepsBox, { paddingHorizontal: theme.dimensions.width * 0.025 }]}>
                <CustomText title={`-- ${answer}`} style={Styles.answer} />
            </View>)}
        </>

    );
};


const createStyles = ({ text: { subheading, body }, colors: { primary, secondary, accent, background }, dimensions: { width, height } }) => {

    return StyleSheet.create({
        defaultText: {
            fontSize: body.fontSize,
            color: secondary,
            fontWeight: 'bold',
        },
        problemContainer: {
            marginBottom: width * 0.02,
            padding: width * 0.02,
            borderColor: primary,
            borderWidth: 1,
            borderRadius: width * 0.025,
            backgroundColor: background,
            elevation: 3,
        },
        problemTitle: {
            fontSize: body.fontSize * (width / 375),
            fontWeight: '600',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 0.1,
            color: secondary,
        },
        answer: {
            marginBottom: width * 0.025,
            fontSize: body.fontSize,
            fontWeight: '500',
            textAlign: 'left',
            textTransform: 'uppercase',
            letterSpacing: 0.1,
            color: secondary,
            marginTop: height * 0.008,
            lineHeight: 20,
        },
        stepsBox: {
            marginBottom: width * 0.02,
            padding: width * 0.02,
            borderColor: primary,
            borderWidth: 1,
            borderRadius: width * 0.025,
            backgroundColor: background,
            elevation: 3,
        },
        logo: {
            width: width * 0.8,
            height: width * 0.5,
            resizeMode: 'contain',
        },
        navigationButton: {
            height: width * 0.13,
            width: width * 0.4,
            borderRadius: 5,
            backgroundColor: secondary,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
        },
        buttonText: {
            color: background,
            fontWeight: 'bold',
            fontSize: body.fontSize,
            padding: width * 0.02,
            textTransform: 'uppercase',
        },
        subsBox: {
            width: '48%',
            backgroundColor: primary,
            borderRadius: width * 0.025,
            padding: width * 0.04,
            alignItems: 'center',
            elevation: 3,
            marginVertical: width * 0.02,
        },
        subsContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
        },
        iconWrapper: {
            width: width * 0.15,
            alignItems: 'center',
            justifyContent: 'center',
        },
        textWrapper: {
            flex: 1,
            justifyContent: 'center',
        },
        stepText: {
            color: secondary,
            fontSize: subheading.fontSize,
            fontWeight: '700',
            textAlign: 'left',
            textTransform: 'uppercase',
        },
        toggleIcon: {
            fontSize: subheading.fontSize,
            fontWeight: 'bold',
            color: primary,
            lineHeight: (width * 0.08) * 0.8,
        },
        cardContainer: {
            marginBottom: width * 0.02,
            padding: width * 0.02,
            borderColor: primary,
            borderWidth: 1,
            borderRadius: width * 0.025,
            backgroundColor: background,
            elevation: 3,
        },
        contentContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            textAlign: 'center',
            justifyContent: 'space-between',
        },
        coinIcon: {
            marginRight: width * 0.02,
            width:50,
            height:50
        },
        textContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        title: {
            fontSize: 16,
            color: secondary,
            fontWeight: 'bold',
        },
        date: {
            fontSize: 14,
            color: secondary,
        },
        arrowButton: {
            width: width * 0.1,
            height: height * 0.05,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
};
