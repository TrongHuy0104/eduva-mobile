import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    hasMinLength,
    hasNumber,
    hasSpecialChar,
    hasUpperCase,
} from './forms/ChangePasswordForm';

interface PasswordStrengthProps {
    password: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
    const getStrengthLevel = (pass: string) => {
        let strength = 0;
        if (hasMinLength(pass)) strength++;
        if (hasSpecialChar(pass)) strength++;
        if (hasNumber(pass)) strength++;
        if (hasUpperCase(pass)) strength++;
        return strength;
    };

    const getStrengthText = (strength: number) => {
        switch (strength) {
            case 0:
            case 1:
            case 2:
                return { text: 'Mật khẩu yếu', color: '#d43031' };
            case 3:
                return { text: 'Mật khẩu trung bình', color: '#faa61b' };
            case 4:
                return { text: 'Mật khẩu mạnh', color: '#02875a' };
            default:
                return { text: '', color: '#ddd' };
        }
    };

    const strength = getStrengthLevel(password);
    const { text, color } = getStrengthText(strength);

    const barKeys = ['minLength', 'specialChar', 'number', 'upperCase'];

    return (
        <View style={styles.container}>
            <View style={styles.strengthBars}>
                {barKeys.map((key, index) => (
                    <View
                        key={key}
                        style={[
                            styles.strengthBar,
                            {
                                backgroundColor:
                                    index < strength ? color : '#ddd',
                            },
                        ]}
                    />
                ))}
            </View>
            {!!password && (
                <Text style={[styles.strengthText, { color }]}>{text}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    strengthBars: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        gap: 4,
    },
    strengthBar: {
        flex: 1,
        height: 5,
        borderRadius: 4,
    },
    strengthText: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
        textAlign: 'right',
    },
});

export default PasswordStrength;
