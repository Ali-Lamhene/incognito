import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { useTranslation } from '../hooks/useTranslation';
import { ThemedText } from './ThemedText';

const { width, height } = Dimensions.get('window');

interface MissionStartSplashScreenProps {
    onComplete: () => void;
}

export function MissionStartSplashScreen({ onComplete }: MissionStartSplashScreenProps) {
    const { t } = useTranslation();

    // Core animation values
    const containerOpacity = useSharedValue(1);
    const contentOpacity = useSharedValue(0);
    const imageScale = useSharedValue(1.1);
    const scanLineY = useSharedValue(-height * 0.5);
    const progress = useSharedValue(0);

    useEffect(() => {
        // Entrance sequence
        contentOpacity.value = withTiming(1, { duration: 1200 });
        imageScale.value = withTiming(1, { duration: 7000, easing: Easing.out(Easing.quad) });
        progress.value = withTiming(1, { duration: 5500, easing: Easing.inOut(Easing.quad) });

        // Scan line movement
        scanLineY.value = withRepeat(
            withTiming(height * 0.6, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
            -1,
            true
        );

        // Completion trigger
        const timer = setTimeout(() => {
            containerOpacity.value = withTiming(0, { duration: 1000 }, () => {
                if (onComplete) {
                    runOnJS(onComplete)();
                }
            });
        }, 6000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    const animatedContainerStyle = useAnimatedStyle(() => ({
        opacity: containerOpacity.value,
        backgroundColor: '#000',
    }));

    const animatedImageStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value * 0.5,
        transform: [{ scale: imageScale.value }],
    }));

    const scanLineStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scanLineY.value }],
        opacity: contentOpacity.value,
    }));

    const progressStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`,
    }));

    const animatedContentStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
    }));

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]} pointerEvents="none">
            {/* Background Image - Like Home Splash but Mission specific */}
            <Animated.View style={[StyleSheet.absoluteFill, animatedImageStyle]}>
                <Image
                    source={require('../assets/images/surveillance_target_v4.png')}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    priority="high"
                />
            </Animated.View>

            {/* Tactical Grid */}
            <Image
                source={require('../assets/images/tactical_texture.png')}
                style={styles.tacticalOverlay}
                contentFit="cover"
            />

            <View style={styles.darkOverlay} />

            {/* Scanning Laser */}
            <Animated.View style={[styles.scanLine, scanLineStyle]} />

            {/* Main Content */}
            <Animated.View style={[styles.content, animatedContentStyle]}>
                <View style={styles.textContainer}>
                    <View style={styles.statusHeader}>
                        <View style={styles.pulseDot} />
                        <ThemedText type="code" style={styles.loadingLabel}>
                            {t('splash.mission_start') || 'MISSION_START'}
                        </ThemedText>
                    </View>

                    <ThemedText type="futuristic" style={styles.statusTitle}>
                        {t('mission.splash_active_title')}
                    </ThemedText>

                    {/* Progress Bar */}
                    <View style={styles.progressBarBg}>
                        <Animated.View style={[styles.progressBarFill, progressStyle]} />
                    </View>

                    <View style={styles.metadata}>
                        <ThemedText type="code" style={styles.metaText}>SECURE_LINK // ACTIVE</ThemedText>
                        <ThemedText type="code" style={styles.metaText}>MATCH: 100%</ThemedText>
                    </View>
                </View>
            </Animated.View>

            {/* Decorative corners */}
            <View style={styles.cornerMarkers}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 10000,
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    tacticalOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 50,
    },
    textContainer: {
        width: '80%',
        maxWidth: 400,
        alignItems: 'center',
        gap: 15,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    pulseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF6B6B',
    },
    loadingLabel: {
        fontSize: 10,
        color: '#FFF',
        opacity: 0.6,
        letterSpacing: 2,
    },
    statusTitle: {
        fontSize: 20,
        color: '#FFF',
        letterSpacing: 5,
        textAlign: 'center',
    },
    progressBarBg: {
        width: '100%',
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 10,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFF',
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    metadata: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
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
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    cornerTL: { top: 60, left: 40, borderTopWidth: 2, borderLeftWidth: 2 },
    cornerTR: { top: 60, right: 40, borderTopWidth: 2, borderRightWidth: 2 },
    cornerBL: { bottom: 60, left: 40, borderBottomWidth: 2, borderLeftWidth: 2 },
    cornerBR: { bottom: 60, right: 40, borderBottomWidth: 2, borderRightWidth: 2 },
});
