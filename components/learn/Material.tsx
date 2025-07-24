import { useSearch } from '@/contexts/search.context';
import { useLastMaterialTracking } from '@/hooks/useLastMaterialTracking';
import { ContentType } from '@/types/enums/lesson-material.enum';
import { LessonMaterial } from '@/types/models/lesson-material.model';
import { FoldersLessonMaterialsResponse } from '@/types/responses/folders-lesson-materials-response';
import { FontAwesome6 } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface MaterialProps {
    index: number;
    material: LessonMaterial;
    folderIndex: number;
    onClose: () => void;
    isActive?: boolean;
    folder: FoldersLessonMaterialsResponse;

}

const Material = ({
    index,
    material,
    folderIndex,
    onClose,
    folder,
    isActive,

}: MaterialProps) => {
    const { setLastLesson } = useLastMaterialTracking();
    const { id: materialId, folderId, classId } = useLocalSearchParams();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const { searchTerm, isSearchActive } = useSearch();

    const getIcon = () => {
        if (material.contentType === ContentType.DOCX) {
            return 'file-word';
        } else if (material.contentType === ContentType.PDF) {
            return 'file-pdf';
        } else if (material.contentType === ContentType.Audio) {
            return 'volume-high';
        } else if (material.contentType === ContentType.Video) {
            return 'circle-play';        }
    };

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
            await setLastLesson(classId + '', folder.id + '', material.id);

            router.push(
                // @ts-ignore
                `/learn/${material.id}?classId=${folder.classId}&folderId=${folder.id}`
            );
            onClose();
        } finally {
            // Reset after a short delay to prevent rapid re-taps
            setTimeout(() => {
                setIsRedirecting(false);
            }, 1000);
        }
    };

    const isCurrentMaterial =
        material.id === materialId && folder.id === folderId;

    return (
        <Pressable
            onPress={redirect}
            disabled={isRedirecting || isCurrentMaterial}
            style={({ pressed }) => [
                styles.material,
                {
                    backgroundColor:
                        pressed && !isRedirecting ? '#32353b' : '#272a31',
                },
                {
                    backgroundColor: isCurrentMaterial ? '#181d1e' : '#272a31',
                    opacity: isRedirecting ? 0.5 : 1,
                },
            ]}
        >
            <View style={styles.materialIcon}>
                <FontAwesome6
                    name={getIcon()}
                    solid
                    size={16}
                    color={isCurrentMaterial ? '#0f8bff' : '#808b9a'}
                />
            </View>
            <View style={{ marginLeft: 10 }}>
                <Text
                    style={[
                        styles.materialTitle,
                        isActive && { color: '#FFD700' },
                        isSearchActive && { color: '#fff' },
                    ]}
                >
                    {`${folderIndex + 1}.${index + 1} ${material.title}`}
                </Text>
                <Text style={styles.materialTime}>
                    {formatSeconds(material.duration)}
                </Text>
            </View>
        </Pressable>
    );
};

export default Material;

const styles = StyleSheet.create({
    material: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#181d1e',
    },
    materialIcon: {
        alignItems: 'center',
        marginTop: 1,
        marginLeft: 1,
    },
    materialTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffffe6',
    },
    materialTime: {
        fontSize: 14,
        fontWeight: '400',
        color: '#808b9a',
        marginTop: 4,
    },
});
