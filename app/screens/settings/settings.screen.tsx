import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const SettingsScreen = () => {
    return (
        <View>
            <View style={styles.headerRow}>
                <View style={styles.logoWrapper}>
                    <Pressable
                        onPress={() => router.push('/(tabs)/home')}
                        style={{ display: 'flex', borderRadius: 10 }}
                    >
                        <Image
                            style={styles.logo}
                            source="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
                            contentFit="contain"
                            transition={1000}
                        />
                    </Pressable>
                </View>
                <Pressable
                    style={({ pressed }) => [
                        styles.closeBtn,
                        {
                            backgroundColor: pressed ? '#0003' : '#0000001a',
                        },
                    ]}
                >
                    <FontAwesome6 name="xmark" solid size={24} color="#000" />
                </Pressable>
            </View>

            <Text style={styles.title}>Cài đặt tài khoản</Text>
            <Text style={styles.desc}>
                Quản lý cài đặt tài khoản của bạn như thông tin cá nhân, cài đặt
                bảo mật, quản lý thông báo, v.v.
            </Text>

            <View style={styles.card}>
                <Pressable
                    onPress={() =>
                        // @ts-ignore
                        router.push('/(routes)/settings/personal')
                    }
                    style={({ pressed }) => [
                        styles.item,
                        {
                            backgroundColor: pressed ? '#0000001a' : '#FFF',
                        },
                    ]}
                >
                    <FontAwesome6
                        name="user"
                        size={18}
                        solid
                        color="#111"
                        style={styles.itemIcon}
                    />
                    <Text style={styles.itemText}>Thông tin cá nhân</Text>
                    <FontAwesome6
                        name="chevron-right"
                        size={16}
                        color="#888"
                        style={styles.chevron}
                    />
                </Pressable>
                <Pressable
                    style={styles.item}
                    onPress={() =>
                        // @ts-ignore
                        router.push('/(routes)/settings/security')
                    }
                >
                    <FontAwesome6
                        name="shield"
                        solid
                        size={18}
                        color="#111"
                        style={styles.itemIcon}
                    />
                    <Text style={styles.itemText}>Mật khẩu và bảo mật</Text>
                    <FontAwesome6
                        name="chevron-right"
                        size={16}
                        color="#888"
                        style={styles.chevron}
                    />
                </Pressable>
            </View>
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 16,
    },
    logoWrapper: {
        alignItems: 'center',
    },

    logo: {
        width: 44,
        height: 44,
        flexShrink: 0,
        borderRadius: 10,
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 9999,
        backgroundColor: '#0000001a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
        marginTop: 4,
    },
    desc: {
        color: '#000',
        opacity: 0.9,
        fontSize: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 20,
    },
    item: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 14,
        opacity: 0.9,
        borderBottomWidth: 1,
        borderBottomColor: '#dee3e9',
    },
    itemIcon: {
        marginRight: 16,
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    chevron: {
        marginLeft: 8,
    },
});
