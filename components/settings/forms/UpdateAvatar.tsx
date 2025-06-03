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

const DEFAULT_AVATAR = 'https://i.imgur.com/1Q9Z1Zm.png';

const UpdateAvatar = () => {
    const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
    const [localAvatar, setLocalAvatar] = useState<string | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

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
        if (!selectedAsset) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('avatar', {
                uri: selectedAsset.uri,
                type: selectedAsset.type || 'image/jpeg',
                name: selectedAsset.fileName || 'avatar.jpg',
            } as any);

            const res = await fetch('https://your-api.com/api/upload-avatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            setAvatar(data.avatarUrl);
            setLocalAvatar(null);
            setSelectedAsset(null); // Reset selected asset
            Alert.alert('Thành công', 'Cập nhật ảnh đại diện thành công!');
        } catch (err) {
            Alert.alert('Lỗi', 'Không thể tải ảnh lên server');
        } finally {
            setUploading(false);
        }
    };

    return (
        <View>
            <View style={styles.avatarWrap}>
                <Image
                    source={{ uri: localAvatar || avatar }}
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
                disabled={uploading}
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
                    colors={['#2cccff', '#22dfbf']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveButton}
                >
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
