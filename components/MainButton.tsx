import * as Haptics from 'expo-haptics';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';

interface MainButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'outline' | 'ghost';
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
}

export function MainButton({ onPress, title, variant = 'primary', style, textStyle, disabled }: MainButtonProps) {
    const colorScheme = 'dark';
    const colors = Colors[colorScheme];

    const handlePress = () => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
    };

    const getButtonStyle = () => {
        if (disabled) {
            return { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' };
        }
        switch (variant) {
            case 'outline':
                return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary };
            case 'ghost':
                return { backgroundColor: 'transparent' };
            default:
                return { backgroundColor: colors.primary };
        }
    };

    const getTextStyle = () => {
        if (disabled) {
            return { color: 'rgba(255,255,255,0.2)' };
        }
        switch (variant) {
            case 'outline':
                return { color: colors.primary };
            case 'ghost':
                return { color: colors.text };
            default:
                return { color: '#000' }; // Black text on neon primary
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={disabled ? 1 : 0.8}
            onPress={handlePress}
            disabled={disabled}
            style={[styles.container, style, disabled && { opacity: 0.7 }]}
        >
            <View style={[styles.button, getButtonStyle()]}>
                <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
            </View>
            {/* Functional Corner Detail */}
            {variant === 'primary' && !disabled && (
                <View style={[styles.corner, { borderTopColor: '#FFF', borderLeftColor: '#FFF' }]} />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 8,
    },
    button: {
        paddingVertical: 18,
        paddingHorizontal: 25,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    text: {
        fontSize: 14,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    corner: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 10,
        height: 10,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        opacity: 0.5,
    },
});
