import React, { useMemo, useEffect, useState, useRef } from 'react';
import { ScrollView, View, Share, StyleSheet, TouchableOpacity, Alert, Linking, ToastAndroid } from 'react-native';
import { CustomText } from '../../commonComponents/CommonComponent';
import { useDataContext } from '../../service/DataContext';
import { theme } from '../../theme/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BannerAd, BannerAdSize, TestIds, RewardedAd, RewardedAdEventType, AdEventType } from 'react-native-google-mobile-ads';
import NetInfo from '@react-native-community/netinfo';

// Ad Configuration
const bannerAdUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-4241920534057829/5350998591';
const rewardedAdUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-4241920534057829/8764222895';

export const CollectLink = () => {
    const { t } = useTranslation();
    const { isConnected, checkNetworkConnection } = useDataContext();
    const navigation = useNavigation();
    const Styles = useMemo(() => createStyles(theme), [theme]);
    const { collectedData } = useDataContext();
    const [bannerAdError, setBannerAdError] = useState(false);
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    const currentActionRef = useRef(null);
    const currentDataRef = useRef(null);
    const rewardedAdRef = useRef(null);
    const isMountedRef = useRef(true);

    const initializeRewardedAd = () => {
        // Clean up previous ad if exists
        if (rewardedAdRef.current) {
            const ad = rewardedAdRef.current.ad;
            ad.removeAllListeners(RewardedAdEventType.LOADED);
            ad.removeAllListeners(RewardedAdEventType.EARNED_REWARD);
            ad.removeAllListeners(AdEventType.CLOSED);
            ad.removeAllListeners(AdEventType.ERROR);
        }

        // Create new rewarded ad instance
        const ad = RewardedAd.createForAdRequest(rewardedAdUnitId, {
            requestNonPersonalizedAdsOnly: true,
            keywords: ['rewards', 'coupons', 'bonus'],
        });

        // Set up event listeners
        const loadedListener = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
            console.log('Rewarded ad loaded');
        });

        const earnedListener = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
            console.log('User earned reward');
        });

        const closedListener = ad.addAdEventListener(AdEventType.CLOSED, () => {
            console.log('Ad closed');
            if (!isMountedRef.current) return;
            
            // Only perform action after user manually closes the ad
            performActionAfterAd();
            // Prepare for next ad
            initializeRewardedAd();
            setIsProcessingAction(false);
        });

        const errorListener = ad.addAdEventListener(AdEventType.ERROR, (error) => {
            if (!isMountedRef.current) return;
            
            console.log('Rewarded ad error:', error.message);
            // If ad fails to load, perform action immediately
            performActionAfterAd();
            setIsProcessingAction(false);
            // Try to load another ad for next time
            initializeRewardedAd();
        });

        // Start loading the ad
        ad.load();

        rewardedAdRef.current = {
            ad,
            listeners: {
                loaded: loadedListener,
                earned: earnedListener,
                closed: closedListener,
                error: errorListener
            }
        };
    };

    // Initialize rewarded ad on component mount
    useEffect(() => {
        isMountedRef.current = true;
        initializeRewardedAd();
        
        return () => {
            // Clean up on unmount
            isMountedRef.current = false;
            if (rewardedAdRef.current) {
                const { ad, listeners } = rewardedAdRef.current;
                ad.removeAllListeners(RewardedAdEventType.LOADED, listeners.loaded);
                ad.removeAllListeners(RewardedAdEventType.EARNED_REWARD, listeners.earned);
                ad.removeAllListeners(AdEventType.CLOSED, listeners.closed);
                ad.removeAllListeners(AdEventType.ERROR, listeners.error);
            }
        };
    }, []);

    const checkNetworkBeforeAction = async () => {
        try {
            const state = await NetInfo.fetch();
            if (!state.isConnected) {
                navigation.replace('DefaultScreen', { screen: "Collect Spin" });
                return false;
            }
            return true;
        } catch (error) {
            console.log('Network check error:', error);
            navigation.replace('DefaultScreen', { screen: "Collect Spin" });
            return false;
        }
    };

    const performActionAfterAd = async () => {
        const action = currentActionRef.current;
        const data = currentDataRef.current;

        if (!data) {
            Alert.alert(t('error'), t('no_data_provided'));
            return;
        }

        const hasNetwork = await checkNetworkBeforeAction();
        if (!hasNetwork) return;

        try {
            if (action === 'share') {
                await handleShare(data);
            } else if (action === 'collect') {
                await handleCollect(data);
            }
        } catch (error) {
            console.log('Action error:', error.message);
            Alert.alert(t('error'), t('action_failed'));
        }
    };

    const handleShare = async (data) => {
        try {
            const result = await Share.share({
                message: `${t('check_out_this_link')} ${data}`,
            });

            if (result.action === Share.sharedAction) {
                ToastAndroid.show(t('shared_successfully'), ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log('Share error:', error.message);
            Alert.alert(t('error'), t('share_failed'));
        }
    };

    const handleCollect = async (url) => {
        try {
            const canOpen = await Linking.canOpenURL(url);
            if (!canOpen) {
                throw new Error('Invalid URL');
            }

            await Linking.openURL(url);
        } catch (error) {
            console.log('Open URL error:', error.message);
            Alert.alert(t('error'), t('fail_to_open_link'));
        }
    };

    const triggerActionWithAd = async (actionType, data) => {
        if (isProcessingAction) return; // Prevent multiple clicks

        const hasNetwork = await checkNetworkBeforeAction();
        if (!hasNetwork) return;

        setIsProcessingAction(true);
        currentActionRef.current = actionType;
        currentDataRef.current = data;

        try {
            if (rewardedAdRef.current?.ad?.loaded) {
                await rewardedAdRef.current.ad.show();
            } else {
                // If ad isn't loaded, perform action immediately and load new ad
                await performActionAfterAd();
                setIsProcessingAction(false);
                initializeRewardedAd();
            }
        } catch (error) {
            console.log('Ad show error:', error.message);
            await performActionAfterAd();
            setIsProcessingAction(false);
            initializeRewardedAd();
        }
    };

    const onShare = async (data) => {
        await triggerActionWithAd('share', data);
    };

    const openLink = async (url) => {
        await triggerActionWithAd('collect', url);
    };

    const copyToClipboard = (text) => {
        if (!text) {
            Alert.alert(t('error'), t('no_text_to_copy'));
            return;
        }
        Clipboard.setString(text);
        ToastAndroid.show(t('text_copy'), ToastAndroid.SHORT);
    };

    return (
        <View style={Styles.container}>
            <ScrollView contentContainerStyle={Styles.scrollContainer}>
                <View style={Styles.cardContainer}>
                    <Icon name="money" size={50} color={theme.colors.secondary} style={Styles.coinIcon} />
                    <View style={Styles.contentContainer}>
                        <CustomText title={t('collect_your_reward')} style={Styles.headerText} />
                    </View>
                    <View style={Styles.stepsBox}>
                        <CustomText title={t('tap_collect_button')} style={Styles.problemTitle} />
                    </View>
                    <View style={Styles.stepsBox}>
                        <View style={Styles.rowContainer}>
                            <CustomText title={collectedData?.rewards_title?.replace(/Spin Bonus/g, t('spin_bonus'))} style={Styles.rewardTitle} />
                            <View style={Styles.separator} />
                            <CustomText title={collectedData?.rewards_date} style={Styles.rewardDate} />
                        </View>
                    </View>
                    <View style={Styles.stepsBox}>
                        <View style={Styles.couponContainer}>
                            <CustomText title={`${t('code')} ${collectedData?.rewards_coupen_code}`} style={Styles.rewardDate} />
                            <TouchableOpacity onPress={() => copyToClipboard(collectedData?.rewards_coupen_code)}>
                                <Icon name="clipboard" size={20} color={theme.colors.secondary} style={Styles.copyIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* Banner Ad */}
                <View style={Styles.adContainer}>
                    <BannerAd
                        unitId={bannerAdUnitId}
                        size={BannerAdSize.MEDIUM_RECTANGLE}
                        requestOptions={{
                            requestNonPersonalizedAdsOnly: true,
                            keywords: ['coupons', 'rewards', 'shopping', 'deals'],
                        }}
                        onAdLoaded={() => setBannerAdError(false)}
                        onAdFailedToLoad={(error) => {
                            console.log('Banner ad failed to load:', error.message);
                            setBannerAdError(true);
                        }}
                    />
                    {bannerAdError && (
                        <View style={Styles.adPlaceholder}>
                            <CustomText title={t('ad_loading')} style={Styles.adPlaceholderText} />
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={Styles.iconContainer}>
                <TouchableOpacity
                    style={[
                        Styles.Sharebutton,
                        isProcessingAction && Styles.disabledButton
                    ]}
                    onPress={() => onShare(collectedData?.rewards_link)}
                    disabled={isProcessingAction}
                >
                    <CustomText title={t('share')} style={Styles.SharebuttonText} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        Styles.Collectbutton,
                        isProcessingAction && Styles.disabledButton
                    ]}
                    onPress={() => openLink(collectedData?.rewards_link)}
                    disabled={isProcessingAction}
                >
                    <CustomText title={t('collect')} style={Styles.CollectbuttonText} />
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
            paddingBottom: width * 0.15,
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
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
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
        disabledButton: {
            opacity: 0.6,
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
        adContainer: {
            width: '100%',
            minHeight: 250,
            backgroundColor: background,
            borderColor: primary,
            borderWidth: 1,
            borderRadius: width * 0.025,
            marginVertical: width * 0.03,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        adPlaceholder: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: background,
        },
        adPlaceholderText: {
            fontSize: body.fontSize,
            color: secondary,
            textAlign: 'center',
        },
    });
};