import ProfileCard from '@/components/settings/ProfileCard';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const SecurityScreen = () => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
                <Pressable
                    onPress={() => router.back()}
                    style={{
                        paddingVertical: 20,
                        paddingRight: 50,
                        paddingLeft: 20,
                        marginLeft: -20,
                    }}
                >
                    <FontAwesome6
                        name="chevron-left"
                        solid
                        size={21}
                        color="#000"
                    />
                </Pressable>
            </View>

            <Text style={styles.heading}>Mật khẩu và bảo mật</Text>
            <Text style={styles.subHeading}>
                Quản lý mật khẩu và cài đặt bảo mật.
            </Text>

            <View style={styles.infoContainer}>
                <View style={{ gap: 4 }}>
                    <Text style={styles.infoHeading}>
                        Đăng nhập & khôi phục
                    </Text>
                    <Text style={styles.infoSubHeading}>
                        Quản lý mật khẩu và xác minh 2 bước.
                    </Text>
                </View>

                <View style={styles.itemsContainer}>
                    <ProfileCard
                        title="Đổi mật khẩu"
                        subtitle="Lần đổi gần nhất: 4 tháng trước"
                    />
                    <ProfileCard title="Xác minh 2 bước" subtitle="Đang tắt" />
                </View>
            </View>
        </ScrollView>
    );
};

export default SecurityScreen;

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heading: {
        fontSize: 24,
        fontWeight: 600,
        color: '#000',
        marginTop: 8,
    },
    subHeading: {
        marginTop: 10,
        fontSize: 15,
        opacity: 0.9,
        marginBottom: 28,
    },
    infoContainer: {
        gap: 16,
    },
    infoHeading: {
        fontSize: 17,
        fontWeight: '600',
    },
    infoSubHeading: {
        fontSize: 14,
        opacity: 0.7,
    },
    itemsContainer: {
        borderRadius: 10,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
});
