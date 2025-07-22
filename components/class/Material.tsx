import { useLastMaterialTracking } from '@/hooks/useLastMaterialTracking';
import { ContentType } from '@/types/enums/lesson-material.enum';
import { LessonMaterial } from '@/types/models/lesson-material.model';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface MaterialProps {
    material: LessonMaterial;
    classId: string;
    index: number;
    folderId: string;
}

const Material = ({ material, classId, index, folderId }: MaterialProps) => {
    const { setLastLesson } = useLastMaterialTracking();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const formatSeconds = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`;
    };

    const redirect = async () => {
        if (isRedirecting) return; // Prevent multiple redirects
        
        try {
            setIsRedirecting(true);
            await setLastLesson(classId, folderId, material.id);
            router.push(
                // @ts-ignore
                `/learn/${material.id}?classId=${classId}&folderId=${folderId}`
            );
        } finally {
            // Reset after a short delay to prevent rapid re-taps
            setTimeout(() => {
                setIsRedirecting(false);
            }, 1000);
        }
    };

    const getIcon = () => {
        if (material.contentType === ContentType.DOCX) {
            return 'file-word';
        } else if (material.contentType === ContentType.PDF) {
            return 'file-pdf';
        } else if (material.contentType === ContentType.Audio) {
            return 'volume-high';
        } else if (material.contentType === ContentType.Video) {
            return 'circle-play';
        }
    };
    return (
        <Pressable
            style={({ pressed }) => [
                pressed && !isRedirecting && styles.buttonPressed,
                styles.materialItem,
                isRedirecting && styles.disabled
            ]}
            onPress={redirect}
            disabled={isRedirecting}
        >
            <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            >
                <View style={styles.materialIcon}>
                    <FontAwesome6
                        name={getIcon()}
                        solid
                        size={16}
                        color="#2093e7"
                    />
                </View>
                <Text style={styles.materialTitle} numberOfLines={1}>
                    {index + 1}. {material.title}
                </Text>
            </View>
            <Text style={{ fontSize: 14, color: '#242424' }} numberOfLines={1}>
                {formatSeconds(material.duration)}
            </Text>
        </Pressable>
    );
};

export default Material;

const styles = StyleSheet.create({
    materialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 8,
        minHeight: 48,
        borderRadius: 6,
    },
    disabled: {
        opacity: 0.6,
    },
    materialIcon: {
        alignItems: 'center',
        marginTop: 1,
        marginLeft: 1,
    },
    materialTitle: {
        fontSize: 15,
        color: '#242424',
        maxWidth: 260,
    },
    buttonPressed: {
        backgroundColor: '#f0f9ff',
    },
});
