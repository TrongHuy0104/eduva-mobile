import { FontAwesome6 } from '@expo/vector-icons';
import React, { useState } from 'react';

import { FoldersLessonMaterialsResponse } from '@/types/responses/folders-lesson-materials-response';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Material from './Material';

interface FolderProps {
    folder: FoldersLessonMaterialsResponse;
    classId: string;
    index: number;
}

const Folder = ({ folder, classId, index }: FolderProps) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        if (isCollapsed) {
            setIsCollapsed(false);
        } else {
            setIsCollapsed(true);
        }
    };

    const lessonMaterials = folder.lessonMaterials;

    let lessonMaterialsContent = null;
    if (lessonMaterials && lessonMaterials.length > 0) {
        lessonMaterialsContent = lessonMaterials.map((material, index) => (
            <Material
                key={material.id}
                material={material}
                classId={classId}
                index={index}
                folderId={folder.id}
            />
        ));
    }

    return (
        <View style={styles.folderContainer}>
            <Pressable
                style={({ pressed }) => [
                    pressed && styles.buttonPressed,
                    styles.container,
                ]}
                onPress={toggleCollapse}
            >
                <View style={styles.titleContainer}>
                    <View style={{ marginTop: 1 }}>
                        <FontAwesome6
                            name={isCollapsed ? 'plus' : 'minus'}
                            size={16}
                            color="#0093fc"
                        />
                    </View>
                    <Text
                        style={styles.title}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {index + 1}. {folder.name}
                    </Text>
                </View>
                <Text style={styles.countMaterial}>
                    {folder.countLessonMaterials} bài học
                </Text>
            </Pressable>

            {/* Lesson Materials Section */}
            {!isCollapsed && <View>{lessonMaterialsContent}</View>}
        </View>
    );
};

export default Folder;

const styles = StyleSheet.create({
    folderContainer: {
        marginBottom: 8,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ebebeb',
    },
    buttonPressed: {
        opacity: 0.7,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1d2129',
        maxWidth: 250,
    },
    countMaterial: {
        fontSize: 14,
        color: '#242424',
    },
    materialContainer: {
        width: '100%',
        height: 40,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
        marginBottom: 8,
    },
});
