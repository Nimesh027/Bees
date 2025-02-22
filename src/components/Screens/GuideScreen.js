import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CustomText, CustomTips } from '../../commonComponents/CommonComponent'
import { useDataContext } from '../../service/DataContext';
import { theme } from '../../theme/theme';

export const GuideScreen = () => {

    const { playData } = useDataContext();
    const Styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <ScrollView style={Styles.container}>
            {playData?.map((data, index) => (
                <View key={index} style={{ paddingBottom: index === playData.length - 1 && 10 }}>
                    <CustomTips id={data?.play_id} question={data?.play_title} answer={data?.play_text} />
                </View>
            ))}
        </ScrollView>
    );
};

export const Tip1Screen = () => {

    const { blogData } = useDataContext();
    const Styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <ScrollView style={Styles.container}>
            {blogData?.map((data, index) => (
                <View key={index} style={{ paddingBottom: index === blogData.length - 1 && 10 }}>
                    <CustomTips id={data?.blog_id} question={data?.blog_title} answer={data?.blog_text} />
                </View>
            ))}
        </ScrollView>
    )
}


const createStyles = ({ text: { body, heading }, colors: { primary, accent, background, secondary }, dimensions: { width } }) => {

    return StyleSheet.create({
        container: {
            flex: 1,
            padding: width * 0.03,
            backgroundColor: background,
        },
        headerText: {
            fontSize: heading.fontSize,
            color: secondary,
            marginBottom: 20,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 2,
        },
        questionContainer: {
            backgroundColor: primary,
            borderRadius: 8,
            padding: 15,
            marginBottom: 15,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
        },
        questionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        questionText: {
            flex: 1,
            fontSize: body.fontSize,
            color: secondary,
        },
        toggleButton: {
            fontSize: body.fontSize,
            color: accent,
            paddingLeft: 10,
        },
        answerText: {
            marginTop: 10,
            fontSize: body.fontSize,
            color: secondary,
        },
    })
}