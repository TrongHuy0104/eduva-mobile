import { useLogin } from '@/hooks/useAuth';
import { LoginRequest } from '@/types/requests/login.request';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Keyboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import GradientText from '../GradientText';
import InputField from '../InputField';

const LoginForm = () => {
    const { mutate: login, isPending } = useLogin();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
    });

    const onSubmit = async (data: any) => {
        login(data as LoginRequest);
    };

    const onError = (errors: any) => {
        console.log('Form errors:', errors);
    };

    return (
        <View>
            <View style={styles.headingWrapper}>
                <Text style={styles.heading}>Đăng nhập</Text>
                <GradientText
                    text="EDUVA"
                    style={{
                        fontSize: 28,
                        fontWeight: '900',
                        marginTop: 6,
                        marginLeft: 2,
                    }}
                />
            </View>
            <Text style={styles.subheading}>
                Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người
                sử dụng chung sẽ bị khóa.
            </Text>

            {/* Form */}
            <View style={styles.container}>
                {/* Email */}
                <View
                    style={{ width: '100%', marginTop: 10, overflow: 'hidden' }}
                >
                    <InputField
                        control={control}
                        name="email"
                        label="Email"
                        rules={{
                            required: 'Trường này không được để trống',
                            pattern: {
                                value: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
                                message: 'Email không hợp lệ',
                            },
                        }}
                        placeholder="Nhập địa chỉ email của bạn"
                        error={errors.email}
                        isSubmitted={isSubmitted}
                    />
                </View>

                {/* Password */}
                <View
                    style={{ width: '100%', marginTop: 10, overflow: 'hidden' }}
                >
                    <InputField
                        control={control}
                        numberOfLines={1}
                        secureTextEntry={true}
                        name="password"
                        rules={{
                            required: 'Vui lòng nhập mật khẩu của bạn',
                        }}
                        placeholder="Nhập mật khẩu của bạn"
                        error={errors?.password}
                        isSubmitted={isSubmitted}
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    disabled={isPending}
                    onPress={() => {
                        Keyboard.dismiss();
                        handleSubmit(onSubmit, onError)();
                    }}
                >
                    <LinearGradient
                        colors={['#4dbfe9', '#2093e7', '#22cfd2']}
                        locations={[0, 0.5, 1]}
                        start={{ x: 0.33, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            marginTop: 24,
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 9999,
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isPending ? 0.7 : 1,
                            flexDirection: 'row',
                            gap: 6,
                        }}
                    >
                        {isPending && (
                            <ActivityIndicator color="white" size="small" />
                        )}
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: '600',
                                fontSize: 16,
                            }}
                        >
                            Đăng nhập
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginForm;

const styles = StyleSheet.create({
    headingWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    heading: {
        fontWeight: '600',
        fontSize: 24,
        marginTop: 12,
        marginBottom: 4,
        textAlign: 'center',
    },
    subheading: {
        marginTop: 8,
        fontSize: 15,
        opacity: 0.9,
        color: '#F33A58',
        textAlign: 'center',
    },
    container: {
        minHeight: 122,
        paddingBottom: 30,
    },
});
