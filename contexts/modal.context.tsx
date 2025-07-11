import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { createContext, useContext, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface ModalContextType {
    isOpen: boolean;
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
    modalContent: React.ReactNode;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const { width } = Dimensions.get('window');

interface ModalProviderProps {
    children: React.ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);

    const openModal = (content: React.ReactNode) => {
        setModalContent(content);
        setIsOpen(true);
    };
    const closeModal = () => {
        setIsOpen(false);
        setModalContent(null);
    };

    return (
        <>
            <ModalContext.Provider
                value={{ isOpen, openModal, closeModal, modalContent }}
            >
                {children}

                <Modal visible={isOpen} transparent animationType="fade">
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => {
                            closeModal();
                        }}
                    >
                        <Pressable
                            style={styles.modalContent}
                            onPress={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                        >
                            {/* Multiple gradient layers to recreate the CSS effect */}
                            <LinearGradient
                                colors={['#0065e0', '#0f8bff']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.background}
                            />
                            <LinearGradient
                                colors={[
                                    'transparent',
                                    'transparent',
                                    '#00e676',
                                ]}
                                locations={[0, 0.65, 0.95]}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={styles.background}
                            />
                            <LinearGradient
                                colors={['#ffffff40', '#fff0']}
                                locations={[0, 0.4]}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.background}
                            />
                            <LinearGradient
                                colors={[
                                    '#fede8a',
                                    '#f8a6c2',
                                    '#f8a6c266',
                                    'transparent',
                                ]}
                                locations={[0, 0.3, 0.41, 0.52]}
                                start={{ x: 1, y: 0.68 }}
                                end={{ x: 0, y: 0.32 }}
                                style={styles.background}
                            />
                            <LinearGradient
                                colors={['#b16dff', 'transparent']}
                                locations={[0, 0.46]}
                                start={{ x: 1, y: 0.68 }}
                                end={{ x: 0, y: 0.32 }}
                                style={styles.background}
                            />

                            <View style={styles.btnsGroup}>
                                <Pressable
                                    onPress={() => {
                                        closeModal();
                                    }}
                                    style={({ pressed }) => [
                                        styles.closeBtn,
                                        {
                                            backgroundColor: pressed
                                                ? '#0003'
                                                : '#0000001a',
                                        },
                                    ]}
                                >
                                    <FontAwesome6
                                        name="xmark"
                                        solid
                                        size={20}
                                        color="#000"
                                    />
                                </Pressable>
                            </View>
                            {modalContent}
                        </Pressable>
                        <Toast position="top" />
                    </Pressable>
                </Modal>
            </ModalContext.Provider>
        </>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context)
        throw new Error('useModal must be used within a ModalProvider');
    return context;
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: '#000000b3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width - 32, // <-- set width to 100% - 32
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingTop: 10,
        paddingHorizontal: 30,
        paddingBottom: 30,
        color: '#1d2129',
        overflow: 'hidden',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.08,
    },
    btnsGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: -18,
    },
    closeBtn: {
        marginLeft: 'auto',
        width: 40,
        height: 40,
        borderRadius: 9999,
        opacity: 0.7,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
