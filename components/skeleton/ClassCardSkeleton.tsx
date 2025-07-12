import { windowWidth } from '@/constants/app.constants';
import React from 'react';
import { View } from 'react-native';
// @ts-ignore
const SkeletonLoading = require('expo-skeleton-loading').default;

const ClassCardSkeleton = () => {
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
                <View
                    style={{
                        width: '100%',
                        aspectRatio: 16 / 9,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        overflow: 'hidden',
                        backgroundColor: '#eee',
                    }}
                />
                {/* Content skeleton */}
                <View style={{ padding: 10, gap: 12 }}>
                    {/* Title */}
                    <View
                        style={{
                            width: '70%',
                            height: 18,
                            borderRadius: 6,
                            backgroundColor: '#e0e0e0',
                            marginBottom: 8,
                        }}
                    />
                    {/* Subtitle */}
                    <View
                        style={{
                            width: '40%',
                            height: 16,
                            borderRadius: 6,
                            backgroundColor: '#e0e0e0',
                            marginBottom: 12,
                        }}
                    />
                    {/* More infos row */}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 'auto',
                        }}
                    >
                        {/* Avatar + name */}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                                maxWidth: '60%',
                            }}
                        >
                            <View
                                style={{
                                    width: windowWidth(20),
                                    height: windowWidth(20),
                                    borderRadius: windowWidth(10),
                                    backgroundColor: '#e0e0e0',
                                    marginRight: 8,
                                }}
                            />
                            <View
                                style={{
                                    width: 60,
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: '#e0e0e0',
                                }}
                            />
                        </View>
                        {/* Play icon + number */}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            <View
                                style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: 7,
                                    backgroundColor: '#e0e0e0',
                                }}
                            />
                            <View
                                style={{
                                    width: 20,
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: '#e0e0e0',
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </SkeletonLoading>
    );
};

export default ClassCardSkeleton;
