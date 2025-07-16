import { useLastMaterialTracking } from '@/hooks/useLastMaterialTracking';
import { ContentType } from '@/types/enums/lesson-material.enum';
import { Folder } from '@/types/models/folder.model';
import { LessonMaterial } from '@/types/models/lesson-material.model';
import { FontAwesome6 } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface MaterialProps {
    index: number;
    material: LessonMaterial;
    folderIndex: number;
    onClose: () => void;
    isActive?: boolean;
    folder: Folder;
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
    const { id: materialId, folderId } = useLocalSearchParams();

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

    const formatSeconds = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`;
    };

    const redirect = () => {
        onClose();
        setLastLesson(folder.classId + '', folder.id + '', material.id);

        router.push(
            // @ts-ignore
            `/learn/${material.id}?classId=${folder.classId}&folderId=${folder.id}`
        );
    };

    const isCurrentMaterial =
        material.id === materialId && folder.id === folderId;

    return (
        <Pressable
            onPress={redirect}
            style={({ pressed }) => [
                styles.material,
                { backgroundColor: pressed ? '#32353b' : '#272a31' },
                {
                    backgroundColor: isCurrentMaterial ? '#181d1e' : '#272a31',
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
                    ]}
                >
                    {folderIndex + 1}.{index + 1} {material.title}
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
