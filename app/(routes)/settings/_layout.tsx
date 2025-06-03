import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const _layout = () => {
    return (
        <View style={styles.container}>
            {/* Background Layer */}
            <LinearGradient
                colors={['#fede8a', '#f8a6c2', '#b16dff', '#0f8bff', '#00e676']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.background}
            />

            {/* Content Layer */}
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor="transparent"
                    translucent
                />
                {/* Stack Navigation */}
                <Stack
                    screenOptions={{
                        animation: 'fade',
                        headerShown: false,
                        contentStyle: { backgroundColor: 'transparent' },
                    }}
                />
            </SafeAreaView>
        </View>
    );
};

export default _layout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.08,
    },
});
