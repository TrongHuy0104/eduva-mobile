import React from 'react';
import { Controller } from 'react-hook-form';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { DefaultTheme, TextInput as PaperTextInput } from 'react-native-paper';

import { FontAwesome6 } from '@expo/vector-icons';
import type {
    Control,
    FieldError,
    FieldErrorsImpl,
    FieldValues,
    Merge,
    RegisterOptions,
} from 'react-hook-form';

interface InputFieldProps {
    control: Control<FieldValues, any>;
    name: string;
    label?: string;
    rules?: RegisterOptions;
    placeholder?: string;
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
    multiline?: boolean;
    numberOfLines?: number;
    disabledValidate?: boolean;
    isSubmitted?: boolean;
    keyboardType?: 'default' | 'phone-pad';
    secureTextEntry?: boolean;
    defaultValue?: string;
    readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    control,
    name,
    label,
    rules,
    placeholder,
    error,
    multiline = false,
    numberOfLines = 4,
    disabledValidate = false,
    isSubmitted = false,
    keyboardType = 'default',
    secureTextEntry = false,
    defaultValue = '',
    readOnly = false,
}) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const shakeAnim = React.useRef(new Animated.Value(0)).current;
    const [showPassword, setShowPassword] = React.useState(false);
    // Store latest field state for validation and shake
    const latestFieldState = React.useRef({
        invalid: false,
        isTouched: false,
        isSubmitted: false,
    });
    const [shouldShowError, setShouldShowError] = React.useState(false);
    const prevShouldShowError = React.useRef(false);
    // Add state for invalid and isTouched
    const [fieldInvalid, setFieldInvalid] = React.useState(false);
    const [fieldTouched, setFieldTouched] = React.useState(false);

    const getInputColor = (invalid: boolean, isTouched: boolean) => {
        if (invalid && isTouched && !disabledValidate) {
            return '#f33a58';
        }
        return '#2093e7';
    };

    const theme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: '#2093e7',
            text: '#000000',
            placeholder: '#666666',
            error: 'transparent',
        },
    };

    const handleFocus = (onBlur: () => void) => {
        return () => {
            setIsFocused(false);
            onBlur();
        };
    };

    React.useEffect(() => {
        const localShouldShowError =
            fieldInvalid && (fieldTouched || isSubmitted) && !disabledValidate;
        setShouldShowError(localShouldShowError);
        if (!prevShouldShowError.current && localShouldShowError) {
            shakeAnim.setValue(0);
            Animated.sequence([
                Animated.timing(shakeAnim, {
                    toValue: 1,
                    duration: 60,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: -1,
                    duration: 60,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: 1,
                    duration: 60,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnim, {
                    toValue: 0,
                    duration: 60,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ]).start();
        }
        prevShouldShowError.current = localShouldShowError;
    }, [fieldInvalid, fieldTouched, isSubmitted, disabledValidate, shakeAnim]);

    return (
        <View style={styles.container}>
            {/* Label */}
            {label && <Text style={styles.label}>{label}</Text>}

            {/* Input Field */}
            <Controller
                control={control}
                name={name}
                rules={disabledValidate ? {} : rules}
                render={({
                    field: { value, onChange, onBlur },
                    fieldState: { invalid, isTouched },
                }) => {
                    // Always update latestFieldState with isSubmitted from props
                    latestFieldState.current = {
                        invalid,
                        isTouched,
                        isSubmitted,
                    };
                    // Update state for useEffect
                    if (fieldInvalid !== invalid) setFieldInvalid(invalid);
                    if (fieldTouched !== isTouched) setFieldTouched(isTouched);
                    return (
                        <View style={{ position: 'relative', width: '100%' }}>
                            <PaperTextInput
                                keyboardType={keyboardType}
                                style={[
                                    styles.input,
                                    multiline && styles.textarea,
                                    shouldShowError ? styles.errorInput : null,
                                    isFocused &&
                                        !shouldShowError &&
                                        styles.focusedInput,
                                    { paddingRight: 44 },
                                ]}
                                secureTextEntry={
                                    secureTextEntry && !showPassword
                                }
                                defaultValue={defaultValue}
                                readOnly={readOnly}
                                contentStyle={{ paddingRight: 0 }}
                                theme={theme}
                                placeholder={placeholder}
                                value={value ?? defaultValue}
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                onChangeText={onChange}
                                onBlur={handleFocus(onBlur)}
                                onFocus={() => setIsFocused(true)}
                                error={shouldShowError}
                                multiline={multiline}
                                numberOfLines={numberOfLines}
                                textAlignVertical={multiline ? 'top' : 'center'}
                                cursorColor={getInputColor(invalid, isTouched)}
                                selectionColor={`${getInputColor(
                                    invalid,
                                    isTouched
                                )}20`}
                            />
                            {/* Error Icon */}
                            {shouldShowError && !secureTextEntry && (
                                <Animated.View
                                    style={[
                                        styles.iconContainer,
                                        {
                                            transform: [
                                                {
                                                    translateX:
                                                        shakeAnim.interpolate({
                                                            inputRange: [-1, 1],
                                                            outputRange: [
                                                                -8, 8,
                                                            ],
                                                        }),
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    <FontAwesome6
                                        name="triangle-exclamation"
                                        size={20}
                                        color="#f33a58"
                                    />
                                </Animated.View>
                            )}

                            {/* Password Eye Icon */}
                            {secureTextEntry && (
                                <TouchableOpacity
                                    style={[
                                        styles.iconContainer,
                                        shouldShowError && {
                                            transform: [
                                                {
                                                    translateX:
                                                        shakeAnim.interpolate({
                                                            inputRange: [-1, 1],
                                                            outputRange: [
                                                                -8, 8,
                                                            ],
                                                        }),
                                                },
                                            ],
                                        },
                                    ]}
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    <FontAwesome6
                                        name={
                                            showPassword ? 'eye-slash' : 'eye'
                                        }
                                        size={20}
                                        color={
                                            shouldShowError
                                                ? '#f33a58'
                                                : '#666666'
                                        }
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                }}
            />

            {/* Error Message */}
            {!disabledValidate &&
                error &&
                typeof (error as any)?.message === 'string' && (
                    <Text style={styles.errorText}>
                        {(error as any).message}
                    </Text>
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        textAlign: 'left',
        width: '100%',
        color: '#292929',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginVertical: 10,
        marginLeft: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 44,
        borderTopRightRadius: 44,
        borderBottomLeftRadius: 44,
        borderBottomRightRadius: 44,
        height: 44,
        flexDirection: 'row',
        borderWidth: 1.5,
        borderColor: '#dee3e9',
        width: '100%',
        paddingRight: 0,
        paddingLeft: 0,
        fontSize: 16,
        textAlign: 'left',
    },
    textarea: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        minHeight: 100,
        height: 'auto',
        paddingTop: 12,
        paddingBottom: 12,
        textAlignVertical: 'top',
        textAlign: 'left',
    },
    errorInput: {
        borderColor: '#f33a58',
        backgroundColor: '#ff00001a',
    },
    errorText: {
        color: '#f33a58',
        marginVertical: 8,
        marginLeft: 8,
        fontSize: 14,
        fontWeight: 500,
    },
    focusedInput: {
        borderColor: '#2093e7',
    },
    iconContainer: {
        position: 'absolute',
        right: 12,
        top: '43%',
        marginTop: -9,
        zIndex: 10,
        backgroundColor: 'transparent',
    },
});

export default InputField;
