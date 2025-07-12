import Header from '@/components/Header';
import { fontSizes } from '@/constants/app.constants';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/auth.context';
import { FontAwesome6 } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';

const Layout = () => {
    const { user } = useAuth();

    // Fully custom tab bar for all cases
    const CustomTabBar = ({ state, descriptors, navigation }: any) => (
        <View
            style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                height: 66,
                borderTopWidth: 1,
                borderColor: '#e8ebed',
                alignItems: 'center',
                justifyContent: 'space-evenly', // changed from 'center' to 'space-evenly'
                width: '100%',
            }}
        >
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                let icon = null;
                let label = '';
                if (route.name === 'home') {
                    icon = (
                        <FontAwesome6
                            name="house"
                            size={moderateScale(20)}
                            color={
                                isFocused
                                    ? Colors.light.tabIconSelected
                                    : Colors.light.tabIconDefault
                            }
                        />
                    );
                    label = 'Trang chủ';
                } else if (route.name === 'profile/index') {
                    icon = (
                        <FontAwesome6
                            solid
                            name="user"
                            size={moderateScale(20)}
                            color={
                                isFocused
                                    ? Colors.light.tabIconSelected
                                    : Colors.light.tabIconDefault
                            }
                        />
                    );
                    label = 'Cá nhân';
                }
                // Hide profile tab if user is not logged in
                if (route.name === 'profile/index' && !user) return null;
                return (
                    <Pressable
                        key={route.key}
                        onPress={() => {
                            if (route.name === 'home') {
                                // Always navigate to home index when home tab is pressed
                                router.push('/(tabs)/home');
                            } else {
                                router.push('/(tabs)/profile');
                            }
                        }}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                        android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
                    >
                        {icon}
                        <Text
                            style={{
                                color: isFocused
                                    ? '#1a1a1a'
                                    : Colors.light.tabIconDefault,
                                marginTop: 5,
                                fontWeight: '600',
                                fontSize: fontSizes.FONT14,
                                opacity: isFocused ? 1 : 0.7,
                            }}
                        >
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <Header />

            <Tabs
                screenOptions={{ headerShown: false }}
                tabBar={(props) => <CustomTabBar {...props} />}
            >
                <Tabs.Screen name="home" />
                <Tabs.Screen name="profile/index" />
            </Tabs>
        </SafeAreaView>
    );
};

export default Layout;
