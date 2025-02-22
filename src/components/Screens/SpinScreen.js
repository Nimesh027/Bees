import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CustomText, DailyBonus } from '../../commonComponents/CommonComponent';
import { useDataContext } from '../../service/DataContext';
import { theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';

export const SpinScreen = () => {
    const { t } = useTranslation();
    const { spinData } = useDataContext();
    const Styles = useMemo(() => createStyles(theme), [theme]);

    if (!spinData || spinData.length === 0) {
        return <CustomText title={t('no_data_avilable')} style={Styles.noDataText} />;
    }

    const reversedData = [...spinData].reverse();
    return (
        <ScrollView style={Styles.container}>
            {reversedData?.map((data, index) => (
                <View key={index} style={{ paddingBottom: index === spinData.length - 1 ? 10 : 0 }}>
                    <DailyBonus data={data} />
                </View>
            ))}
        </ScrollView>
    );
};

const createStyles = ({ text: { subheading }, colors: { secondary, background, accent }, dimensions: { width } }) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: width * 0.03,
            backgroundColor: background,
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
        }
    });
};