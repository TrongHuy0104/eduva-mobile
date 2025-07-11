// components/GradientText.tsx
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface GradientTextProps {
    text: string;
    style?: TextStyle;
}

const GradientText: React.FC<GradientTextProps> = ({ text, style }) => (
    <MaskedView maskElement={<Text style={[styles.text, style]}>{text}</Text>}>
        <LinearGradient
            colors={['#4dbfe9', '#2093e7', '#22cfd2']}
            locations={[0, 0.5, 1]}
            start={{ x: 0.33, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <Text style={[styles.text, style, { opacity: 0 }]}>{text}</Text>
        </LinearGradient>
    </MaskedView>
);

const styles = StyleSheet.create({
    text: {
        fontWeight: 'bold',
        fontSize: 32,
    },
});

export default GradientText;
