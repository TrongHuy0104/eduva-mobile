import { useAuth } from '@/contexts/auth.context';
import { useSupabaseUpload } from '@/hooks/useSupabaseUpload';
import { useUpdateProfile } from '@/hooks/useUser';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const UpdateAvatar = ({
    defaultValue,
    setDialogName,
}: {
    defaultValue: string;
    setDialogName: (name: string) => void;
}) => {
    const [avatar, setAvatar] = useState<string>(defaultValue);
    const [localAvatar, setLocalAvatar] = useState<string | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    const { uploadImage } = useSupabaseUpload();
    const { mutate: updateProfile, isPending } = useUpdateProfile();
    const { user, updateCurrentUser } = useAuth();

    const pickImage = async () => {
        try {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Lỗi',
                    'Cần cấp quyền truy cập thư viện ảnh để thay đổi ảnh đại diện'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                setLocalAvatar(asset.uri);
                setSelectedAsset(asset); // Lưu asset để upload sau
            }
        } catch (error) {
            console.error('ImagePicker Error: ', error);
            Alert.alert('Lỗi', 'Không thể mở thư viện ảnh');
        }
    };

    const uploadAvatar = async () => {
        if (!selectedAsset || !user?.id) return;

        setUploading(true);
        try {
            // 1. Upload to Supabase Storage
            const { url, error } = await uploadImage(
                selectedAsset.uri,
                user.id
            );
            if (error || !url) throw new Error(error || 'Upload failed');

            // 2. Update avatar URL in your database
            updateProfile(
                { avatarUrl: url },
                {
                    onSuccess: () => {
                        setAvatar(url);
                        setLocalAvatar(null);
                        setSelectedAsset(null);
                        updateCurrentUser({ ...user, avatarUrl: url });
                        Alert.alert(
                            'Thành công',
                            'Cập nhật ảnh đại diện thành công!'
                        );
                        setDialogName('');
                    },
                    onError: () => {
                        Alert.alert('Lỗi', 'Không thể cập nhật ảnh đại diện');
                    },
                    onSettled: () => {
                        setUploading(false);
                    },
                }
            );
        } catch (err) {
            console.log('err', err);
            setUploading(false);
            Alert.alert('Lỗi', 'Không thể tải ảnh lên server');
        }
    };

    return (
        <View>
            <View style={styles.avatarWrap}>
                <Image
                    source={{ uri: localAvatar ?? avatar }}
                    style={styles.avatar}
                    resizeMode="cover"
                />
                {uploading && (
                    <View style={styles.loading}>
                        <ActivityIndicator color="#1dbfaf" />
                    </View>
                )}
            </View>
            <TouchableOpacity
                style={styles.uploadBtn}
                onPress={pickImage}
                disabled={uploading || isPending}
            >
                <Text style={styles.uploadBtnText}>+ Chọn ảnh mới</Text>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.9}
                onPress={uploadAvatar}
                disabled={!selectedAsset || uploading}
                style={{ opacity: !selectedAsset || uploading ? 0.5 : 1 }}
            >
                <LinearGradient
                    colors={['#2093e7', '#22cfd2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveButton}
                >
                    {isPending && (
                        <ActivityIndicator color="white" size="small" />
                    )}
                    <Text style={styles.saveButtonText}>
                        {uploading ? 'Đang lưu...' : 'Lưu lại'}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

export default UpdateAvatar;

const styles = StyleSheet.create({
    avatarWrap: {
        marginVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff99',
        borderRadius: 70,
    },
    uploadBtn: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginTop: 24,
        elevation: 2,
    },
    uploadBtnText: {
        color: '#222',
        fontSize: 16,
        fontWeight: '600',
    },
});
