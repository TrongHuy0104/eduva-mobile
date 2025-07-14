import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

export type ButtonVariant = 'outline' | 'text' | 'icon';

interface GradientButtonProps {
    variant: ButtonVariant;
    text?: string;
    imgSrc?: ImageSourcePropType;
    tooltipText?: string;
    isDisabled?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
    variant,
    text = '',
    imgSrc,
    tooltipText = '',
    isDisabled = false,
    onPress,
    style,
    textStyle,
    iconLeft,
    iconRight,
}) => {
    const handlePress = () => {
        if (!isDisabled && onPress) {
            onPress();
        }
    };

    const renderIconButton = () => (
        <TouchableOpacity
            style={[
                styles.btn,
                styles.btnIcon,
                isDisabled && styles.btnDisabled,
                style,
            ]}
            onPress={handlePress}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            <View style={styles.iconContainer}>
                {imgSrc && (
                    <Image
                        source={imgSrc}
                        style={styles.iconImage}
                        accessibilityLabel={tooltipText}
                    />
                )}
            </View>
        </TouchableOpacity>
    );

    const renderTextButton = () => (
        <TouchableOpacity
            style={[
                styles.btn,
                styles.btnText,
                isDisabled && styles.btnDisabled,
                style,
            ]}
            onPress={handlePress}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            {iconLeft && <View style={styles.iconWrapper}>{iconLeft}</View>}
            <Text style={[styles.btnTextContent, textStyle]}>{text}</Text>
            {iconRight && <View style={styles.iconWrapper}>{iconRight}</View>}
        </TouchableOpacity>
    );

    const renderOutlineButton = () => (
        <TouchableOpacity
            style={[
                styles.btn,
                styles.btnOutline,
                isDisabled && styles.btnDisabled,
                style,
            ]}
            onPress={handlePress}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={['#5ebbff', '#a174ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBorder}
            >
                <View style={styles.outlineContent}>
                    {iconLeft && (
                        <View style={styles.iconWrapper}>{iconLeft}</View>
                    )}
                    <Text style={[styles.btnTextContent, textStyle]}>
                        {text}
                    </Text>
                    {iconRight && (
                        <View style={styles.iconWrapper}>{iconRight}</View>
                    )}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    switch (variant) {
        case 'icon':
            return renderIconButton();
        case 'text':
            return renderTextButton();
        case 'outline':
            return renderOutlineButton();
        default:
            return renderOutlineButton();
    }
};

const styles = StyleSheet.create({
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    btnIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#292d35',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    iconContainer: {
        flex: 1,
        height: 38,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 19,
        backgroundColor: '#fbfdff',
    },
    iconImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    btnOutline: {
        height: 36,
        paddingLeft: 4,
        paddingVertical: 2,
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 16,
    },
    gradientBorder: {
        borderRadius: 8,
        padding: 3,
    },
    outlineContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderRadius: 5,
        paddingHorizontal: 8,
        gap: 4,
    },
    btnText: {
        height: 36,
        paddingHorizontal: 12,
        borderWidth: 3,
        borderColor: 'transparent',
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    btnTextContent: {
        marginLeft: 4,
        fontSize: 16,
        textTransform: 'uppercase',
        fontWeight: '700',
        color: '#fff',
    },
    btnDisabled: {
        backgroundColor: '#e1effe',
        opacity: 0.6,
    },
    iconWrapper: {
        marginHorizontal: 3,
    },
});

export default GradientButton;
