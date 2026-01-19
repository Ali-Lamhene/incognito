import { StyleSheet, Text, useColorScheme, type TextProps } from 'react-native';
import { Colors } from '../constants/Colors';

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'subtitle' | 'caption' | 'code' | 'futuristic' | 'hero';
};

export function ThemedText({
    style,
    lightColor,
    darkColor,
    type = 'default',
    ...rest
}: ThemedTextProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const color = colorScheme === 'dark' ? (darkColor ?? Colors.dark.text) : (lightColor ?? Colors.light.text);

    return (
        <Text
            style={[
                { color },
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'hero' ? styles.hero : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'caption' ? styles.caption : undefined,
                type === 'code' ? styles.code : undefined,
                type === 'futuristic' ? styles.futuristic : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    hero: {
        fontSize: 38,
        fontWeight: '900',
        letterSpacing: 3,
        textTransform: 'uppercase',
        lineHeight: 46,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 1,
    },
    caption: {
        fontSize: 12,
        opacity: 0.6,
    },
    code: {
        fontSize: 12,
        fontFamily: 'monospace',
        opacity: 0.8,
        letterSpacing: 1,
    },
    futuristic: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 3,
    },
});
