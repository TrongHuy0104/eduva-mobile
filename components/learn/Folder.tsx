import { FoldersLessonMaterialsResponse } from '@/types/responses/folders-lesson-materials-response';
import { FontAwesome6 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Material from './Material';

interface FolderProps {
    folder: FoldersLessonMaterialsResponse;
    index: number;
    onClose: () => void;
    isActive: boolean;
}

const Folder = ({ folder, index, onClose, isActive }: FolderProps) => {
    const { folderId: currentFolderId } = useLocalSearchParams();

    const [isExpanded, setIsExpanded] = useState(currentFolderId === folder.id);

    const rotateAnim = useRef(new Animated.Value(0)).current;

    const toggleExpanded = () => {
        setIsExpanded((prev) => !prev);
    };

    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: isExpanded ? 1 : 0,
            duration: 250,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [isExpanded, rotateAnim]);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const getFolderDurationFormatted = () => {
        let totalDuration = 0;
    
        folder.lessonMaterials?.forEach(material => {
          totalDuration += material.duration || 0;
        });
    
        const hours = Math.floor(totalDuration / 3600);
        const minutes = Math.floor((totalDuration % 3600) / 60);
    
        if (hours >= 1) {
          const paddedHours = String(hours).padStart(2, '0');
          const paddedMinutes = String(minutes).padStart(2, '0');
          return `${paddedHours} giờ ${paddedMinutes} phút`;
        } else if (minutes > 0) {
          return `${minutes} phút`;
        } else {
          return `0 phút`;
        }
      };


    return (
        <View>
            <Pressable
                onPress={toggleExpanded}
                style={({ pressed }) => [
                    styles.folder,
                    { backgroundColor: pressed ? '#32353b' : '#272a31' },
                    { backgroundColor: isActive ? '#32353b' : '#272a31' },
                ]}
            >
                <View>
                    <Text style={styles.folderName}>
                        {index + 1}. {folder.name}
                    </Text>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <Text style={styles.folderDesc}>
                            {folder.countLessonMaterials} bài
                        </Text>
                        <Text
                            style={[
                                styles.folderDesc,
                                { marginHorizontal: 6, fontSize: 12 },
                            ]}
                        >
                            |
                        </Text>
                        <Text style={styles.folderDesc}>{getFolderDurationFormatted()}</Text>
                    </View>
                </View>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <FontAwesome6 name="angle-down" size={20} color="#808b9a" />
                </Animated.View>
            </Pressable>

            {/* Materials */}
            {isExpanded && (
                <View>
                    {folder.lessonMaterials?.map((material, materialIndex) => {
                        return (
                            <Material
                                key={material.id}
                                index={materialIndex}
                                folderIndex={index}
                                material={material}
                                onClose={onClose}
                                folder={folder}
                            />
                        );
                    })}
                </View>
            )}
        </View>
    );
};

export default Folder;

const styles = StyleSheet.create({
    folder: {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#181d1e',
        paddingHorizontal: 16,
        paddingBottom: 12,
        paddingTop: 8,
    },
    folderName: {
        fontSize: 18,
        fontWeight: '500',
        color: '#ffffffe6',
    },
    folderDesc: {
        fontSize: 14,
        color: '#808b9a',
        marginTop: 4,
    },
});
