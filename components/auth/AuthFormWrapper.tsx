import { windowWidth } from '@/constants/app.constants';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LoginForm from './LoginForm';

const AuthFormWrapper = () => {
    return (
        <View>
            {/* Logo */}
            <View style={styles.logoWrapper}>
                <Pressable
                    // @ts-ignore
                    onPress={() => router.push('/(tabs)/home')}
                    style={{ display: 'flex', borderRadius: 10 }}
                >
                    <Image
                        style={styles.logo}
                        source={require('../../assets/images/logo.png')}
                        contentFit="contain"
                        transition={1000}
                    />
                </Pressable>
            </View>
            <LoginForm />
            <Text style={styles.terms}>
                Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý
                với điều khoản sử dụng của chúng tôi
            </Text>
        </View>
    );
};

export default AuthFormWrapper;

const styles = StyleSheet.create({
    logoWrapper: {
        alignItems: 'center',
    },
    logo: {
        width: windowWidth(54),
        height: windowWidth(54),
        flexShrink: 0,
        borderRadius: windowWidth(10),
    },
    terms: {
        paddingBottom: 15,
        marginTop: -10,
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});
