import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Dimensions,
    Keyboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import InputField from '../../InputField';
import OtpConfirmForm from './OtpConfirmForm';

const { height: windowHeight } = Dimensions.get('window');
export default function ConfirmPasswordForm() {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitted },
        watch,
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
    });

    const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);

    const inputValue = watch('password');

    const onSubmit = async (_data: any) => {
        setIsPasswordConfirmed(true);
    };

    const onError = (_errors: any) => {};

    const handleOtpSubmit = (_otp: string) => {};

    const handleResendOtp = () => {};

    return isPasswordConfirmed ? (
        <OtpConfirmForm onSubmit={handleOtpSubmit} onResend={handleResendOtp} />
    ) : (
        <View>
            <Text style={styles.heading}>Xác nhận mật khẩu</Text>
            <Text style={styles.subheading}>
                Nhập mật khẩu của bạn để nhận mã xác minh. Mã này sẽ được sử
                dụng để kích hoạt xác minh 2 bước cho tài khoản của bạn.
            </Text>
            <View style={styles.container}>
                <View
                    style={{ width: '100%', marginTop: 10, overflow: 'hidden' }}
                >
                    <InputField
                        control={control}
                        name="password"
                        label="Password"
                        numberOfLines={1}
                        rules={{
                            required: 'Trường này không được để trống',
                        }}
                        placeholder="Nhập mật khẩu hiện tại của bạn"
                        error={errors.password}
                        isSubmitted={isSubmitted}
                        secureTextEntry={true}
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        Keyboard.dismiss();
                        handleSubmit(onSubmit, onError)();
                    }}
                    disabled={!inputValue}
                    style={{ opacity: !inputValue ? 0.5 : 1 }}
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
                            Xác nhận
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 122,
        maxHeight: windowHeight * 0.6,
        paddingBottom: 30,
    },
    heading: {
        fontWeight: '600',
        fontSize: 24,
    },
    subheading: {
        marginTop: 8,
        fontSize: 15,
        opacity: 0.9,
    },
});
