import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export function BackgroundAtmosphere() {
    const time = useSharedValue(0);

    useEffect(() => {
        time.value = withRepeat(
            withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.sin) }),
            -1,
            true
        );
    }, []);

    const blob1Style = useAnimatedStyle(() => {
        const tx = interpolate(time.value, [0, 1], [-width * 0.2, width * 0.2]);
        const ty = interpolate(time.value, [0, 1], [-height * 0.1, height * 0.1]);
        return {
            transform: [{ translateX: tx }, { translateY: ty }],
        };
    });

    const blob2Style = useAnimatedStyle(() => {
        const tx = interpolate(time.value, [0, 1], [width * 0.3, -width * 0.1]);
        const ty = interpolate(time.value, [0, 1], [height * 0.2, -height * 0.2]);
        return {
            transform: [{ translateX: tx }, { translateY: ty }],
        };
    });

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Deep Background Layer */}
            <View style={styles.deepBackground} />

            {/* Atmospheric Glows */}
            <Animated.View style={[styles.blob, styles.blueBlob, blob1Style]} />
            <Animated.View style={[styles.blob, styles.purpleBlob, blob2Style]} />

            {/* Tactical Texture */}
            <View style={styles.gridOverlay}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 12.5}%` }]} />
                ))}
                {Array.from({ length: 12 }).map((_, i) => (
                    <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 8.3}%` }]} />
                ))}
            </View>

            {/* Screen Vignette */}
            <View style={styles.vignette} />
        </View>
    );
}

const styles = StyleSheet.create({
    deepBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#040406',
    },
    blob: {
        position: 'absolute',
        width: width * 1.2,
        height: width * 1.2,
        borderRadius: width * 0.6,
        opacity: 0.12,
    },
    blueBlob: {
        backgroundColor: '#6366F1',
        top: -width * 0.2,
        left: -width * 0.2,
    },
    purpleBlob: {
        backgroundColor: '#EC4899',
        bottom: -width * 0.3,
        right: -width * 0.1,
    },
    gridOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.04,
    },
    gridLineV: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: '#FFF',
    },
    gridLineH: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#FFF',
    },
    vignette: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        // We simulate vignette with a dark border/gradient feel
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 100,
    },
});
