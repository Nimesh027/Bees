import React, { useMemo, useState, useRef, useEffect } from 'react';
import { ScrollView, View, Share, StyleSheet, TouchableOpacity, Alert, Linking, ToastAndroid, Modal, ActivityIndicator } from 'react-native';
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
const AD_LOAD_TIMEOUT = 5000; // 4 seconds timeout for ad loading

export const CollectLink = () => {
    const { t } = useTranslation();
    const { isConnected, checkNetworkConnection } = useDataContext();
    const navigation = useNavigation();
    const Styles = useMemo(() => createStyles(theme), [theme]);
    const { collectedData } = useDataContext();
    const [bannerAdError, setBannerAdError] = useState(false);
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    const [bannerAdLoading, setBannerAdLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const currentActionRef = useRef(null);
    const currentDataRef = useRef(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
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
            navigation.replace('DefaultScreen', { screen: "Collect Spin" });
            return false;
        }
    };

    const loadAndShowRewardedAd = async (actionType, data) => {
        if (isProcessingAction) return;

        const hasNetwork = await checkNetworkBeforeAction();
        if (!hasNetwork) return;

        setIsProcessingAction(true);
        setLoading(true);
        currentActionRef.current = actionType;
        currentDataRef.current = data;

        // Create new rewarded ad instance
        const ad = RewardedAd.createForAdRequest(rewardedAdUnitId, {
            requestNonPersonalizedAdsOnly: true,
            keywords: ['mobile gaming', 'rewards', 'app installs', 'subscriptions', 'ecommerce', 'promotions', 'incentives', 'digital offers'],
        });

        let timeoutId = null;
        let hasAdLoaded = false;

        // Set up timeout to perform action if ad doesn't load in 4 seconds
        timeoutId = setTimeout(() => {
            if (!hasAdLoaded && isMountedRef.current) {
                performActionAfterAd();
                setIsProcessingAction(false);
                setLoading(false);
                cleanupListeners();
            }
        }, AD_LOAD_TIMEOUT);

        // Set up event listeners
        const loadedListener = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
            hasAdLoaded = true;
            clearTimeout(timeoutId);
            if (isMountedRef.current) {
                setLoading(false);
                ad.show().catch(error => {
                    performActionAfterAd();
                    setIsProcessingAction(false);
                    setLoading(false);
                    cleanupListeners();
                });
            }
        });

        const earnedListener = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        });

        const closedListener = ad.addAdEventListener(AdEventType.CLOSED, () => {
            if (isMountedRef.current) {
                performActionAfterAd();
                setIsProcessingAction(false);
                setLoading(false);
            }
            cleanupListeners();
        });

        const errorListener = ad.addAdEventListener(AdEventType.ERROR, (error) => {
            clearTimeout(timeoutId);
            if (isMountedRef.current) {
                performActionAfterAd();
                setIsProcessingAction(false);
                setLoading(false);
            }
            cleanupListeners();
        });

        const cleanupListeners = () => {
            loadedListener();
            earnedListener();
            closedListener();
            errorListener();
        };

        // Start loading the ad
        try {
            ad.load();
        } catch (error) {
            clearTimeout(timeoutId);
            if (isMountedRef.current) {
                performActionAfterAd();
                setIsProcessingAction(false);
                setLoading(false);
            }
            cleanupListeners();
        }
    };

    const performActionAfterAd = async () => {
        const action = currentActionRef.current;
        const data = currentDataRef.current;

        if (!data) {
            Alert.alert(t('error'), t('no_data_provided'));
            setIsProcessingAction(false);
            setLoading(false);
            return;
        }

        try {
            if (action === 'share') {
                await handleShare(data);
            } else if (action === 'collect') {
                await handleCollect(data);
            }
        } catch (error) {
            Alert.alert(t('error'), t('action_failed'));
        } finally {
            setIsProcessingAction(false);
            setLoading(false);
        }
    };

    const handleShare = async (data) => {
        try {
            const result = await Share.share({
                message: `${t('check_out_this_link')} ${data}`,
            });

            // if (result.action === Share.sharedAction) {
            //     ToastAndroid.show(t('shared_successfully'), ToastAndroid.SHORT);
            // }
        } catch (error) {
            Alert.alert(t('error'), t('share_failed'));
            throw error;
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
            Alert.alert(t('error'), t('fail_to_open_link'));
            throw error;
        }
    };

    const onShare = async (data) => {
        await loadAndShowRewardedAd('share', data);
    };

    const openLink = async (url) => {
        await loadAndShowRewardedAd('collect', url);
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
                    {bannerAdLoading && (
                        <View style={Styles.adPlaceholder}>
                            <CustomText title="Loading..." style={Styles.adPlaceholderText} />
                        </View>
                    )}
                    <BannerAd
                        unitId={bannerAdUnitId}
                        size={BannerAdSize.MEDIUM_RECTANGLE}
                        requestOptions={{
                            requestNonPersonalizedAdsOnly: true,
                            keywords: ['games', 'gaming', 'mobile gaming', 'entertainment', 'rewards', 'shopping', 'lifestyle', 'technology'],
                        }}
                        onAdLoaded={() => {
                            setBannerAdLoading(false);
                            setBannerAdError(false);
                        }}
                        onAdFailedToLoad={(error) => {
                            setBannerAdLoading(false);
                            setBannerAdError(true);
                        }}
                    />
                    {bannerAdError && !bannerAdLoading && (
                        <View style={Styles.adPlaceholder}>
                            <CustomText title={t('ad_failed')} style={Styles.adPlaceholderText} />
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

            {loading && (
                <Modal transparent={true} animationType="fade">
                    <View style={Styles.loaderContainer}>
                        <View style={Styles.innerContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                    </View>
                </Modal>
            )}
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
            marginVertical: width * 0.03,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        adPlaceholder: {
            width: '100%',
            height: 250,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: background,
            position: 'absolute',
        },
        adPlaceholderText: {
            fontSize: body.fontSize,
            color: secondary,
            textAlign: 'center',
        },
        loaderContainer: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        innerContainer: {
            width: "40%",
            padding: width * 0.07,
            backgroundColor: background,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: width * 0.03
        }
    });
};