import BannerCarousel from '@/components/BannerCarousel';
import Header from '@/components/Header';
import SubjectCard from '@/components/SubjectCard';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <Header />
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
        </SafeAreaView>
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
