import {
    fontSizes,
    windowHeight,
    windowWidth,
} from '@/constants/app.constants';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const Header = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(borderAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        Animated.timing(borderAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#e8e8e8', '#444'],
    });
    return (
        <View>
            <View style={styles.header}>
                {/* Logo */}
                <View style={styles.logoWrapper}>
                    <Link
                        href="/"
                        asChild
                        style={{ display: 'flex', borderRadius: 10 }}
                    >
                        <Image
                            style={styles.logo}
                            source="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
                            contentFit="contain"
                            transition={1000}
                        />
                    </Link>
                </View>
                {/*  */}

                {/* Search */}
                <Animated.View style={[styles.searchWrapper, { borderColor }]}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            { opacity: pressed ? 1 : 0.7 },
                        ]}
                    >
                        <Ionicons name="search" size={26} color="#404040" />
                    </Pressable>
                    <TextInput
                        style={styles.input}
                        placeholder="Tìm kiếm..."
                        placeholderTextColor="#404040"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </Animated.View>
                {/*  */}

                {/* Avatar */}
                <Pressable onPress={() => setModalVisible(true)}>
                    <LinearGradient
                        colors={['#ffd900', '#b45264']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={styles.avatarWrapper}
                    >
                        <Image
                            style={[styles.avatar]}
                            source="https://files.fullstack.edu.vn/f8-prod/public-images/6833d787bbd19.png"
                            contentFit="contain"
                            transition={1000}
                        />
                    </LinearGradient>
                </Pressable>
            </View>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    <Pressable
                        style={styles.modalContent}
                        onPress={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                        <View style={styles.modalHeader}>
                            <LinearGradient
                                colors={['#ffd900', '#b45264']}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={[
                                    styles.avatarWrapper,
                                    { marginVertical: windowWidth(12) },
                                ]}
                            >
                                <Image
                                    style={[
                                        styles.avatar,
                                        {
                                            width: windowWidth(66),
                                            height: windowWidth(66),
                                        },
                                    ]}
                                    source="https://files.fullstack.edu.vn/f8-prod/public-images/6833d787bbd19.png"
                                    contentFit="contain"
                                />
                            </LinearGradient>
                            <View style={{ marginLeft: windowWidth(20) }}>
                                <Text style={styles.modalName}>Trọng Huy</Text>
                                <Text style={styles.modalUsername}>
                                    @huytrong
                                </Text>
                            </View>
                        </View>

                        <View style={styles.modalDivider} />

                        <TouchableOpacity style={styles.modalItem}>
                            <Text style={styles.modalItemText}>
                                Trang cá nhân
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalItem}>
                            <Text style={styles.modalItemText}>Thông báo</Text>
                        </TouchableOpacity>

                        <View style={styles.modalDivider} />

                        <TouchableOpacity style={styles.modalItem}>
                            <Text style={styles.modalItemText}>
                                Môn học của tôi
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.modalDivider} />

                        <TouchableOpacity style={styles.modalItem}>
                            <Text style={styles.modalItemText}>Cài đặt</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalItem}>
                            <Text style={styles.modalItemText}>Đăng xuất</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: windowWidth(18),
        zIndex: 20,
        height: windowHeight(56),
        borderBottomWidth: windowWidth(1),
        borderBottomColor: '#e8ebed',
        backgroundColor: '#fff',
        fontSize: fontSizes.FONT14,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: windowWidth(18),
    },

    logoWrapper: {
        alignItems: 'center',
    },

    logo: {
        width: windowWidth(54),
        height: windowWidth(54),
        flexShrink: 0,
        borderRadius: windowWidth(10),
    },

    searchWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 2,
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '100%',
        height: windowHeight(34),
        paddingRight: windowWidth(16),
        paddingLeft: windowWidth(8),
        borderRadius: windowWidth(30),
        borderWidth: windowWidth(2),
        borderColor: '#e8e8e8',
    },

    button: {
        height: windowHeight(32),
        backgroundColor: '#fff',
        borderRadius: windowWidth(18),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: windowWidth(8),
        flexShrink: 0,
    },

    input: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        fontSize: 16, // 1.6rem ≈ 16px
        borderWidth: 0,
        color: '#000',
        textAlignVertical: 'center',
        paddingVertical: 0,
    },

    avatarWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        padding: windowWidth(2), // 0.7em ≈ 11.2px (assuming 1em = 16px)
        borderRadius: 9999, // Makes it a circle
    },

    avatar: {
        width: windowWidth(52),
        height: windowWidth(52),
        borderRadius: 9999,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    modalContent: {
        marginTop: 60,
        marginRight: 10,
        color: '#1d2129',
        minWidth: windowWidth(300),
        backgroundColor: '#fff',
        borderRadius: windowWidth(16),
        paddingVertical: windowWidth(10),
        paddingHorizontal: windowWidth(28),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 32,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalUsername: {
        color: '#888',
        fontSize: 14,
    },
    modalDivider: {
        height: 1,
        backgroundColor: '#0000000d',
        marginVertical: windowWidth(10),
    },
    modalItem: {
        paddingVertical: 8,

        paddingHorizontal: windowWidth(12),
    },
    modalItemText: {
        fontSize: 14,
        color: '#666',
    },
});
