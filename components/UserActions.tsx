import { windowHeight, windowWidth } from '@/constants/app.constants';
import { useAuth } from '@/contexts/auth.context';
import { useModal } from '@/contexts/modal.context';
import { useLogout } from '@/hooks/useAuth';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
// Available icon libraries you can use:
import { FontAwesome6 } from '@expo/vector-icons';
import AuthFormWrapper from './auth/AuthFormWrapper';
import EnrollClassForm from './home/EnrollClassForm';

const iconColorMap = {
    profile: { default: '#666', pressed: '#292929' },
    notification: { default: '#666', pressed: '#292929' },
    class: { default: '#666', pressed: '#292929' },
    settings: { default: '#666', pressed: '#292929' },
    logout: { default: '#c0392b', pressed: '#e74c3c' },
};

const getIconColor = (
    action: keyof typeof iconColorMap,
    pressed: boolean,
    isLearnRoute: boolean
) => {
    if (action === 'logout') {
        return pressed ? '#e74c3c' : '#c0392b';
    }
    if (pressed) {
        return isLearnRoute ? '#fff' : iconColorMap[action].pressed;
    }
    return isLearnRoute ? '#fffc' : iconColorMap[action].default;
};

const UserActions = () => {
    const [userDropdownVisible, setUserDropdownVisible] = useState(false);

    const { openModal } = useModal();

    const pathname = usePathname();

    const isLearnRoute = pathname.startsWith('/learn');

    const { user } = useAuth();
    const { mutate: logout } = useLogout();

    return (
        <>
            {user ? (
                // Avatar
                <>
                    <Pressable
                        style={({ pressed }) => [
                            styles.enrollBtn,
                            { opacity: pressed ? 0.7 : 1 },
                        ]}
                        onPress={() => openModal(<EnrollClassForm />)}
                    >
                        <FontAwesome6 name="plus" size={20} color="#fff" />
                    </Pressable>
                    <Pressable onPress={() => setUserDropdownVisible(true)}>
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
                </>
            ) : (
                <Pressable
                    style={({ pressed }) => [
                        {
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: windowHeight(26),
                            backgroundColor: '#0093fc',
                            borderRadius: 999,
                            paddingHorizontal: 8,
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
                visible={userDropdownVisible}
                style={{ maxWidth: '45%' }}
                transparent
                animationType="fade"
                onRequestClose={() => setUserDropdownVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setUserDropdownVisible(false)}
                >
                    <Pressable
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: isLearnRoute
                                    ? '#191d1e'
                                    : '#fff',
                            },
                        ]}
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
                                            width: windowWidth(52),
                                            height: windowWidth(52),
                                        },
                                    ]}
                                    source={user?.avatarUrl}
                                    contentFit="contain"
                                />
                            </LinearGradient>
                            <View style={{ marginLeft: windowWidth(20) }}>
                                <Text
                                    style={[
                                        styles.modalName,
                                        {
                                            color: isLearnRoute
                                                ? '#fffc'
                                                : '#1d2129',
                                        },
                                    ]}
                                    ellipsizeMode="tail"
                                    numberOfLines={2}
                                >
                                    {user?.fullName}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={[
                                styles.modalDivider,
                                {
                                    backgroundColor: isLearnRoute
                                        ? '#323c4a'
                                        : '#0000000d',
                                },
                            ]}
                        />

                        <Pressable
                            style={styles.modalItem}
                            // @ts-ignore
                            onPress={() => {
                                router.push('/(tabs)/profile');
                                setUserDropdownVisible(false);
                            }}
                        >
                            {({ pressed }) => {
                                return (
                                    <View style={styles.modalItemContent}>
                                        <FontAwesome6
                                            name="user"
                                            solid
                                            size={16}
                                            color={getIconColor(
                                                'profile',
                                                pressed,
                                                isLearnRoute
                                            )}
                                            style={styles.modalItemIcon}
                                        />
                                        <Text
                                            style={[
                                                styles.modalItemText,
                                                {
                                                    color: isLearnRoute
                                                        ? '#fffc'
                                                        : '#666',
                                                },
                                                pressed &&
                                                    isLearnRoute && {
                                                        color: '#fff',
                                                    },
                                                pressed &&
                                                    !isLearnRoute && {
                                                        color: '#292929',
                                                    },
                                            ]}
                                        >
                                            Trang cá nhân
                                        </Text>
                                    </View>
                                );
                            }}
                        </Pressable>

                        <Pressable
                            style={styles.modalItem}
                            onPress={() => {
                                setUserDropdownVisible(false);
                            }}
                        >
                            {({ pressed }) => {
                                return (
                                    <View style={styles.modalItemContent}>
                                        <FontAwesome6
                                            name="bell"
                                            solid
                                            size={16}
                                            color={getIconColor(
                                                'notification',
                                                pressed,
                                                isLearnRoute
                                            )}
                                            style={styles.modalItemIcon}
                                        />
                                        <Text
                                            style={[
                                                styles.modalItemText,
                                                {
                                                    color: isLearnRoute
                                                        ? '#fffc'
                                                        : '#666',
                                                },
                                                pressed &&
                                                    isLearnRoute && {
                                                        color: '#fff',
                                                    },
                                                pressed &&
                                                    !isLearnRoute && {
                                                        color: '#292929',
                                                    },
                                            ]}
                                        >
                                            Thông báo
                                        </Text>
                                    </View>
                                );
                            }}
                        </Pressable>

                        <View
                            style={[
                                styles.modalDivider,
                                {
                                    backgroundColor: isLearnRoute
                                        ? '#323c4a'
                                        : '#0000000d',
                                },
                            ]}
                        />

                        <Pressable
                            style={styles.modalItem}
                            onPress={() => {
                                router.push('/(tabs)/home/classes');
                                setUserDropdownVisible(false);
                            }}
                        >
                            {({ pressed }) => {
                                return (
                                    <View style={styles.modalItemContent}>
                                        <FontAwesome6
                                            name="graduation-cap"
                                            size={16}
                                            color={getIconColor(
                                                'class',
                                                pressed,
                                                isLearnRoute
                                            )}
                                            style={styles.modalItemIcon}
                                        />
                                        <Text
                                            style={[
                                                styles.modalItemText,
                                                {
                                                    color: isLearnRoute
                                                        ? '#fffc'
                                                        : '#666',
                                                },
                                                pressed &&
                                                    isLearnRoute && {
                                                        color: '#fff',
                                                    },
                                                pressed &&
                                                    !isLearnRoute && {
                                                        color: '#292929',
                                                    },
                                            ]}
                                        >
                                            Lớp học của tôi
                                        </Text>
                                    </View>
                                );
                            }}
                        </Pressable>

                        <View
                            style={[
                                styles.modalDivider,
                                {
                                    backgroundColor: isLearnRoute
                                        ? '#323c4a'
                                        : '#0000000d',
                                },
                            ]}
                        />

                        <Pressable
                            style={styles.modalItem}
                            onPress={() => {
                                // @ts-ignore
                                router.push('/(routes)/settings/personal');
                                setUserDropdownVisible(false);
                            }}
                        >
                            {({ pressed }) => {
                                return (
                                    <View style={styles.modalItemContent}>
                                        <FontAwesome6
                                            name="gear"
                                            size={16}
                                            color={getIconColor(
                                                'settings',
                                                pressed,
                                                isLearnRoute
                                            )}
                                            style={styles.modalItemIcon}
                                        />
                                        <Text
                                            style={[
                                                styles.modalItemText,
                                                {
                                                    color: isLearnRoute
                                                        ? '#fffc'
                                                        : '#666',
                                                },
                                                pressed &&
                                                    isLearnRoute && {
                                                        color: '#fff',
                                                    },
                                                pressed &&
                                                    !isLearnRoute && {
                                                        color: '#292929',
                                                    },
                                            ]}
                                        >
                                            Cài đặt
                                        </Text>
                                    </View>
                                );
                            }}
                        </Pressable>
                        <Pressable
                            style={styles.modalItem}
                            onPress={() => {
                                setUserDropdownVisible(false);
                                logout();
                            }}
                        >
                            {({ pressed }) => {
                                return (
                                    <View style={styles.modalItemContent}>
                                        <FontAwesome6
                                            name="arrow-right-from-bracket"
                                            size={16}
                                            color={getIconColor(
                                                'logout',
                                                pressed,
                                                isLearnRoute
                                            )}
                                            style={styles.modalItemIcon}
                                        />
                                        <Text
                                            style={[
                                                styles.modalItemText,
                                                {
                                                    color: isLearnRoute
                                                        ? '#fffc'
                                                        : '#666',
                                                },
                                                pressed &&
                                                    isLearnRoute && {
                                                        color: '#fff',
                                                    },
                                                pressed &&
                                                    !isLearnRoute && {
                                                        color: '#292929',
                                                    },
                                            ]}
                                        >
                                            Đăng xuất
                                        </Text>
                                    </View>
                                );
                            }}
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
        width: windowWidth(46),
        height: windowWidth(46),
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
        shadowOffset: { width: 4, height: -4 },
        shadowOpacity: 0.4,
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
        maxWidth: 120,
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
    modalItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalItemIcon: {
        marginRight: 12,
    },
    modalItemText: {
        fontSize: 14,
        color: '#666',
    },
    enrollBtn: {
        width: windowWidth(46),
        height: windowWidth(46),
        borderRadius: 9999,
        backgroundColor: '#0093fc',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
