import { fontSizes, IsAndroid, IsIOS, IsIPAD } from '@/constants/app.constants';
import { Colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const _layout = () => {
    return (
        <Tabs
            screenOptions={({ route }) => {
                return {
                    tabBarIcon: ({ color, focused }) => {
                        let iconName;
                        const iconStyle = {
                            width: IsIPAD ? scale(18) : 'auto',
                            marginTop: 5,
                            opacity: focused ? 1 : 0.7,
                        };
                        if (route.name === 'index') {
                            iconName = (
                                <FontAwesome6
                                    name="house"
                                    size={moderateScale(20)}
                                    style={iconStyle}
                                    color={color}
                                />
                            );
                        } else if (route.name === 'personal/index') {
                            iconName = (
                                <FontAwesome6
                                    solid
                                    name="user"
                                    size={moderateScale(20)}
                                    style={iconStyle}
                                    color={color}
                                />
                            );
                        }
                        return iconName;
                    },
                    tabBarActiveTintColor: Colors.light.tabIconSelected,
                    tabBarInactiveTintColor: Colors.light.tabIconDefault,
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarLabel: ({ focused, color }) => {
                        if (route.name === 'index') {
                            return (
                                <Text
                                    style={{
                                        color: focused ? '#1a1a1a' : color,
                                        marginTop: 5,
                                        fontWeight: '600',
                                        fontSize: fontSizes.FONT14,
                                        opacity: focused ? 1 : 0.7,
                                    }}
                                >
                                    Trang chủ
                                </Text>
                            );
                        } else if (route.name === 'personal/index') {
                            return (
                                <Text
                                    style={{
                                        color: focused ? '#1a1a1a' : color,
                                        marginTop: 5,
                                        fontWeight: '600',
                                        fontSize: fontSizes.FONT14,
                                    }}
                                >
                                    Cá nhân
                                </Text>
                            );
                        }
                    },
                    tabBarItemStyle: {
                        backgroundColor: '#fff',
                    },
                    tabBarButton: (props) => {
                        const { ref, ...rest } = props;
                        return (
                            <Pressable
                                {...rest}
                                style={({ pressed }) => [
                                    props.style,
                                    {
                                        backgroundColor: pressed
                                            ? '#fff'
                                            : undefined,
                                        borderRadius: 12,
                                    },
                                ]}
                            />
                        );
                    },
                    tabBarStyle: {
                        position: IsIOS ? 'static' : 'absolute',
                        borderTopLeftRadius: IsAndroid
                            ? 0
                            : IsIPAD
                            ? scale(20)
                            : scale(35),
                        borderTopRightRadius: IsAndroid
                            ? 0
                            : IsIPAD
                            ? scale(20)
                            : scale(35),
                        borderTopWidth: 1,
                        borderColor: '#e8ebed',
                        height: verticalScale(60),
                        opacity: 1,
                        transition: 'opacity 0.3s ease-in-out',
                    },
                };
            }}
        ></Tabs>
    );
};

export default _layout;
