import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, TextInput, View } from 'react-native';

import {
    fontSizes,
    windowHeight,
    windowWidth,
} from '@/constants/app.constants';
import UserActions from './UserActions';

const Header = () => {
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        Animated.timing(borderAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
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
                    <Pressable
                        //@ts-ignore
                        onPress={() => router.push('/(tabs)/home')}
                        style={{ display: 'flex', borderRadius: 10 }}
                    >
                        <Image
                            style={styles.logo}
                            source={require('../assets/images/logo.png')}
                            contentFit="contain"
                            transition={1000}
                        />
                    </Pressable>
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

                {/* User Actions */}
                <UserActions />
                {/*  */}
            </View>
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
        paddingRight: windowWidth(12),
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
        fontSize: 16,
        borderWidth: 0,
        color: '#000',
        textAlignVertical: 'center',
        paddingVertical: 0,
    },
});
