import { LessonDataProvider } from '@/contexts/lesson-data.context';
import { SearchProvider } from '@/contexts/search.context';
import {
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    useFonts,
} from '@expo-google-fonts/roboto';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React from 'react';

import { AuthProvider } from '@/contexts/auth.context';
import { ModalProvider } from '@/contexts/modal.context';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 15 * 60 * 1000, // 15 minutes
            retry: (failureCount, error: any) => {
                // Don't retry on 401 errors
                if (error?.response?.status === 401) return false;
                return failureCount < 3;
            },
        },
        mutations: {
            retry: false,
        },
    },
});

const Layout = () => {
    const [fontsLoaded] = useFonts({
        Roboto_300Light,
        Roboto_400Regular,
        Roboto_700Bold,
        Roboto_600SemiBold,
        Roboto_500Medium,
    });

    if (!fontsLoaded) {
        return null; // or a loading spinner
    }

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <LessonDataProvider>
                    <SearchProvider>
                        <ModalProvider>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="index" />
                                <Stack.Screen name="(tabs)" />
                            </Stack>
                        </ModalProvider>
                    </SearchProvider>
                </LessonDataProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default Layout;
