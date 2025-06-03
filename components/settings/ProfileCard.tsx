import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    title: string;
    subtitle?: string;
    avatarUrl?: string;
    readonly?: boolean;
    dialogName?: string;

    setDialogName?: (_value: string) => void;
};

const ProfileCard = ({
    title,
    subtitle,
    avatarUrl,
    readonly = false,
    dialogName,
    setDialogName,
}: Props) => {
    return (
        <Pressable
            onPress={() =>
                setDialogName && dialogName && setDialogName(dialogName)
            }
            style={({ pressed }) => [
                styles.container,
                avatarUrl && { height: 104 },
                { backgroundColor: pressed ? '#0000000d' : '#fff' },
            ]}
        >
            <View style={[styles.content, avatarUrl && { gap: 10 }]}>
                <Text style={styles.title}>{title}</Text>
                {avatarUrl ? (
                    <Image
                        source={avatarUrl}
                        contentFit="cover"
                        style={styles.avatar}
                    />
                ) : (
                    <Text style={styles.subtitle}>
                        {subtitle ?? 'Chưa cập nhật'}
                    </Text>
                )}
            </View>

            {!readonly && (
                <View style={styles.iconBtn}>
                    <FontAwesome6
                        name="chevron-right"
                        solid
                        size={16}
                        color="#000"
                    />
                </View>
            )}
        </Pressable>
    );
};

export default ProfileCard;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: 62,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#dee3e9',
        paddingHorizontal: 16,
    },
    content: {
        height: '100%',
        gap: 1,
        justifyContent: 'center',
    },
    title: {
        flexShrink: 0,
        fontSize: 16,
        fontWeight: 600,
    },
    subtitle: {
        fontSize: 15,
        opacity: 0.8,
    },
    iconBtn: {
        position: 'absolute',
        paddingHorizontal: 16,
        right: 0,
        top: '36%',
        height: 66,
        alignItems: 'center',
        opacity: 0.7,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 9999,
    },
});
