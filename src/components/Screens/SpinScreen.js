import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CustomText, DailyBonus } from '../../commonComponents/CommonComponent';
import { useDataContext } from '../../service/DataContext';
import { theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Ad Unit IDs
const bannerAdUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-4241920534057829/5350998591';

export const SpinScreen = () => {
    const { t } = useTranslation();
    const { spinData } = useDataContext();
    const Styles = useMemo(() => createStyles(theme), [theme]);
    const [adLoaded, setAdLoaded] = useState(false);
    const [adError, setAdError] = useState(null);

    // Track ad load attempts
    useEffect(() => {
        let retryTimer;
        if (adError) {
            retryTimer = setTimeout(() => {
                setAdError(null); // Clear error to trigger ad reload
            }, 30000); // Retry after 30 seconds
        }
        return () => clearTimeout(retryTimer);
    }, [adError]);

    const handleAdLoad = () => {
        setAdLoaded(true);
        setAdError(null);
    };

    const handleAdError = (error) => {
        setAdLoaded(false);
        setAdError(t('ad_failed_to_load'));
        console.error('Ad failed to load:', error);
    };

    if (!spinData || spinData.length === 0) {
        return <CustomText title={t('no_data_avilable')} style={Styles.noDataText} />;
    }

    const reversedData = [...spinData].reverse();

    return (
        <View style={Styles.container}>
            <ScrollView 
                contentContainerStyle={Styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {reversedData?.map((data, index) => (
                    <View key={index} style={{ paddingBottom: index === spinData.length - 1 ? 10 : 0 }}>
                        <DailyBonus data={data} />
                    </View>
                ))}
            </ScrollView>

            {/* Fixed Banner Ad at Bottom */}
            <View style={Styles.adContainer}>
                {adError ? (
                    <View style={Styles.adPlaceholder}>
                        <CustomText 
                            title={t('ad_failed_to_load')} 
                            style={Styles.errorText} 
                        />
                    </View>
                ) : (
                    <BannerAd
                        unitId={bannerAdUnitId}
                        size={BannerAdSize.BANNER}
                        requestOptions={{
                            requestNonPersonalizedAdsOnly: true,
                            keywords: ['games', 'casino', 'coupons', 'rewards', 'shopping', 'deals'],
                        }}
                        onAdLoaded={handleAdLoad}
                        onAdFailedToLoad={handleAdError}
                    />
                )}
            </View>
        </View>
    );
};

const createStyles = ({ 
    text: { subheading }, 
    colors: { secondary, background, accent }, 
    dimensions: { width, height } 
}) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: background,
        },
        scrollContent: {
            padding: width * 0.03,
            paddingBottom: 80, // Space for fixed ad at bottom
        },
        headerText: {
            fontSize: subheading.fontSize,
            color: accent,
            marginBottom: width * 0.05,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 2,
        },
        noDataText: {
            fontSize: subheading.fontSize,
            color: secondary,
            margin: width * 0.05,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 2,
        },
        adContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: background,
            padding: width * 0.01,
            borderTopWidth: 1,
            borderTopColor: accent,
            alignItems: 'center',
            justifyContent: 'center',
            height: 80, // Standard banner height
        },
        adPlaceholder: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: background,
        },
        errorText: {
            color: secondary,
            fontSize: subheading.fontSize * 0.7,
            textAlign: 'center',
        },
    });
};