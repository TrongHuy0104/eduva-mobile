import InputField from '@/components/InputField';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const ResetPasswordScreen = () => {
    const [otpCode, setOtpCode] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const { control } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
    });

    const handleSendOtp = () => {
        setIsOtpSent(true);
        setCountdown(60);
        startCountdown();
    };

    const startCountdown = () => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsOtpSent(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResetPassword = () => {
        if (!otpCode) {
            Alert.alert('Lỗi', 'Vui lòng nhập mã xác nhận');
            return;
        }

        // @ts-ignore
        router.push('/(routes)/settings/reset-password/update-password');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <FontAwesome6
                    name="chevron-left"
                    size={16}
                    color="rgba(0,0,0,0.7)"
                />
                <Text style={styles.backText}>Quay lại</Text>
            </TouchableOpacity>

            <View style={styles.header}>
                <View style={styles.logoWrapper}>
                    <Pressable
                        onPress={() => router.push('/(tabs)')}
                        style={{ display: 'flex', borderRadius: 10 }}
                    >
                        <Image
                            style={styles.logo}
                            source="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
                            contentFit="contain"
                            transition={1000}
                        />
                    </Pressable>
                </View>
                <Text style={styles.title}>Quên mật khẩu?</Text>
                <Text style={styles.subtitle}>
                    Nhập email hoặc username của bạn và chúng tôi sẽ gửi cho bạn
                    mã khôi phục mật khẩu.
                </Text>
            </View>

            <View style={{ width: '100%', marginTop: 10, overflow: 'hidden' }}>
                <InputField
                    control={control}
                    readOnly={true}
                    defaultValue="tronghuy0104@gmail.com"
                    name="email"
                    label="Email"
                    placeholder="Nhập địa chỉ email của bạn"
                />
            </View>

            <Text
                style={{
                    fontSize: 13,
                    color: '#333',
                    marginVertical: 8,
                    marginLeft: 8,
                    lineHeight: 18,
                }}
            >
                Tên đăng nhập của bạn đã được điền sẵn. Để lấy mã khôi phục mật
                khẩu, hãy nhấn &quot;Gửi mã&quot;.
            </Text>

            <View
                style={[
                    {
                        marginTop: 10,
                        position: 'relative',
                        backgroundColor: '#16182329',
                        borderWidth: 1.5,
                        borderColor: '#dee3e9',
                        borderRadius: 44,
                        overflow: 'hidden',
                        height: 54,
                        flexDirection: 'row',
                    },
                    isOtpSent && { backgroundColor: '#fff' },
                ]}
            >
                <TextInput
                    style={{
                        fontSize: 16,
                        width: '100%',
                        paddingVertical: 12,
                        paddingRight: 130,
                        paddingLeft: 20,
                        // Add opacity when disabled
                        opacity: isOtpSent ? 1 : 0.5,
                    }}
                    placeholder="Nhập mã xác nhận"
                    value={otpCode}
                    onChangeText={setOtpCode}
                    keyboardType="number-pad"
                    // Add editable prop
                    editable={isOtpSent}
                    // Optional: Change placeholder color when disabled
                    placeholderTextColor={isOtpSent ? '#666' : '#999'}
                />
                <TouchableOpacity
                    onPress={handleSendOtp}
                    disabled={countdown > 0}
                    activeOpacity={0.9}
                    style={[
                        {
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            height: '100%',
                            minWidth: 124,
                            justifyContent: 'center',
                            alignContent: 'center',
                            borderRadius: 44,
                            margin: 1,
                            flexShrink: 0,
                            backgroundColor: '#f05123',
                            zIndex: 10,
                        },
                        countdown > 0 && { backgroundColor: '#16182329' }, // Đổi màu khi đang countdown
                    ]}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            color: '#fff',
                            fontWeight: '500',
                            fontSize: 15,
                        }}
                    >
                        {countdown > 0 ? `Gửi mã ${countdown}s` : 'Gửi mã'}
                    </Text>
                </TouchableOpacity>
            </View>
            {isOtpSent && (
                <Text style={styles.otpMessage}>
                    Đã gửi mã! Kiểm tra email của bạn để lấy mã.
                </Text>
            )}

            <View style={styles.form}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handleResetPassword}
                    disabled={!otpCode}
                    style={{ opacity: !otpCode ? 0.5 : 1 }}
                >
                    <LinearGradient
                        colors={['#2cccff', '#22dfbf']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            marginTop: 20,
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 9999,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: '600',
                                fontSize: 16,
                            }}
                        >
                            Đặt lại mật khẩu
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        position: 'fixed',
        top: 7,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        padding: 20,
        paddingLeft: 0,
        opacity: 0.7,
    },
    backText: {
        fontSize: 16,
        color: '#000',
    },
    header: {
        alignItems: 'center',
        marginTop: 30,
    },
    logoWrapper: {
        alignItems: 'center',
    },

    logo: {
        width: 46,
        height: 46,
        flexShrink: 0,
        borderRadius: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginVertical: 12,
    },
    subtitle: {
        textAlign: 'center',
        marginHorizontal: 'auto',
        opacity: 0.7,
        width: '90%',
        fontSize: 14,
    },
    form: {
        flex: 1,
    },
    otpMessage: {
        marginTop: 10,
        marginHorizontal: 10,
        fontWeight: '500',
        fontSize: 14,
        color: '#00C851',
        marginBottom: 20,
    },
});
