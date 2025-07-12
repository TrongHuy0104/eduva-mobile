import { windowHeight, windowWidth } from '@/constants/app.constants';
import { useAuth } from '@/contexts/auth.context';
import { useModal } from '@/contexts/modal.context';
import { useLogout } from '@/hooks/useAuth';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import AuthFormWrapper from './auth/AuthFormWrapper';

const UserActions = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const { user } = useAuth();
    const { openModal, closeModal } = useModal();
    const { mutate: logout, isPending } = useLogout();

    return (
        <>
            {user ? (
                // Avatar
                <Pressable onPress={() => setModalVisible(true)}>
                    <LinearGradient
                        colors={['#ffd900', '#b45264']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={styles.avatarWrapper}
                    >
                        <Image
                            style={[styles.avatar]}
                            source={user.avatarUrl}
                            contentFit="contain"
                            transition={1000}
                        />
                    </LinearGradient>
                </Pressable>
            ) : (
                <Pressable
                    style={({ pressed }) => [
                        {
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: windowHeight(32),
                            backgroundColor: '#007bff',
                            borderRadius: 999,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                        },
                        { opacity: pressed ? 0.7 : 1 },
                    ]}
                    onPress={() => {
                        openModal(<AuthFormWrapper />);
                    }}
                >
                    <Text
                        style={{
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: 15,
                        }}
                    >
                        Đăng nhập
                    </Text>
                </Pressable>
            )}
            {/* Modal */}
            <Modal
                visible={modalVisible}
                style={{ maxWidth: '50%' }}
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
                                    source={user?.avatarUrl}
                                    contentFit="contain"
                                />
                            </LinearGradient>
                            <View style={{ marginLeft: windowWidth(20) }}>
                                <Text
                                    style={styles.modalName}
                                    ellipsizeMode="tail"
                                    numberOfLines={1}
                                >
                                    {user?.fullName}
                                </Text>
                                {/* <Text style={styles.modalUsername}>
                                    {user?.email}
                                </Text> */}
                            </View>
                        </View>

                        <View style={styles.modalDivider} />

                        <Pressable
                            style={styles.modalItem}
                            // @ts-ignore
                            onPress={() => {
                                router.push('/(tabs)/profile');
                                setModalVisible(false);
                            }}
                        >
                            {({ pressed }) => (
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        pressed && { color: '#292929' },
                                    ]}
                                >
                                    Trang cá nhân
                                </Text>
                            )}
                        </Pressable>

                        <Pressable
                            style={styles.modalItem}
                            onPress={() => {
                                setModalVisible(false);
                            }}
                        >
                            {({ pressed }) => (
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        pressed && { color: '#292929' },
                                    ]}
                                >
                                    Thông báo
                                </Text>
                            )}
                        </Pressable>

                        <View style={styles.modalDivider} />

                        <Pressable
                            style={styles.modalItem}
                            onPress={() => {
                                setModalVisible(false);
                            }}
                        >
                            {({ pressed }) => (
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        pressed && { color: '#292929' },
                                    ]}
                                >
                                    Môn học của tôi
                                </Text>
                            )}
                        </Pressable>

                        <View style={styles.modalDivider} />

                        <Pressable
                            style={styles.modalItem}
                            onPress={() => {
                                // @ts-ignore
                                router.push('/(routes)/settings');
                                setModalVisible(false);
                            }}
                        >
                            {({ pressed }) => (
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        pressed && { color: '#292929' },
                                    ]}
                                >
                                    Cài đặt
                                </Text>
                            )}
                        </Pressable>
                        <Pressable
                            style={styles.modalItem}
                            onPress={() => {
                                setModalVisible(false);
                                logout();
                            }}
                        >
                            {({ pressed }) => (
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        pressed && { color: '#292929' },
                                    ]}
                                >
                                    Đăng xuất
                                </Text>
                            )}
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
};

export default UserActions;

const styles = StyleSheet.create({
    avatarWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        padding: windowWidth(2),
        borderRadius: 9999,
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
        minWidth: windowWidth(250),
        backgroundColor: '#fff',
        borderRadius: windowWidth(16),
        paddingVertical: windowWidth(10),
        paddingHorizontal: windowWidth(24),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 32,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: 300,
    },
    modalName: {
        fontWeight: 'bold',
        fontSize: 16,
        maxWidth: 200,
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
