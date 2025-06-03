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

type Props = {
    name: string;
    label: string;
    placeholder?: string;
};
export default function UpdateSocialForm({ name, label, placeholder }: Props) {
    const {
        control,
        handleSubmit,
        formState: { isSubmitted },
        watch,
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
    });

    const inputValue = watch(name);

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
                    name={name}
                    label={label}
                    disabledValidate={true}
                    placeholder={placeholder}
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
