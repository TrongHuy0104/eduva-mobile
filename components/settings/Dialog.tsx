import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'; // <-- import Dimensions

type Props = {
    title?: string;
    desc?: string;
    setDialogName: (_name: string) => void;
    children?: React.ReactNode;
};

const { width } = Dimensions.get('window');

const Dialog = ({ title, desc, setDialogName, children }: Props) => {
    const [modalVisible, setModalVisible] = useState(true);

    return (
        <Modal visible={modalVisible} transparent animationType="fade">
            <Pressable
                style={styles.modalOverlay}
                onPress={() => {
                    setModalVisible(false);
                    setDialogName('');
                }}
            >
                <Pressable
                    style={styles.modalContent}
                    onPress={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                >
                    <LinearGradient
                        colors={[
                            '#fede8a',
                            '#f8a6c2',
                            '#b16dff',
                            '#0f8bff',
                            '#00e676',
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.background}
                    />

                    <View style={styles.btnsGroup}>
                        <Pressable
                            onPress={() => {
                                setModalVisible(false);
                                setDialogName('');
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

                    {title && <Text style={styles.heading}>{title}</Text>}
                    {desc && <Text style={styles.subheading}>{desc}</Text>}

                    {children}
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default Dialog;

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
    heading: {
        fontWeight: '600',
        fontSize: 24,
    },
    subheading: {
        marginTop: 8,
        fontSize: 15,
        opacity: 0.9,
    },
});
