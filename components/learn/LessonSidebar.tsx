import { windowHeight, windowWidth } from '@/constants/app.constants';
import { Folder as FolderModel } from '@/types/models/folder.model';
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
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import Folder from './Folder';

interface LessonSidebarProps {
    visible: boolean;
    onClose: () => void;
    folders: FolderModel[];
}

const { width } = Dimensions.get('window');

const LessonSidebar: React.FC<LessonSidebarProps> = ({
    visible,
    onClose,
    folders,
}) => {
    const [slideAnim] = React.useState(new Animated.Value(width));
    const { folderId } = useLocalSearchParams();

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
                    <Text style={styles.sidebarHeaderText}>
                        Nội dung học tập
                    </Text>
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

                {/* Search */}
                <View style={{ padding: 16, paddingTop: 8 }}>
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
                            textColor="#fff"
                            placeholder="Tìm kiếm..."
                            placeholderTextColor="#fff"
                            mode="flat"
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                            theme={{
                                colors: { text: '#fff', placeholder: '#fff' },
                            }}
                        />
                    </View>
                </View>

                {/* Folders */}
                <View
                    style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
                >
                    {folders.map((folder, index) => {
                        let currentFolderId;
                        if (typeof folderId === 'string') {
                            currentFolderId = folderId;
                        } else if (Array.isArray(folderId)) {
                            currentFolderId = folderId[0];
                        } else {
                            currentFolderId = undefined;
                        }
                        const isActive = folder.id === currentFolderId;
                        return (
                            <Folder
                                key={folder.id}
                                index={index}
                                folder={folder}
                                onClose={onClose}
                                isActive={isActive}
                            />
                        );
                    })}
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
        height: windowHeight(26),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: windowWidth(8),
    },

    input: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        fontSize: 16,
        color: '#fff',
        borderColor: 'transparent',
        borderWidth: 0,
        backgroundColor: 'transparent',
        textAlignVertical: 'center',
    },
});

export default LessonSidebar;
