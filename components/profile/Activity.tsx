import SubjectCard from '@/components/ClassCard';
import SubjectCardSkeleton from '@/components/skeleton/ClassCardSkeleton';
import { useClass } from '@/hooks/useClass';
import { ClassModel } from '@/types/models/class.model';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const Activity = () => {
    const {
        data: classes,
        isPending: isLoadingClasses,
        totalCount,
    } = useClass();

    return (
        <View style={styles.container}>
            <View style={styles.tabs}>
                <View style={[styles.tab, styles.tabActive]}>
                    <FontAwesome6 name="book" solid size={14} color="#000" />
                    <Text style={styles.tabTitle}>
                        Lớp học đã đăng ký ({totalCount})
                    </Text>
                </View>

                {!isLoadingClasses && classes.length > 0 && (
                    <Pressable
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 'auto',
                            paddingRight: 8,
                        }}
                        onPress={() => router.push('/(tabs)/home/classes')}
                    >
                        <Text
                            style={{
                                color: '#2093e7',
                                fontWeight: '500',
                                fontSize: 17,
                                marginRight: 4,
                            }}
                        >
                            Xem tất cả ({totalCount})
                        </Text>
                        <View style={{ marginTop: 3 }}>
                            <FontAwesome6
                                name="chevron-right"
                                solid
                                size={17}
                                color="#2093e7"
                            />
                        </View>
                    </Pressable>
                )}
            </View>
            <View style={styles.subjectsRow}>
                {isLoadingClasses
                    ? Array.from({ length: 6 }).map((_, idx) => (
                          <View style={styles.subjectCol} key={idx}>
                              <SubjectCardSkeleton />
                          </View>
                      ))
                    : classes?.map((classItem: ClassModel, idx: number) => (
                          <View
                              style={styles.subjectCol}
                              key={classItem.id ?? idx}
                          >
                              <SubjectCard classItem={classItem} />
                          </View>
                      ))}
            </View>
        </View>
    );
};

export default Activity;

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        marginBottom: 90,
    },
    tabs: {
        flexDirection: 'row',
        width: '100%',
        gap: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
        marginBottom: -1,
        fontSize: 14,
        fontWeight: 600,
    },
    tabTitle: {
        fontSize: 14,
        color: '#000',
        fontWeight: 600,
    },
    tabActive: {
        opacity: 1,
        borderBottomWidth: 3,
        borderBottomColor: '#1b74e4',
    },

    subjectsRow: {
        marginTop: 28,
        flexDirection: 'row',
        columnGap: 12,
        rowGap: 32,
        flexWrap: 'wrap',
    },
    subjectCol: {
        width: '48%',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
