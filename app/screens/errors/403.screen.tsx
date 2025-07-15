import GradientText from '@/components/GradientText';
import {
    SCREEN_HEIGHT,
    windowHeight,
    windowWidth,
} from '@/constants/app.constants';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UnauthorizePage = () => {
    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.logoWrapper}>
                    <Pressable
                        onPress={() => router.push('/(tabs)/home')}
                        style={{ display: 'flex', borderRadius: 10 }}
                    >
                        <Image
                            style={styles.logo}
                            source={require('../../../assets/images/logo.png')}
                            contentFit="contain"
                            transition={1000}
                        />
                    </Pressable>
                    <Text style={styles.logoText}>Học, Học Nữa, Học Mãi</Text>
                </View>
                <View style={styles.centered403}>
                    <GradientText text="403" style={styles.gradient403} />
                </View>
                <Text style={styles.errorText}>
                    Bạn không có quyền truy cập 🚫
                </Text>
                <View style={styles.errorDescription}>
                    <Text style={styles.errorDescriptionText}>
                        Rất tiếc, bạn không được phép truy cập vào nội dung này.
                    </Text>
                    <Text style={styles.errorDescriptionText}>
                        Có thể tài khoản của bạn chưa được cấp quyền. Vui lòng
                        quay lại trang chủ hoặc liên hệ hỗ trợ nếu cần.
                    </Text>
                </View>
                <Pressable
                    style={({ pressed }) => [
                        {
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: windowHeight(34),
                            backgroundColor: '#0093fc',
                            borderRadius: 999,
                            paddingHorizontal: 10,
                            marginTop: 20,
                            paddingVertical: 4,
                        },
                        { opacity: pressed ? 0.7 : 1 },
                    ]}
                    onPress={() => {
                        router.push('/(tabs)/home');
                    }}
                >
                    <Text
                        style={{
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: 20,
                        }}
                    >
                        VỀ TRANG CHỦ
                    </Text>
                </Pressable>
            </SafeAreaView>
        </View>
    );
};

export default UnauthorizePage;

const styles = StyleSheet.create({
    container: {
        minHeight: SCREEN_HEIGHT,
        backgroundColor: '#fff',
        flex: 1,
        position: 'relative',
        paddingHorizontal: 16,
        marginBottom: 10,
        marginTop: 12,
    },
    logoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    logo: {
        width: windowWidth(54),
        height: windowWidth(54),
        flexShrink: 0,
        borderRadius: windowWidth(10),
    },
    logoText: {
        fontSize: 18,
        fontWeight: '600',
    },
    centered403: {
        alignItems: 'center',
        marginTop: 24,
    },
    gradient403: {
        fontSize: 160,
        fontWeight: '900',
        textAlign: 'center',
    },
    errorText: {
        fontSize: 45,
        fontWeight: '900',
        textAlign: 'center',
        marginTop: 12,
    },
    errorDescription: {
        marginTop: 24,
    },
    errorDescriptionText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 12,
    },
});
