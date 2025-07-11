import BannerCarousel from '@/components/BannerCarousel';
import SubjectCard from '@/components/SubjectCard';
import { useAuth } from '@/contexts/auth.context';
import { useClass } from '@/hooks/useClass';
import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
    const { user } = useAuth();
    const { data, isPending: isLoadingClasses, error } = useClass();

    if (isLoadingClasses) return <></>;
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
                        >
                            <Text
                                style={{
                                    color: '#2093e7',
                                    fontWeight: '500',
                                    fontSize: 18,
                                    marginRight: 4,
                                }}
                            >
                                Xem tất cả
                            </Text>
                            <View style={{ marginTop: 3 }}>
                                <FontAwesome6
                                    name="chevron-right"
                                    solid
                                    size={18}
                                    color="#2093e7"
                                />
                            </View>
                        </Pressable>
                    </View>

                    <View style={styles.subjectsRow}>
                        {Array.from({ length: 10 }).map((_, idx) => (
                            <View style={styles.subjectCol} key={idx}>
                                <SubjectCard />
                            </View>
                        ))}
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
