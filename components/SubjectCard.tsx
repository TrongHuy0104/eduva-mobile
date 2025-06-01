import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const SubjectCard = () => {
    const handlePress = () => {
        // Handle navigation or any action here
        // Example: navigate to subject detail
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.subjectContainer,
                pressed && styles.pressed,
            ]}
            android_ripple={{ color: '#e0e0e0', borderless: false, radius: 16 }}
            onPress={handlePress}
        >
            <View style={styles.imageWrapper}>
                <Image
                    source="https://files.fullstack.edu.vn/f8-prod/courses/2.png"
                    style={styles.image}
                    contentFit="cover"
                />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.contentHeading} numberOfLines={2}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Tenetur repudiandae nulla maxime excepturi natus nam fuga
                    cumque consectetur ut? Nulla.
                </Text>
                <Text style={styles.contentSubHeading} numberOfLines={1}>
                    Khối 10
                </Text>
                <View style={styles.moreInfos}>
                    <View style={styles.infoItem}>
                        <FontAwesome6
                            solid
                            name="circle-play"
                            size={14}
                            color="#666"
                        />
                        <Text>55</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <FontAwesome6
                            solid
                            name="clock"
                            size={14}
                            color="#666"
                        />
                        <Text>55</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

export default SubjectCard;

const styles = StyleSheet.create({
    subjectContainer: {
        position: 'relative',
        width: '100%',
        borderRadius: 16,
        backgroundColor: '#00000008',
        overflow: 'hidden',
    },
    pressed: {
        opacity: 0.7,
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#eee',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        padding: 10,
        flex: 1,
        gap: 12,
    },
    contentHeading: {
        fontSize: 16,
        color: '#292929',
        fontWeight: '600',
    },
    contentSubHeading: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f05123',
    },
    moreInfos: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        color: '#666',
        fontSize: 14,
    },
});
