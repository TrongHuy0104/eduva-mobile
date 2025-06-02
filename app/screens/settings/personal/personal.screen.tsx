import ProfileCard from '@/components/settings/ProfileCard';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const PersonalScreen = () => {
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

            <Text style={styles.heading}>Thông tin cá nhân</Text>
            <Text style={styles.subHeading}>
                Quản lý thông tin cá nhân của bạn.
            </Text>

            {/* Basic Information */}
            <View style={styles.infoContainer}>
                <View style={{ gap: 4 }}>
                    <Text style={styles.infoHeading}>Thông tin cơ bản</Text>
                    <Text style={styles.infoSubHeading}>
                        Quản lý tên hiển thị, tên người dùng, bio và avatar của
                        bạn.
                    </Text>
                </View>

                <View style={styles.itemsContainer}>
                    <ProfileCard
                        title="Họ và tên"
                        subtitle="Trọng Huy"
                        readonly
                    />
                    <ProfileCard
                        title="Tên người dùng"
                        subtitle="@huytrong"
                        readonly
                    />
                    <ProfileCard title="Giới thiệu" />
                    <ProfileCard
                        title="Ảnh đại diện"
                        avatarUrl="https://accounts.fullstack.edu.vn/assets/logo-lV2rGpF0.png"
                    />
                </View>
            </View>

            {/* Contact Information */}
            <View style={[styles.infoContainer, { marginTop: 40 }]}>
                <View style={{ gap: 4 }}>
                    <Text style={styles.infoHeading}>Thông tin liên hệ</Text>
                    <Text style={styles.infoSubHeading}>
                        Quản lý danh sách các thông tin liên hệ của bạn.
                    </Text>
                </View>

                <View style={styles.itemsContainer}>
                    <ProfileCard title="Email" />
                    <ProfileCard title="Số điện thoại" subtitle="0123456789" />
                </View>
            </View>

            {/* Socials Information */}
            <View style={[styles.infoContainer, { marginTop: 40 }]}>
                <View style={{ gap: 4 }}>
                    <Text style={styles.infoHeading}>
                        Thông tin mạng xã hội
                    </Text>
                    <Text style={styles.infoSubHeading}>
                        Quản lý liên kết tới các trang mạng xã hội của bạn.
                    </Text>
                </View>

                <View style={styles.itemsContainer}>
                    <ProfileCard title="Facebook" />
                    <ProfileCard title="Instagram" />
                    <ProfileCard title="Tiktok" />
                </View>
            </View>
        </ScrollView>
    );
};

export default PersonalScreen;

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
