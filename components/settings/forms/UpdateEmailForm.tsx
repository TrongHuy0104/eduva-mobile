import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
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

const { height: windowHeight } = Dimensions.get('window');
export default function UpdateEmailForm() {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitted },
        watch,
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
    });

    const inputValue = watch('email');

    const onSubmit = async (data: any) => {
        console.log('Form data:', data);
    };

    const onError = (errors: any) => {
        console.log('Form errors:', errors);
    };

    return (
        <View style={styles.container}>
            <View style={{ width: '100%', marginTop: 10, overflow: 'hidden' }}>
                <InputField
                    control={control}
                    name="email"
                    label="Email"
                    rules={{
                        required: 'Trường này không được để trống',
                        pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: 'Email không hợp lệ',
                        },
                    }}
                    placeholder="Nhập địa chỉ email của bạn"
                    error={errors.email}
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
                disabled={!inputValue}
                style={{ opacity: !inputValue ? 0.5 : 1 }}
            >
                <LinearGradient
                    colors={['#4dbfe9', '#2093e7', '#22cfd2']}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0.33, y: 0 }}
                    end={{ x: 1, y: 1 }}
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
