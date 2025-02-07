import React, { useMemo } from 'react';
import { ScrollView, View, Share, StyleSheet, TouchableOpacity, Alert, Linking, ToastAndroid } from 'react-native';
import { CustomText } from '../../commonComponents/CommonComponent';
import { useDataContext } from '../../service/DataContext';
import { theme } from '../../theme/theme';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure this package is installed
import Clipboard from '@react-native-clipboard/clipboard'; // Import Clipboard
import { useNavigation } from '@react-navigation/native';

export const CollectLink = () => {
    const { isConnected } = useDataContext();
    const navigation = useNavigation();
    const Styles = useMemo(() => createStyles(theme), [theme]);
    const { collectedData } = useDataContext();

    const onShare = async (data) => {
        if (!isConnected) {
            navigation.navigate('DefaultScreen', { screen: "Collect Spin" }); // Redirect to Offline Screen
            return;
        }

        try {
            await Share.share({
                message: `Check out this link: ${data}`,
            });
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    // Function to open link with offline check
    const openLink = (url) => {
        if (!isConnected) {
            navigation.navigate('DefaultScreen', { screen: "Collect Spin" }); // Redirect to Offline Screen
            return;
        }

        if (url) {
            Linking.openURL(url).catch(() => {
                Alert.alert('Error', 'Failed to open the link');
            });
        } else {
            Alert.alert('Error', 'No URL provided');
        }
    };

    // Function to copy the coupon code to clipboard and show a toast
    const copyToClipboard = (text) => {
        Clipboard.setString(text); // Copy text to clipboard
        ToastAndroid.show('Text copied!', ToastAndroid.SHORT); // Show toast notification
    };

    return (
        <View style={Styles.container}>
            <ScrollView contentContainerStyle={Styles.scrollContainer}>
                <View style={Styles.cardContainer}>
                    <Icon name="money" size={50} color={theme.colors.secondary} style={Styles.coinIcon} />
                    <View style={Styles.contentContainer}>
                        <CustomText title={'Collect Your Rewards'} style={Styles.headerText} />
                    </View>
                    <View style={Styles.stepsBox}>
                        <CustomText title={collectedData?.rewards_text} style={Styles.problemTitle} />
                    </View>
                    <View style={Styles.stepsBox}>
                        <View style={Styles.rowContainer}>
                            <CustomText title={collectedData?.rewards_title} style={Styles.rewardTitle} />
                            <View style={Styles.separator} />
                            <CustomText title={collectedData?.rewards_date} style={Styles.rewardDate} />
                        </View>
                    </View>
                    <View style={Styles.stepsBox}>
                        <View style={Styles.couponContainer}>
                            <CustomText title={`Code: ${collectedData?.rewards_coupen_code}`} style={Styles.rewardDate} />
                            <TouchableOpacity onPress={() => copyToClipboard(collectedData?.rewards_coupen_code)}>
                                <Icon name="clipboard" size={20} color={theme.colors.secondary} style={Styles.copyIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={Styles.iconContainer}>
                <TouchableOpacity style={Styles.Sharebutton} onPress={() => onShare(collectedData?.rewards_link)}>
                    <CustomText title="Share" style={Styles.SharebuttonText} />
                </TouchableOpacity>
                <TouchableOpacity style={Styles.Collectbutton} onPress={() => openLink(collectedData?.rewards_link)}>
                    <CustomText title="Collect" style={Styles.CollectbuttonText} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = ({ text: { heading, body, subheading }, colors: { primary, secondary, background }, dimensions: { width } }) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: background,
        },
        scrollContainer: {
            padding: width * 0.03,
        },
        cardContainer: {
            marginBottom: width * 0.02,
            padding: width * 0.02,
            borderColor: primary,
            borderWidth: 1,
            borderRadius: width * 0.025,
            backgroundColor: background,
            elevation: 3,
            alignItems: 'center',
            justifyContent: 'center',
        },
        coinIcon: {
            marginBottom: 10,
        },
        contentContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerText: {
            fontSize: subheading.fontSize,
            color: secondary,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 10,
        },
        stepsBox: {
            padding: 15,
            width: '100%',
            marginTop: 10,
            borderColor: primary,
            borderWidth: 1,
            borderRadius: width * 0.025,
            backgroundColor: background,
            elevation: 3,
            alignItems: 'center',
            justifyContent: 'center',
        },
        problemTitle: {
            fontSize: body.fontSize,
            fontWeight: '600',
            textAlign: 'center',
            color: secondary,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        rewardTitle: {
            fontSize: body.fontSize,
            fontWeight: '700',
            color: secondary,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        rewardDate: {
            fontSize: body.fontSize,
            color: secondary,
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        couponContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        },
        copyIcon: {
            marginLeft: 10,
        },
        iconContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: 16,
            borderTopWidth: 1,
            borderColor: primary,
            backgroundColor: background,
        },
        Sharebutton: {
            flex: 1,
            height: 50,
            borderRadius: 5,
            backgroundColor: background,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 10,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
        },
        SharebuttonText: {
            color: secondary,
            fontSize: subheading.fontSize,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
        Collectbutton: {
            flex: 1,
            height: 50,
            borderRadius: 5,
            backgroundColor: secondary,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 10,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
        },
        CollectbuttonText: {
            color: background,
            fontSize: subheading.fontSize,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
        rowContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        },
        separator: {
            width: 2,
            height: '100%',
            backgroundColor: secondary,
            marginHorizontal: 10,
        },
    });
};

