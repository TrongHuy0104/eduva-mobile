import { useLessonData } from '@/contexts/lesson-data.context';
import { useSearch } from '@/contexts/search.context';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Folder from './Folder';

interface LessonSidebarProps {
    visible: boolean;
    onClose: () => void;
}

const { width } = Dimensions.get('window');

const LessonSidebar: React.FC<LessonSidebarProps> = ({ visible, onClose }) => {
    const [slideAnim] = React.useState(new Animated.Value(width));
    const { folderId } = useLocalSearchParams();
    const { folders } = useLessonData();
    const {
        searchTerm,
        setSearchTerm,
        searchResults,
        setSearchResults,
        isSearchActive,
        setIsSearchActive,
        clearSearch,
    } = useSearch();

    // Filter folders and materials by search term
    const filteredFolders = React.useMemo(() => {
        if (!searchTerm.trim()) {
            return folders;
        }

        const lowerSearch = searchTerm.toLowerCase();
        return folders
            .map((folder) => {
                const filteredMaterials = folder.lessonMaterials?.filter(
                    (material) => material.title.toLowerCase().includes(lowerSearch)
                );
                if (filteredMaterials && filteredMaterials.length > 0) {
                    return {
                        ...folder,
                        lessonMaterials: filteredMaterials,
                        countLessonMaterials: filteredMaterials.length,
                    };
                }
                return null;
            })
            .filter(Boolean) as typeof folders;
    }, [folders, searchTerm]);

    // Update search context when search term changes
    React.useEffect(() => {
        if (!searchTerm.trim()) {
            setIsSearchActive(false);
            setSearchResults([]);
            return;
        }

        const lowerSearch = searchTerm.toLowerCase();
        const results: { material: any; folder: any }[] = [];

        folders.forEach((folder) => {
            folder.lessonMaterials?.forEach((material) => {
                if (material.title.toLowerCase().includes(lowerSearch)) {
                    results.push({ material, folder });
                }
            });
        });

        setSearchResults(results);
        setIsSearchActive(true);
    }, [searchTerm, folders]);

    React.useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: width,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, slideAnim]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>
            <Animated.View
                style={[
                    styles.sidebar,
                    { transform: [{ translateX: slideAnim }] },
                ]}
            >
                <View style={styles.sidebarHeader}>
                    <Text style={[styles.sidebarHeaderText, {maxWidth: '70%'}]} numberOfLines={1} ellipsizeMode="tail">
                        {isSearchActive ? `Tìm kiếm: "${searchTerm}"` : 'Nội dung học tập'}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {isSearchActive && (
                            <Pressable
                                onPress={clearSearch}
                                style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 8,
                                }}
                            >
                                <FontAwesome6
                                    name="times-circle"
                                    solid
                                    size={16}
                                    color="#ff6b6b"
                                />
                            </Pressable>
                        )}
                        <Pressable
                            onPress={onClose}
                            style={{
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                            }}
                        >
                            <FontAwesome6
                                name="xmark"
                                solid
                                size={18}
                                color="#fff"
                            />
                        </Pressable>
                    </View>
                </View>

                {/* Search */}
                    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                    <View style={[styles.searchWrapper]}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                { opacity: pressed ? 1 : 0.7 },
                            ]}
                        >
                            <Ionicons name="search" size={22} color="#fff" />
                        </Pressable>
                        <TextInput
                            style={styles.input}
                            placeholder="Tìm kiếm..."
                            placeholderTextColor="#fff"
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />
                    </View>

                    </View>
                {/* Folders */}
                <View
                    style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
                >
                    {filteredFolders.length === 0 ? (
                        <Text style={{ color: '#fff', padding: 16 }}>
                            {isSearchActive ? `Không tìm thấy kết quả cho "${searchTerm}"` : 'Không có dữ liệu'}
                        </Text>
                    ) : (
                        <>
                            {isSearchActive && (
                                <View style={{ padding: 16, paddingBottom: 8 }}>
                                    <Text style={{ color: '#fff', fontSize: 14 }}>
                                        Tìm thấy {searchResults.length} kết quả
                                    </Text>
                                </View>
                            )}
                            {filteredFolders.map((folder) => {
                                let currentFolderId;
                                if (typeof folderId === 'string') {
                                    currentFolderId = folderId;
                                } else if (Array.isArray(folderId)) {
                                    currentFolderId = folderId[0];
                                } else {
                                    currentFolderId = undefined;
                                }
                                const isActive = folder.id === currentFolderId;
                                // Tìm index gốc của folder trong mảng folders ban đầu
                                const originalIndex = folders.findIndex(f => f.id === folder.id);
                                return (
                                    <Folder
                                        key={folder.id}
                                        index={originalIndex}
                                        folder={folder}
                                        onClose={onClose}
                                        isActive={isActive}
                                    />
                                );
                            })}
                        </>
                    )}
                </View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    sidebar: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#272a31',
        zIndex: 10,
    },
    sidebarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 16,
    },
    sidebarHeaderText: {
        fontSize: 16,
        color: '#fffc',
        fontWeight: '500',
    },
    searchWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        height: 40,
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 16,
        backgroundColor: '#323c4a',
    },

    button: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    input: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        height: 40,
        fontSize: 16,
        color: '#fff',
        borderColor: 'transparent',
        borderWidth: 0,
        backgroundColor: 'transparent',
        textAlignVertical: 'center',
    },
});

export default LessonSidebar;
