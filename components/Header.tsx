import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, usePathname } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, TextInput, View } from 'react-native';

import {
    fontSizes,
    windowHeight,
    windowWidth,
} from '@/constants/app.constants';
import Toast from 'react-native-toast-message';
import UserActions from './UserActions';

const Header = () => {
    const borderAnim = useRef(new Animated.Value(0)).current;
    const pathname = usePathname();

    const isLearnRoute = pathname.startsWith('/learn');

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
        outputRange: isLearnRoute ? ['#181d1e', '#444'] : ['#e8e8e8', '#444'],
    });

    return (
        <View>
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: isLearnRoute ? '#191d1e' : '#fff',
                        borderBottomColor: isLearnRoute ? '#323c4a' : '#e8ebed',
                    },
                ]}
            >
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

                {/* Search - Hide on learn route */}

                <Animated.View
                    style={[
                        styles.searchWrapper,
                        { borderColor },
                        { backgroundColor: isLearnRoute ? '#272a31' : '#fff' },
                    ]}
                >
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            { opacity: pressed ? 1 : 0.7 },
                            {
                                backgroundColor: isLearnRoute
                                    ? '#272a31'
                                    : '#fff',
                            },
                        ]}
                    >
                        <Ionicons
                            name="search"
                            size={26}
                            color={isLearnRoute ? '#fff' : '#404040'}
                        />
                    </Pressable>
                    <TextInput
                        style={styles.input}
                        placeholder="Tìm kiếm..."
                        placeholderTextColor={isLearnRoute ? '#fff' : '#404040'}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </Animated.View>

                {/*  */}

                {/* User Actions */}
                <UserActions />

                <Toast position="top" />
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
        height: windowHeight(50),
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
        width: windowWidth(46),
        height: windowWidth(46),
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
        height: windowHeight(30),
        paddingRight: windowWidth(12),
        paddingLeft: windowWidth(8),
        borderRadius: windowWidth(30),
        borderWidth: windowWidth(2),
        borderColor: '#e8e8e8',
    },

    button: {
        height: windowHeight(26),
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
