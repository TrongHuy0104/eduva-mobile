import { useAuth } from '@/contexts/auth.context';
import { useUpdateProfile } from '@/hooks/useUser';
import { User } from '@/types/models/user.model';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Dimensions,
    Keyboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import InputField from '../../InputField';

const { height: windowHeight } = Dimensions.get('window');
export default function UpdatePhoneForm({
    defaultValue,
    setDialogName,
}: {
    defaultValue: string;
    setDialogName: (name: string) => void;
}) {
    const { mutate: updateProfile, isPending } = useUpdateProfile();

    const { updateCurrentUser, user } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitted },
        watch,
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
    });

    const inputValue = watch('phoneNumber');

    const onSubmit = async (data: any) => {
        updateProfile(
            {
                phoneNumber: data.phoneNumber,
            },
            {
                onSuccess() {
                    setDialogName('');
                    updateCurrentUser({
                        ...user,
                        phoneNumber: data.phoneNumber,
                    } as User);
                },
            }
        );
    };

    const onError = (errors: any) => {
        console.log('Form errors:', errors);
    };

    return (
        <View style={styles.container}>
            <View style={{ width: '100%', marginTop: 10, overflow: 'hidden' }}>
                <InputField
                    control={control}
                    defaultValue={defaultValue}
                    keyboardType="phone-pad"
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={{
                        required: 'Trường này không được để trống',
                        pattern: {
                            value: /^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-5]|9[0-9])[0-9]{7}$/,
                            message: 'Số điện thoại không hợp lệ',
                        },
                    }}
                    placeholder="Nhập số điện thoại của bạn"
                    error={errors.phoneNumber}
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
                disabled={!inputValue || inputValue === defaultValue}
                style={{
                    opacity:
                        !inputValue || inputValue === defaultValue ? 0.7 : 1,
                }}
            >
                <LinearGradient
                    colors={['#2093e7', '#22cfd2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        marginTop: 20,
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderRadius: 9999,
                        alignItems: 'center',
                        justifyContent: 'center',
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
                        Lưu lại
                    </Text>
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
});
