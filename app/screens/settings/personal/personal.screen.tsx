import Dialog from '@/components/settings/Dialog';
import ProfileCard from '@/components/settings/ProfileCard';
import UpdateAvatar from '@/components/settings/forms/UpdateAvatar';
import UpdateNameForm from '@/components/settings/forms/UpdateNameForm';
import UpdatePhoneForm from '@/components/settings/forms/UpdatePhoneForm';
import { useAuth } from '@/contexts/auth.context';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

const PersonalScreen = () => {
    const { user } = useAuth();

    const [dialogName, setDialogName] = useState('');
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
                        Quản lý tên hiển thị, tên người dùng và avatar của bạn.
                    </Text>
                </View>

                <View style={styles.itemsContainer}>
                    <ProfileCard
                        title="Họ và tên"
                        subtitle={user?.fullName}
                        dialogName={'fullname'}
                        setDialogName={setDialogName}
                    />
                    <ProfileCard
                        dialogName={'avatar'}
                        setDialogName={setDialogName}
                        title="Ảnh đại diện"
                        avatarUrl={user?.avatarUrl}
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
                    <ProfileCard
                        title="Email"
                        subtitle={user?.email}
                        dialogName={'email'}
                        setDialogName={setDialogName}
                        readonly
                    />
                    <ProfileCard
                        title="Số điện thoại"
                        subtitle={user?.phoneNumber}
                        dialogName={'phone'}
                        setDialogName={setDialogName}
                    />
                </View>
            </View>
            <Toast />

            {/* Dialogs List */}
            {dialogName === 'fullname' && (
                <Dialog
                    setDialogName={setDialogName}
                    title="Cập nhật tên của bạn"
                    desc="Tên sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài viết của bạn."
                >
                    <UpdateNameForm
                        defaultValue={user?.fullName ?? ''}
                        setDialogName={setDialogName}
                    />
                </Dialog>
            )}
            {dialogName === 'avatar' && (
                <Dialog
                    setDialogName={setDialogName}
                    title="Ảnh đại diện"
                    desc="Ảnh đại diện giúp mọi người nhận biết bạn dễ dàng hơn qua các
                bài viết, bình luận, tin nhắn..."
                >
                    <UpdateAvatar
                        defaultValue={user?.avatarUrl ?? ''}
                        setDialogName={setDialogName}
                    />
                </Dialog>
            )}
            {dialogName === 'phone' && (
                <Dialog
                    setDialogName={setDialogName}
                    title="Số điện thoại"
                    desc="Số điện thoại của bạn được dùng để liên hệ."
                >
                    <UpdatePhoneForm
                        defaultValue={user?.phoneNumber ?? ''}
                        setDialogName={setDialogName}
                    />
                </Dialog>
            )}
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
