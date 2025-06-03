import InputField from '@/components/InputField';
import {
    hasMinLength,
    hasNumber,
    hasSpecialChar,
    hasUpperCase,
} from '@/components/settings/forms/ChangePasswordForm';
import PasswordStrength from '@/components/settings/PasswordStrength';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const UpdatePasswordScreen = () => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitted, isValid },
        watch,
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
    });

    const newPasswordValue = watch('new-password');

    const onSubmit = async (data: any) => {
        console.log('Form data:', data);
    };

    const onError = (errors: any) => {
        console.log('Form errors:', errors);
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/(routes)/settings/security')}
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
                <Text style={styles.title}>Đặt lại mật khẩu?</Text>
                <Text style={styles.subtitle}>
                    Đặt mật khẩu mới cho tài khoản của bạn để có thể tiếp tục
                    truy cập các khóa học.
                </Text>
            </View>

            <View style={{ width: '100%', marginTop: 10, overflow: 'hidden' }}>
                <InputField
                    control={control}
                    numberOfLines={1}
                    secureTextEntry={true}
                    name="new-password"
                    label="Mật khẩu mới"
                    rules={{
                        required: 'Trường này không được để trống',
                        validate: {
                            hasMinLength: (value) =>
                                hasMinLength(value) ||
                                'Mật khẩu phải có ít nhất 8 ký tự',
                            hasSpecialChar: (value) =>
                                hasSpecialChar(value) ||
                                'Mật khẩu cần ít nhất một ký tự đặc biệt (ví dụ: !@#$%)',
                            hasNumber: (value) =>
                                hasNumber(value) ||
                                'Mật khẩu cần ít nhất một chữ số (0-9)',
                            hasUpperCase: (value) =>
                                hasUpperCase(value) ||
                                'Mật khẩu cần ít nhất một chữ cái in hoa (A-Z)',
                        },
                    }}
                    placeholder="Nhập mật khẩu mới"
                    error={errors?.['new-password']}
                    isSubmitted={isSubmitted}
                />
                <PasswordStrength password={newPasswordValue || ''} />
            </View>

            <View style={{ width: '100%', marginTop: 10, overflow: 'hidden' }}>
                <InputField
                    control={control}
                    numberOfLines={1}
                    secureTextEntry={true}
                    name="confirm-password"
                    label="Nhập lại mật khẩu mới"
                    rules={{
                        required: 'Vui lòng xác nhận mật khẩu',
                        validate: (value) =>
                            value === watch('new-password') ||
                            'Mật khẩu xác nhận không khớp',
                    }}
                    placeholder="Nhập lại mật khẩu mới"
                    error={errors?.['confirm-password']}
                    isSubmitted={isSubmitted}
                />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    Keyboard.dismiss();
                    handleSubmit(onSubmit, onError)();
                }}
                disabled={!isValid}
                style={{
                    opacity: !isValid ? 0.5 : 1,
                }}
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
                        Đổi mật khẩu
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

export default UpdatePasswordScreen;
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
});
