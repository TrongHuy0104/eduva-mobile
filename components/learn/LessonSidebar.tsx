import { useLessonData } from '@/contexts/lesson-data.context';
import { useSearch } from '@/contexts/search.context';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Animated,
    BackHandler,
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Folder from './Folder';

interface LessonSidebarProps {
    visible: boolean;
    onClose: () => void;
}

const { width } = Dimensions.get('window');

interface SidebarMethods {
    show: () => void;
    hide: (callback?: () => void) => void;
    toggle: () => void;
}

const LessonSidebar = React.forwardRef<SidebarMethods, LessonSidebarProps>(
    ({ visible: propVisible, onClose }, ref) => {
        const [isVisible, setIsVisible] = React.useState(false);
        const slideAnim = React.useRef(new Animated.Value(width)).current;
        const { folderId } = useLocalSearchParams();
        const { folders } = useLessonData();
        const isMounted = React.useRef(true);

        // Expose methods via ref
        React.useImperativeHandle(ref, () => ({
            show: () => {
                if (!isMounted.current) return;
                showSidebar();
            },
            hide: (callback?: () => void) => {
                if (!isMounted.current) return;
                hideSidebar(callback);
            },
            toggle: () => {
                if (!isMounted.current) return;
                if (isVisible) {
                    hideSidebar();
                } else {
                    showSidebar();
                }
            },
        }));

        // Cleanup on unmount
        React.useEffect(() => {
            return () => {
                isMounted.current = false;
            };
        }, []);
        const {
            searchTerm,
            setSearchTerm,
            searchResults,
            setSearchResults,
            isSearchActive,
            setIsSearchActive,
            clearSearch,
        } = useSearch();

        const showSidebar = React.useCallback(() => {
            setIsVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }, [slideAnim]);

        const hideSidebar = React.useCallback(
            (callback?: () => void) => {
                Animated.timing(slideAnim, {
                    toValue: width,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    setIsVisible(false);
                    if (callback) callback();
                });
            },
            [slideAnim]
        );

        // Filter folders and materials by search term
        const filteredFolders = React.useMemo(() => {
            if (!searchTerm.trim()) {
                return folders;
            }

            const lowerSearch = searchTerm.toLowerCase();
            return folders
                .map((folder) => {
                    const filteredMaterials = folder.lessonMaterials?.filter(
                        (material) =>
                            material.title.toLowerCase().includes(lowerSearch)
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
        }, [searchTerm, folders, setIsSearchActive, setSearchResults]);

        // Handle external visibility changes
        React.useEffect(() => {
            if (!isMounted.current) return;

            if (propVisible) {
                showSidebar();
            } else {
                hideSidebar();
            }
        }, [propVisible, showSidebar, hideSidebar]);

        // Handle back button press on Android
        React.useEffect(() => {
            const backAction = () => {
                if (isVisible) {
                    hideSidebar(onClose);
                    return true;
                }
                return false;
            };

            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction
            );

            return () => backHandler.remove();
        }, [isVisible, onClose, hideSidebar]);

        return (
            <Modal
                visible={isVisible}
                transparent
                animationType="none"
                onRequestClose={() => hideSidebar(onClose)}
            >
                <TouchableWithoutFeedback onPress={() => hideSidebar(onClose)}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[
                        styles.sidebar,
                        { transform: [{ translateX: slideAnim }] },
                    ]}
                >
                    <View style={styles.sidebarHeader}>
                        <Text
                            style={[
                                styles.sidebarHeaderText,
                                { maxWidth: '70%' },
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {isSearchActive
                                ? `Tìm kiếm: "${searchTerm}"`
                                : 'Nội dung học tập'}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
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
                                <Ionicons
                                    name="search"
                                    size={22}
                                    color="#fff"
                                />
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
                    <ScrollView
                        style={{
                            overflowY: 'auto',
                            overscrollBehavior: 'contain',
                        }}
                    >
                        {filteredFolders.length === 0 ? (
                            <Text style={{ color: '#fff', padding: 16 }}>
                                {isSearchActive
                                    ? `Không tìm thấy kết quả cho "${searchTerm}"`
                                    : 'Không có dữ liệu'}
                            </Text>
                        ) : (
                            <>
                                {isSearchActive && (
                                    <View
                                        style={{
                                            padding: 16,
                                            paddingBottom: 8,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#fff',
                                                fontSize: 14,
                                            }}
                                        >
                                            Tìm thấy {searchResults.length} kết
                                            quả
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
                                    const isActive =
                                        folder.id === currentFolderId;
                                    // Tìm index gốc của folder trong mảng folders ban đầu
                                    const originalIndex = folders.findIndex(
                                        (f) => f.id === folder.id
                                    );
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
                    </ScrollView>
                </Animated.View>
            </Modal>
        );
    }
);

// Add display name for debugging
LessonSidebar.displayName = 'LessonSidebar';

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

LessonSidebar.displayName = 'LessonSidebar';

export default LessonSidebar;
