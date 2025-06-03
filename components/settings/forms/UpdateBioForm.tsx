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
export default function UpdateBioForm() {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitted },
        watch,
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
    });

    const inputValue = watch('bio');

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
                    name="bio"
                    label="Giới thiệu"
                    rules={{
                        required: 'Trường này không được để trống',
                        minLength: {
                            value: 5,
                            message: 'Tên người dùng phải có ít nhất 5 ký tự',
                        },
                    }}
                    multiline={true}
                    numberOfLines={5}
                    disabledValidate={true}
                    placeholder="Nhập họ và tên của bạn"
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
