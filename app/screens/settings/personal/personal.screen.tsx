import Dialog from '@/components/settings/Dialog';
import ProfileCard from '@/components/settings/ProfileCard';
import UpdateAvatar from '@/components/settings/forms/UpdateAvatar';
import UpdateBioForm from '@/components/settings/forms/UpdateBioForm';
import UpdateEmailForm from '@/components/settings/forms/UpdateEmailForm';
import UpdatePhoneForm from '@/components/settings/forms/UpdatePhoneForm';
import UpdateSocialForm from '@/components/settings/forms/UpdateSocialForm';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const PersonalScreen = () => {
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
                    <ProfileCard
                        title="Giới thiệu"
                        dialogName={'bio'}
                        setDialogName={setDialogName}
                    />
                    <ProfileCard
                        dialogName={'avatar'}
                        setDialogName={setDialogName}
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
                    <ProfileCard
                        title="Email"
                        dialogName={'email'}
                        setDialogName={setDialogName}
                    />
                    <ProfileCard
                        title="Số điện thoại"
                        subtitle="0123456789"
                        dialogName={'phone'}
                        setDialogName={setDialogName}
                    />
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
                    <ProfileCard
                        title="Facebook"
                        dialogName={'facebook'}
                        setDialogName={setDialogName}
                    />
                    <ProfileCard
                        title="Instagram"
                        dialogName={'instagram'}
                        setDialogName={setDialogName}
                    />
                    <ProfileCard
                        title="Tiktok"
                        dialogName={'tiktok'}
                        setDialogName={setDialogName}
                    />
                </View>
            </View>

            {dialogName === 'bio' && (
                <Dialog
                    setDialogName={setDialogName}
                    title="Chỉnh sửa phần giới thiệu"
                    desc="Phần giới thiệu (tiểu sử) được hiển thị tại trang cá nhân của bạn, giúp mọi người hiểu rõ hơn về bạn."
                >
                    <UpdateBioForm />
                </Dialog>
            )}
            {dialogName === 'avatar' && (
                <Dialog
                    setDialogName={setDialogName}
                    title="Ảnh đại diện"
                    desc="Ảnh đại diện giúp mọi người nhận biết bạn dễ dàng hơn qua các
                bài viết, bình luận, tin nhắn..."
                >
                    <UpdateAvatar />
                </Dialog>
            )}
            {dialogName === 'email' && (
                <Dialog
                    setDialogName={setDialogName}
                    title="Địa chỉ email"
                    desc="Cung cấp địa chỉ email là điều cần thiết để làm việc với hệ thống."
                >
                    <UpdateEmailForm />
                </Dialog>
            )}
            {dialogName === 'phone' && (
                <Dialog
                    setDialogName={setDialogName}
                    title="Số điện thoại"
                    desc="Số điện thoại của bạn được dùng để liên hệ."
                >
                    <UpdatePhoneForm />
                </Dialog>
            )}
            {dialogName === 'facebook' && (
                <Dialog
                    setDialogName={setDialogName}
                    title="Facebook"
                    desc="Địa chỉ Facebook sẽ được hiển thị trên trang cá nhân của bạn. Ví dụ: https://facebook.com/username."
                >
                    <UpdateSocialForm
                        name="facebook"
                        label="Facebook"
                        placeholder="Nhập đường dẫn trang cá nhân"
                    />
                </Dialog>
            )}
            {dialogName === 'instagram' && (
                <Dialog
                    setDialogName={setDialogName}
                    title="Instagram"
                    desc="Địa chỉ instagram sẽ được hiển thị trên trang cá nhân của bạn. Ví dụ: https://instagram.com/username."
                >
                    <UpdateSocialForm
                        name="instagram"
                        label="Instagram"
                        placeholder="Nhập đường dẫn instagram"
                    />
                </Dialog>
            )}
            {dialogName === 'tiktok' && (
                <Dialog
                    setDialogName={setDialogName}
                    title="Tiktok"
                    desc="Địa chỉ tiktok sẽ được hiển thị trên trang cá nhân của bạn. Ví dụ: https://tiktok.com/username."
                >
                    <UpdateSocialForm
                        name="tiktok"
                        label="Tiktok"
                        placeholder="Nhập đường dẫn tiktok"
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
