import React, { useMemo, useState } from 'react';
import {
    View, TouchableOpacity, Text, StyleSheet,
    Alert, Linking, Share, Modal, TextInput, ToastAndroid
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme/theme';

export const Menu = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const Styles = useMemo(() => createStyles(theme), [theme]);
    const navigation = useNavigation();

    const openLink = (url) => {
        Linking.openURL(url).catch(() => {
            Alert.alert('Error', 'Failed to open the link.');
        });
    };

    const onShare = async (data) => {
        try {
            await Share.share({
                message: `Check out this link: ${data}`,
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const sendFeedback = () => {
        const email = 'yarar26848@lineacr.com';
        const subject = 'Feedback';
        const body = 'Hello, I would like to provide the following feedback:';

        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        openLink(mailtoUrl);
    };

    const submitRating = async () => {
        if (rating === 0) {
            Alert.alert('Please select a star rating.');
            return;
        }
        try {
            await AsyncStorage.setItem('userRating', JSON.stringify({ rating, feedback }));
            ToastAndroid.show('Thank you! Your feedback has been saved.', ToastAndroid.SHORT);
            setModalVisible(false);
            setRating(0);
            setFeedback('');
        } catch (error) {
            ToastAndroid.show('Error! Failed to save feedback.', ToastAndroid.SHORT);
        }
    };

    const menuItems = [
        {
            id: 'rate',
            title: 'Give 5 Stars',
            icon: 'star',
            action: () => setModalVisible(true),
        },
        {
            id: 'share',
            title: 'Share App',
            icon: 'share-alt',
            action: () => onShare('https://rewards.coinmaster.com/rewards/rewards.html?c=pe_EMAILqPGdhZ_20241027')
        },
        {
            id: 'more_apps',
            title: 'More Apps',
            icon: 'th-large',
            action: () => console.log('More Apps')
        },
        {
            id: 'privacy_policy',
            title: 'Privacy Policy',
            icon: 'file-text-o',
            action: () => openLink('https://coinmasterfreespin.tech/privacy-policy.php')
        },
        {
            id: 'feedback',
            title: 'Send Feedback',
            icon: 'envelope',
            action: sendFeedback
        }
    ];

    return (
        <View style={Styles.container}>
            {menuItems.map(item => (
                <TouchableOpacity
                    key={item.id}
                    style={Styles.cardContainer}
                    onPress={item.action}
                >
                    <View style={Styles.contentContainer}>
                        <FontAwesome
                            name={item.icon}
                            size={theme.dimensions.width * 0.08}
                            color={theme.colors.secondary}
                            style={Styles.icon}
                        />
                        <View style={Styles.textContainer}>
                            <Text style={Styles.title}>{item.title}</Text>
                        </View>
                        <FontAwesome
                            name="angle-right"
                            size={theme.dimensions.width * 0.06}
                            color={theme.colors.secondary}
                        />
                    </View>
                </TouchableOpacity>
            ))}

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={Styles.modalContainer}>
                    <View style={Styles.modalContent}>
                        {/* Header Section with RATE US and Close Icon */}
                        <View style={Styles.header}>
                            <Text style={Styles.modalTitle}>RATE US</Text>
                            <TouchableOpacity style={Styles.closeIcon} onPress={() => setModalVisible(false)}>
                                <FontAwesome
                                    name="times"
                                    size={theme.dimensions.width * 0.06}
                                    color={theme.colors.primary}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Line Below Header */}
                        <View style={Styles.headerLine} />

                        {/* Rest of the modal content */}
                        <View style={Styles.starContainer}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <TouchableOpacity key={num} onPress={() => setRating(num)} style={Styles.star}>
                                    <FontAwesome
                                        name={rating >= num ? 'star' : 'star-o'}
                                        size={theme.dimensions.width * 0.1}
                                        color={theme.colors.primary}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={Styles.textArea}
                            placeholder="Write your feedback here..."
                            placeholderTextColor={theme.colors.secondary}
                            value={feedback}
                            onChangeText={setFeedback}
                            multiline
                        />

                        <TouchableOpacity style={Styles.submitButton} onPress={submitRating}>
                            <Text style={Styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const createStyles = ({ colors, dimensions }) => {
    const { width, height } = dimensions;
    return StyleSheet.create({
        container: {
            flex: 1,
            paddingVertical: height * 0.02,
            backgroundColor: colors.background,
            paddingHorizontal: width * 0.03,
        },
        cardContainer: {
            marginBottom: height * 0.015,
            padding: width * 0.02,
            borderColor: colors.primary,
            borderWidth: 1,
            borderRadius: width * 0.025,
            backgroundColor: colors.background,
            elevation: 3,
        },
        contentContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        icon: {
            marginRight: width * 0.02,
        },
        textContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        title: {
            fontSize: width * 0.05,
            fontWeight: 'bold',
            color: colors.secondary,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalContent: {
            backgroundColor: colors.background,
            padding: width * 0.05,
            borderRadius: width * 0.05,
            width: '85%',
            alignItems: 'center',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'center', // Center the title
            alignItems: 'center',
            width: '100%',
            marginBottom: height * 0.02,
            position: 'relative', // For absolute positioning of the close icon
        },
        modalTitle: {
            fontSize: width * 0.06,
            fontWeight: 'bold',
            color: colors.primary,
            textAlign: 'center', // Center the text
        },
        closeIcon: {
            position: 'absolute', // Position the close icon absolutely
            right: 0, // Align to the right
        },
        headerLine: {
            width: '100%',
            height: 1,
            backgroundColor: colors.primary,
            marginBottom: height * 0.02,
        },
        starContainer: {
            flexDirection: 'row',
            marginBottom: height * 0.02,
        },
        star: {
            marginHorizontal: width * 0.015, // Added spacing between stars
        },
        textArea: {
            width: '100%',
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: width * 0.025,
            padding: width * 0.03,
            height: height * 0.12,
            textAlignVertical: 'top',
            marginBottom: height * 0.015,
            color: colors.secondary,
        },
        submitButton: {
            backgroundColor: colors.primary,
            paddingVertical: height * 0.015,
            paddingHorizontal: width * 0.1,
            borderRadius: width * 0.025,
        },
        submitButtonText: {
            color: '#fff',
            fontWeight: 'bold',
        },
    });
};

export default Menu;
