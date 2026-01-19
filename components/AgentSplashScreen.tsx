import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { useTranslation } from '../hooks/useTranslation';
import { ThemedText } from './ThemedText';

const { width, height } = Dimensions.get('window');

interface AgentSplashScreenProps {
    onComplete: () => void;
}

export function AgentSplashScreen({ onComplete }: AgentSplashScreenProps) {
    const { t } = useTranslation();
    const opacity = useSharedValue(0);
    const imageScale = useSharedValue(1.1);
    const scanLineY = useSharedValue(-height * 0.5);
    const textOpacity = useSharedValue(0);
    const progress = useSharedValue(0);

    useEffect(() => {
        // Entrance sequence
        opacity.value = withTiming(1, { duration: 2000 });
        imageScale.value = withTiming(1, { duration: 6000, easing: Easing.out(Easing.quad) });
        textOpacity.value = withDelay(1000, withTiming(1, { duration: 1000 }));

        // Progress bar simulation
        progress.value = withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.quad) });

        // Scan line movement
        scanLineY.value = withRepeat(
            withTiming(height * 0.6, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
            -1,
            true
        );

        // Completion trigger
        const timer = setTimeout(() => {
            const duration = 1200;
            opacity.value = withTiming(0, { duration });
            textOpacity.value = withTiming(0, { duration }, () => {
                if (onComplete) {
                    runOnJS(onComplete)();
                }
            });
        }, 5000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    const animatedImageStyle = useAnimatedStyle(() => ({
        opacity: opacity.value * 0.6,
        transform: [{ scale: imageScale.value }],
    }));

    const scanLineStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scanLineY.value }],
        opacity: opacity.value,
    }));

    const progressStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`,
    }));

    return (
        <View style={styles.container}>
            {/* Background Suspect Image with Zoom effect */}
            <Animated.View style={[StyleSheet.absoluteFill, animatedImageStyle]}>
                <Image
                    source={require('../assets/images/suspect_photo_bg.png')}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                />
            </Animated.View>

            {/* Dark Overlay for text legibility */}
            <View style={styles.darkOverlay} />

            {/* Scanning Laser */}
            <Animated.View style={[styles.scanLine, scanLineStyle]} />

            {/* Loading UI Elements */}
            <View style={styles.content}>
                <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
                    <ThemedText type="code" style={styles.loadingLabel}>{t('splash.analyzing')}</ThemedText>
                    <ThemedText type="futuristic" style={styles.statusTitle}>{t('splash.detection')}</ThemedText>

                    {/* Visual Progress Bar */}
                    <View style={styles.progressBarBg}>
                        <Animated.View style={[styles.progressBarFill, progressStyle]} />
                    </View>

                    <View style={styles.metadata}>
                        <ThemedText type="code" style={styles.metaText}>MATCH: 94.2%</ThemedText>
                        <ThemedText type="code" style={styles.metaText}>SECURE_LINK // ACTIVE</ThemedText>
                    </View>
                </Animated.View>
            </View>

            {/* Decorative Grid or corner markers */}
            <View style={styles.cornerMarkers}>
                <View style={styles.cornerTL} />
                <View style={styles.cornerBR} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 1000,
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 100,
    },
    textContainer: {
        width: '80%',
        alignItems: 'center',
        gap: 12,
    },
    loadingLabel: {
        fontSize: 10,
        color: '#FFF',
        opacity: 0.6,
        letterSpacing: 2,
    },
    statusTitle: {
        fontSize: 16,
        color: '#FFF',
        letterSpacing: 4,
    },
    progressBarBg: {
        width: '100%',
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 20,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFF',
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    metadata: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    metaText: {
        fontSize: 8,
        opacity: 0.4,
    },
    scanLine: {
        position: 'absolute',
        top: '20%',
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        zIndex: 5,
    },
    cornerMarkers: {
        ...StyleSheet.absoluteFillObject,
        padding: 40,
        pointerEvents: 'none',
    },
    cornerTL: {
        position: 'absolute',
        top: 60,
        left: 40,
        width: 30,
        height: 30,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    cornerBR: {
        position: 'absolute',
        bottom: 60,
        right: 40,
        width: 30,
        height: 30,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
});
