import { FontAwesome6 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import GradientButton from '../GradientButton';

interface FooterProps {
    onSidebarOpen?: () => void;
}

const Footer = ({ onSidebarOpen }: FooterProps) => {
    return (
        <BlurView intensity={80} tint="dark" style={styles.container}>
            <View style={styles.overlay} />

            <Pressable
                style={({ pressed }) => [
                    styles.commentBtn,
                    { backgroundColor: pressed ? '#2e4a8d' : '#292d35' },
                ]}
            >
                <Image
                    style={{
                        width: '100%',
                        height: 16,
                    }}
                    source={require('../../assets/images/question-mark.svg')}
                    contentFit="contain"
                    transition={1000}
                />
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    styles.sidebarBtn,
                    { backgroundColor: pressed ? '#2e4a8d' : '#292d35' },
                ]}
                onPress={onSidebarOpen}
            >
                <Image
                    style={{
                        width: '100%',
                        height: 14,
                    }}
                    source={require('../../assets/images/three-bars.svg')}
                    contentFit="contain"
                    transition={1000}
                />
            </Pressable>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <GradientButton
                    variant="text"
                    text="Bài trước"
                    iconLeft={
                        <FontAwesome6
                            name="arrow-left"
                            size={14}
                            color="white"
                        />
                    }
                ></GradientButton>
                <GradientButton
                    variant="outline"
                    text="Bài tiếp theo"
                    iconRight={
                        <FontAwesome6
                            name="arrow-right"
                            size={14}
                            color="white"
                        />
                    }
                ></GradientButton>
            </View>
        </BlurView>
    );
};

export default Footer;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#191d1e99',
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#191d1ecc',
    },
    commentBtn: {
        position: 'absolute',
        top: -60,
        right: 30,
        width: 40,
        height: 40,
        borderRadius: 9999,
        backgroundColor: '#292d35',
        borderWidth: 1,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sidebarBtn: {
        width: 40,
        height: 40,
        borderRadius: 9999,
        backgroundColor: '#292d35',
        borderWidth: 1,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
