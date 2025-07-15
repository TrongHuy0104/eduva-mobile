import { useLessonMaterials } from '@/hooks/useLessonMaterial';
import { useToast } from '@/hooks/useToast';
import { Folder as FolderModel } from '@/types/models/folder.model';
import { FontAwesome6 } from '@expo/vector-icons';
import React, { useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';
import Material from './Material';
const SkeletonLoading = require('expo-skeleton-loading').default;

interface FolderProps {
    folder: FolderModel;
    classId: string;
    index: number;
}

const Folder = ({ folder, classId, index }: FolderProps) => {
    const toast = useToast();
    const [isCollapsed, setIsCollapsed] = useState(true);

    const {
        data: lessonMaterials,
        isPending,
        error,
    } = useLessonMaterials(folder.id, { classId }, !isCollapsed);

    const toggleCollapse = () => {
        if (isCollapsed) {
            setIsCollapsed(false);
        } else {
            setIsCollapsed(true);
        }
    };

    if (error) toast.errorGeneral();

    let lessonMaterialsContent = null;
    if (!isCollapsed) {
        if (isPending) {
            lessonMaterialsContent = (
                <SkeletonLoading background="#e0e0e0" highlight="#f5f5f5">
                    <View
                        style={{
                            position: 'relative',
                            width: '100%',
                            marginTop: 8,
                            backgroundColor: '#00000008',
                            overflow: 'hidden',
                        }}
                    >
                        {[1, 2, 3].map((index) => (
                            <View
                                key={index}
                                style={styles.materialContainer}
                            ></View>
                        ))}
                    </View>
                </SkeletonLoading>
            );
        } else if (lessonMaterials && lessonMaterials.length > 0) {
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
                    {folder.countLessonMaterial} bài học
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
