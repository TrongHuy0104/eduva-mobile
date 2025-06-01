import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SubjectCard from '../SubjectCard';

const Activity = () => {
    return (
        <View style={styles.container}>
            <View style={styles.tabs}>
                <View style={[styles.tab, styles.tabActive]}>
                    <FontAwesome6 name="book" solid size={14} color="#000" />
                    <Text style={styles.tabTitle}>Khóa học đã đăng ký (9)</Text>
                </View>
            </View>

            <View style={[styles.subjectsRow, { marginTop: 24 }]}>
                {Array.from({ length: 10 }).map((_, idx) => (
                    <View style={styles.subjectCol} key={idx}>
                        <SubjectCard />
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
