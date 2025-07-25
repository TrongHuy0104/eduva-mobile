import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Animated, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import CommentList from "./CommentList";

interface CommentModalProps {
    visible: boolean;
    onClose: () => void;
    materialTitle: string;
    materialId: string;
}


const { width } = Dimensions.get('window');

const CommentModal = ({ visible, onClose, materialTitle, materialId }: CommentModalProps) => {
    const [slideAnim] = React.useState(new Animated.Value(-width));

 React.useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -width,
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
            onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>
            <Animated.View
                style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
            >
                <ScrollView  style={styles.sidebarContent}>
                    {/* Title */}
                    <Text style={styles.sidebarTitle}>Hỏi đáp</Text>

                    {/* Close button */}
                    <Pressable
                            onPress={onClose}
                            style={{
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                position: 'absolute',
                                top: -8,
                                right: -8,
                            }}
                        >
                            <FontAwesome6
                                name="xmark"
                                solid
                                size={24}
                                color="#1d9ffb"
                            />
                        </Pressable>

                    <CommentList materialTitle={materialTitle} materialId={materialId}/>

                </ScrollView>
            </Animated.View>
        </Modal>
    )
}


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
    sidebarContent: {
        flex: 1,
        padding: 16,
    },
    sidebarTitle: {
        position: 'relative',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
});

export default CommentModal;
