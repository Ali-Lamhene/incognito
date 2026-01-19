import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, TextStyle, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';

interface MainButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'outline' | 'ghost';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function MainButton({ onPress, title, variant = 'primary', style, textStyle }: MainButtonProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
    };

    const getButtonStyle = () => {
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
            activeOpacity={0.8}
            onPress={handlePress}
            style={[styles.container, style]}
        >
            <View style={[styles.button, getButtonStyle()]}>
                <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
            </View>
            {/* Functional Corner Detail */}
            {variant === 'primary' && (
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
