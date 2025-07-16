import { useAuth } from '@/contexts/auth.context';
import { useModal } from '@/contexts/modal.context';
import { useEnrollClass } from '@/hooks/useClass';
import { useToast } from '@/hooks/useToast';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import InputField from '../InputField';

const EnrollClassForm = () => {
    const { user } = useAuth();
    const { closeModal } = useModal();
    const toast = useToast();
    const { mutate: enrollClass, isPending } = useEnrollClass();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
    });

    // Store mutation state

    const onSubmit = async (data: any) => {
        const { classCode } = data;
        enrollClass(classCode, {
            onSuccess: () => {
                toast.success(
                    'Tham gia lớp học thành công',
                    'Bạn đã tham gia lớp học thành công.'
                );
                closeModal();
                router.push('/(tabs)/home');
            },
            onError: (error) => {
                console.log('Enroll error:', error);
            },
        });
    };

    const onError = (errors: any) => {
        console.log('Form errors:', errors);
    };

    return (
        <View>
            <Text style={styles.title}>Tham gia lớp học</Text>

            {/* User information */}
            <View style={styles.userInfo}>
                <Text style={styles.label}>
                    Bạn đang đăng nhập bằng tài khoản
                </Text>
                <View style={styles.userInfoContent}>
                    <Image
                        style={[styles.avatar]}
                        source={user?.avatarUrl ?? ''}
                        contentFit="contain"
                        transition={1000}
                    />
                    <View>
                        <Text
                            style={styles.userInfoName}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {user?.fullName}
                        </Text>
                        <Text
                            style={styles.userInfoEmail}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {user?.email}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Form */}
            <View style={styles.form}>
                <Text style={styles.label}>Mã lớp</Text>
                <Text style={{ fontSize: 14, marginTop: 4, marginBottom: 12 }}>
                    Đề nghị giáo viên của bạn cung cấp mã lớp rồi nhập mã đó vào
                    đây
                </Text>

                <InputField
                    control={control}
                    name="classCode"
                    rules={{
                        required: 'Trường này không được để trống',
                        maxLength: {
                            value: 8,
                            message: 'Mã lớp phải có 8 ký tự',
                        },
                        minLength: {
                            value: 8,
                            message: 'Mã lớp phải có 8 ký tự',
                        },
                    }}
                    placeholder="Nhập mã lớp"
                    error={errors.classCode}
                    isSubmitted={isSubmitted}
                />
            </View>

            {/* Description */}
            <View style={styles.footer}>
                <Text style={styles.label}>Cách đăng nhập bằng mã lớp học</Text>
                <Text style={{ fontSize: 14, marginVertical: 4 }}>
                    • Sử dụng tài khoản được cấp phép
                </Text>
                <Text style={{ fontSize: 14, lineHeight: 20 }}>
                    • Sử dụng mã lớp gồm 8 chữ cái hoặc số, không có dấu cách
                    hoặc ký hiệu
                </Text>

                <View style={styles.buttonContainer}>
                    <Pressable
                        onPress={closeModal}
                        style={({ pressed }) => [
                            { opacity: pressed ? 0.7 : 1 },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '500',
                                marginRight: 8,
                            }}
                        >
                            Hủy
                        </Text>
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            {
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 40,
                                backgroundColor: '#0093fc',
                                borderRadius: 999,
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                maxWidth: 100,
                                flexDirection: 'row',
                                gap: 6,
                            },
                            { opacity: pressed ? 0.7 : 1 },
                        ]}
                        onPress={() => {
                            handleSubmit(onSubmit, onError)();
                        }}
                    >
                        {isPending ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <Text
                                style={{
                                    color: '#fff',
                                    fontWeight: '600',
                                    fontSize: 16,
                                }}
                            >
                                Tham gia
                            </Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default EnrollClassForm;

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: '600',
    },
    userInfo: {
        marginTop: 16,
        padding: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccd0d9',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    userInfoContent: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 999,
        marginRight: 12,
    },
    userInfoName: {
        fontSize: 16,
    },
    userInfoEmail: {
        fontSize: 14,
        marginTop: 2,
    },
    form: {
        marginTop: 20,
        padding: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccd0d9',
    },
    footer: {
        marginTop: 8,
        padding: 16,
        paddingBottom: 0,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 16,
        marginTop: 30,
        marginRight: -16,
    },
});
