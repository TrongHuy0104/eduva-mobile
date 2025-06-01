import {
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    useFonts,
} from '@expo-google-fonts/roboto';
import { Stack } from 'expo-router';
import React from 'react';

const Layout = () => {
    const [loaded] = useFonts({
        Roboto_300Light,
        Roboto_400Regular,
        Roboto_700Bold,
        Roboto_600SemiBold,
        Roboto_500Medium,
    });

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
        </Stack>
    );
};

export default Layout;
