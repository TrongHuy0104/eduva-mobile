import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Dimensions,
    Keyboard,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import InputField from '../../InputField';
import PasswordStrength from '../PasswordStrength';

const { height: windowHeight } = Dimensions.get('window');
export const hasSpecialChar = (str: string) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(str);
export const hasNumber = (str: string) => /\d/.test(str);
export const hasUpperCase = (str: string) => /[A-Z]/.test(str);
export const hasMinLength = (str: string) => str.length >= 8;
export default function ChangePasswordForm() {
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

    const onSubmit = async (_data: any) => {};

    const onError = (_errors: any) => {};

    return (
        <ScrollView style={styles.container}>
            <View style={{ width: '100%', marginTop: 10, overflow: 'hidden' }}>
                <InputField
                    control={control}
                    numberOfLines={1}
                    secureTextEntry={true}
                    name="current-password"
                    label="Mật khẩu hiện tại"
                    rules={{
                        required: 'Vui lòng nhập mật khẩu hiện tại',
                    }}
                    placeholder="Nhập mật khẩu hiện tại"
                    error={errors?.['current-password']}
                    isSubmitted={isSubmitted}
                />
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

            <Pressable
                onPress={() =>
                    // @ts-ignore
                    router.push('/(routes)/settings/reset-password')
                }
                style={{ marginTop: 10, marginLeft: 5, marginBottom: 16 }}
            >
                <Text
                    style={{
                        color: '#f05123',
                        fontWeight: '500',
                        fontSize: 15,
                        textDecorationLine: 'underline',
                    }}
                >
                    Bạn quên mật khẩu ư?
                </Text>
            </Pressable>

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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 122,
        maxHeight: windowHeight * 0.6,
        paddingBottom: 30,
    },
});
