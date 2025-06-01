import BannerCarousel from '@/components/BannerCarousel';
import SubjectCard from '@/components/SubjectCard';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#fff' }}
            contentContainerStyle={{ paddingBottom: 80 }}
        >
            <BannerCarousel />

            {/* Subject List */}
            <View style={{ marginTop: 50, paddingHorizontal: 16 }}>
                <Text style={styles.subjectsHeader}>Môn đã học</Text>

                <View style={styles.subjectsRow}>
                    {Array.from({ length: 10 }).map((_, idx) => (
                        <View style={styles.subjectCol} key={idx}>
                            <SubjectCard />
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
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
