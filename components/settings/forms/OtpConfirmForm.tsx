import { useOtpTimer } from '@/hooks/useOtpTimer';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

interface OtpConfirmFormProps {
    readonly onSubmit?: (_otp: string) => Promise<any> | void;
    readonly onResend?: (resetTimer: () => void) => void;
}

export default function OtpConfirmForm({
    onSubmit,
    onResend,
}: OtpConfirmFormProps) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<TextInput[]>([]);
    const { timeLeft, startTimer, canResend } = useOtpTimer();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // Move to previous input on backspace
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        const otpString = otp.join('');
        if (otpString.length === 6 && onSubmit) {
            try {
                const result = onSubmit(otpString);
                if (
                    result &&
                    typeof (result as Promise<any>).then === 'function'
                ) {
                    setIsSubmitting(true);
                    await result;
                }
            } catch {
                // swallow - toast handled by mutation
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Xác nhận OTP</Text>
            <Text style={styles.description}>
                Nhập mã OTP đã được gửi đến email của bạn. Mã này sẽ được sử
                dụng để kích hoạt xác minh 2 bước cho tài khoản của bạn.
            </Text>

            <View style={styles.otpContainer}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => {
                            inputRefs.current[index] = ref as TextInput;
                        }}
                        style={styles.otpInput}
                        maxLength={1}
                        keyboardType="number-pad"
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        value={otp[index]}
                    />
                ))}
            </View>

            <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Không nhận được mã OTP? </Text>
                <TouchableOpacity
                    onPress={() => {
                        onResend?.(startTimer);
                    }}
                    disabled={!canResend}
                >
                    <Text
                        style={[
                            styles.resendButton,
                            !canResend && styles.resendButtonDisabled,
                        ]}
                    >
                        {!canResend
                            ? `Gửi lại sau (${formatTime(timeLeft)})`
                            : 'Gửi lại'}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleSubmit}
                disabled={otp.some((digit) => !digit) || isSubmitting}
                style={{
                    opacity:
                        otp.some((digit) => !digit) || isSubmitting ? 0.5 : 1,
                }}
            >
                <LinearGradient
                    colors={['#4dbfe9', '#2093e7', '#22cfd2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                        styles.submitButton,
                        {
                            marginTop: 24,
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 9999,
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isSubmitting ? 0.7 : 1,
                            flexDirection: 'row',
                            gap: 6,
                        },
                    ]}
                >
                    {isSubmitting && (
                        <ActivityIndicator color="white" size="small" />
                    )}
                    <Text style={styles.submitButtonText}>Xác nhận</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 122,
        maxHeight: windowHeight * 0.6,
        paddingBottom: 30,
    },
    title: {
        fontWeight: '600',
        fontSize: 24,
    },
    description: {
        marginTop: 8,
        marginBottom: 28,
        fontSize: 15,
        opacity: 0.8,
    },

    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    otpInput: {
        width: (windowWidth - 120) / 6,
        height: (windowWidth - 120) / 6,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: '#fff',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    resendText: {
        color: '#666',
    },
    resendButton: {
        color: '#2093e7',
        fontWeight: '600',
    },
    submitButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    resendButtonDisabled: {
        opacity: 0.5,
        color: '#666',
    },
});
