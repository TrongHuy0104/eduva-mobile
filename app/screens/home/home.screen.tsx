import BannerCarousel from '@/components/BannerCarousel';
import SubjectCard from '@/components/ClassCard';
import SubjectCardSkeleton from '@/components/skeleton/ClassCardSkeleton';
import { useAuth } from '@/contexts/auth.context';
import { useClass } from '@/hooks/useClass';
import { useToast } from '@/hooks/useToast';
import { ClassModel } from '@/types/models/class.model';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
    const { user } = useAuth();
    const toast = useToast();
    const { data: classes, isPending: isLoadingClasses, error } = useClass();

    if (error) {
        toast.errorGeneral();
    }

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#fff' }}
            contentContainerStyle={{ paddingBottom: 80 }}
        >
            <BannerCarousel />

            {user && (
                // Subject list
                <View style={{ marginTop: 50, paddingHorizontal: 16 }}>
                    <View style={styles.subjectsHeaderContainer}>
                        <Text style={styles.subjectsHeader}>
                            Lớp học của tôi
                        </Text>
                        <Pressable
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
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
                                Xem tất cả
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
                    </View>
                    <View style={styles.subjectsRow}>
                        {isLoadingClasses
                            ? Array.from({ length: 12 }).map((_, idx) => (
                                  <View style={styles.subjectCol} key={idx}>
                                      <SubjectCardSkeleton />
                                  </View>
                              ))
                            : classes?.map(
                                  (classItem: ClassModel, idx: number) => (
                                      <View
                                          style={styles.subjectCol}
                                          key={classItem.id ?? idx}
                                      >
                                          <SubjectCard classItem={classItem} />
                                      </View>
                                  )
                              )}
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    subjectsHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subjectsHeader: {
        fontSize: 24,
        fontWeight: '900',
        color: '#242424',
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
