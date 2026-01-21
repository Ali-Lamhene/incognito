import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { useTranslation } from '../hooks/useTranslation';
import { ThemedText } from './ThemedText';

const { width, height } = Dimensions.get('window');

interface MissionCompleteSplashScreenProps {
    onComplete: () => void;
}

export function MissionCompleteSplashScreen({ onComplete }: MissionCompleteSplashScreenProps) {
    const { t } = useTranslation();

    const opacity = useSharedValue(0);
    const glitchX = useSharedValue(0);
    const glitchY = useSharedValue(0);
    const textScale = useSharedValue(1);
    const noiseOpacity = useSharedValue(0);
    const overlayOpacity = useSharedValue(0.8);

    useEffect(() => {
        // Initial entrance
        opacity.value = withTiming(1, { duration: 500 });

        // Glitch loop
        glitchX.value = withRepeat(
            withSequence(
                withTiming(15, { duration: 50 }),
                withTiming(-15, { duration: 50 }),
                withTiming(0, { duration: 50 }),
                withDelay(400, withTiming(0, { duration: 50 }))
            ),
            -1,
            false
        );

        glitchY.value = withRepeat(
            withSequence(
                withDelay(200, withTiming(5, { duration: 50 })),
                withTiming(-5, { duration: 50 }),
                withTiming(0, { duration: 50 })
            ),
            -1,
            false
        );

        // Noise flicker
        noiseOpacity.value = withRepeat(
            withSequence(
                withTiming(0.3, { duration: 100 }),
                withTiming(0.1, { duration: 100 }),
                withTiming(0.4, { duration: 50 }),
                withTiming(0.2, { duration: 150 })
            ),
            -1,
            true
        );

        // Slow zoom on text
        textScale.value = withTiming(1.2, { duration: 5000, easing: Easing.out(Easing.quad) });

        // Completion trigger
        const timer = setTimeout(() => {
            overlayOpacity.value = withTiming(1, { duration: 1000 }, () => {
                if (onComplete) {
                    runOnJS(onComplete)();
                }
            });
        }, 5000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    const glitchStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: glitchX.value },
            { translateY: glitchY.value },
            { scale: textScale.value }
        ],
    }));

    const noiseStyle = useAnimatedStyle(() => ({
        opacity: noiseOpacity.value,
    }));

    const containerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const finalOverlayStyle = useAnimatedStyle(() => ({
        backgroundColor: '#000',
        opacity: interpolate(overlayOpacity.value, [0.8, 1], [0, 1]),
    }));

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            <View style={StyleSheet.absoluteFill}>
                <Image
                    source={require('../assets/images/exfiltration_splash_noir.png')}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    priority="high"
                />
            </View>

            {/* Noise Layer */}
            <Animated.View style={[styles.noiseContainer, noiseStyle]}>
                <Image
                    source={require('../assets/images/tactical_texture.png')}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                />
            </Animated.View>

            <View style={[styles.darkOverlay, { opacity: overlayOpacity.value }]} />

            {/* Glitchy Text Content */}
            <Animated.View style={[styles.content, glitchStyle]}>
                <View style={styles.warningBox}>
                    <View style={styles.warningHeader}>
                        <View style={styles.alertDot} />
                        <ThemedText type="code" style={styles.alertLabel}>
                            {t('splash.mission_complete')}
                        </ThemedText>
                    </View>

                    <ThemedText type="futuristic" style={styles.mainTitle}>
                        {t('splash.mission_complete')}
                    </ThemedText>

                    <View style={styles.separator} />

                    <ThemedText type="code" style={styles.subText}>
                        {t('splash.exfiltration')}
                    </ThemedText>
                </View>

                {/* Cyber Logs */}
                <View style={styles.logsContainer}>
                    <ThemedText type="code" style={styles.logLine}>{`> KILLING_SESSION_STREAM... OK`}</ThemedText>
                    <ThemedText type="code" style={styles.logLine}>{`> ENCRYPTING_EVIDENCES... 100%`}</ThemedText>
                    <ThemedText type="code" style={styles.logLine}>{`> DISCONNECTING_HQ... DONE`}</ThemedText>
                </View>
            </Animated.View>

            {/* Final transition overlay */}
            <Animated.View style={[StyleSheet.absoluteFill, finalOverlayStyle, { pointerEvents: 'none' }]} />

            {/* Scanning Laser Line (Glitchy version) */}
            <Animated.View style={styles.scanningLine} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 20000,
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    noiseContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FFF',
    },
    content: {
        width: '90%',
        alignItems: 'center',
    },
    warningBox: {
        padding: 30,
        borderWidth: 2,
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.05)',
        alignItems: 'center',
        width: '100%',
        maxWidth: 500,
    },
    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    alertDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF6B6B',
    },
    alertLabel: {
        fontSize: 10,
        color: '#FF6B6B',
        letterSpacing: 2,
        fontWeight: 'bold',
    },
    mainTitle: {
        fontSize: 28,
        color: '#FFF',
        textAlign: 'center',
        textShadowColor: 'rgba(255, 107, 107, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    separator: {
        width: '60%',
        height: 1,
        backgroundColor: '#FF6B6B',
        opacity: 0.5,
        marginVertical: 20,
    },
    subText: {
        fontSize: 12,
        color: '#FFF',
        opacity: 0.7,
        letterSpacing: 3,
    },
    logsContainer: {
        marginTop: 40,
        alignItems: 'flex-start',
        width: '100%',
        maxWidth: 400,
        opacity: 0.5,
    },
    logLine: {
        fontSize: 8,
        color: '#FFF',
        marginBottom: 5,
        fontFamily: 'monospace',
    },
    scanningLine: {
        position: 'absolute',
        width: '100%',
        height: 2,
        backgroundColor: '#FF6B6B',
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        opacity: 0.3,
    }
});
