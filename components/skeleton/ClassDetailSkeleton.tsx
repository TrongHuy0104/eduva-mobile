import React from 'react';
import { StyleSheet, View } from 'react-native';
const SkeletonLoading = require('expo-skeleton-loading').default;

const ClassDetailSkeleton = () => {
    return (
        <SkeletonLoading background="#e0e0e0" highlight="#f5f5f5">
            <View
                style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: 16,
                    backgroundColor: '#00000008',
                    overflow: 'hidden',
                }}
            >
                {/* Image skeleton */}
                {/* Thumbnail skeleton */}
                <View style={styles.thumbnail} />

                {/* Class title skeleton */}
                <View style={styles.classTitle} />

                {/* Subtitle skeleton */}
                <View style={styles.subtitle} />

                {/* Lesson count and duration info skeleton */}
                <View style={styles.infoContainer}>
                    <View style={styles.infoText} />
                    <View style={styles.dot} />
                    <View style={styles.infoText} />
                </View>

                {/* Folders skeleton */}
                {[1, 2, 3].map((index) => (
                    <View key={index} style={styles.folderContainer}>
                        <View style={styles.folderHeader}>
                            <View style={styles.folderTitle} />
                            <View style={styles.folderCount} />
                        </View>
                    </View>
                ))}
            </View>
        </SkeletonLoading>
    );
};

export default ClassDetailSkeleton;

const styles = StyleSheet.create({
    thumbnail: {
        width: '100%',
        height: 160,
        borderRadius: 16,
        backgroundColor: '#e0e0e0',
        marginBottom: 16,
    },
    classTitle: {
        width: '80%',
        height: 28,
        borderRadius: 6,
        backgroundColor: '#e0e0e0',
        marginBottom: 16,
    },
    subtitle: {
        width: '60%',
        height: 20,
        borderRadius: 6,
        backgroundColor: '#e0e0e0',
        marginBottom: 10,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoText: {
        width: 80,
        height: 16,
        borderRadius: 6,
        backgroundColor: '#e0e0e0',
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 999,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 8,
    },
    folderContainer: {
        marginBottom: 8,
    },
    folderHeader: {
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
    folderTitle: {
        width: '70%',
        height: 16,
        borderRadius: 6,
        backgroundColor: '#e0e0e0',
    },
    folderCount: {
        width: 60,
        height: 14,
        borderRadius: 6,
        backgroundColor: '#e0e0e0',
    },
});
