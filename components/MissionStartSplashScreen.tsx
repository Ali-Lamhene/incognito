import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../hooks/useTranslation';

import { Theme } from '@/constants/Theme';

const { width, height } = Dimensions.get('window');

// Configurable splash screen duration
const SPLASH_DURATION = 2000; // 2000 ms = 2 seconds

interface MissionStartSplashScreenProps {
    onComplete: () => void;
}

export function MissionStartSplashScreen({ onComplete }: MissionStartSplashScreenProps) {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const [percent, setPercent] = useState(0);

    // Reanimated values
    const containerOpacity = useSharedValue(1);
    const progress = useSharedValue(0);

    useEffect(() => {
        // Play mission start sound


        // Animate progress bar fill
        progress.value = withTiming(1, { duration: SPLASH_DURATION, easing: Easing.linear });

        // Increment percentage label smoothly in sync with duration
        const stepTime = SPLASH_DURATION / 100;
        const interval = setInterval(() => {
            setPercent((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, stepTime);

        // Fade out and complete
        const timer = setTimeout(() => {
            containerOpacity.value = withTiming(0, { duration: 1000 }, () => {
                if (onComplete) {
                    runOnJS(onComplete)();
                }
            });
        }, SPLASH_DURATION);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [onComplete]);

    const animatedContainerStyle = useAnimatedStyle(() => ({
        opacity: containerOpacity.value,
    }));

    const progressStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`,
    }));

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]} pointerEvents="none">
            {/* Background Image */}
            <Image
                source={require('../assets/UI/splash_screen_bg.png')}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                priority="high"
            />

            {/* Bottom Content Group (Logo, Loader & Percentages) */}
            <View style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, 40) + 10 }]}>
                {/* Full-width INCOGNITO logo positioned at the level of the characters' legs */}
                <Image
                    source={require('../assets/UI/incognito_logo.png')}
                    style={styles.logoText}
                    contentFit="contain"
                />

                {/* Mission Status Label */}
                <Text style={styles.missionLabel}>
                    {t('splash.mission_start') || 'DÉMARRAGE DE LA MISSION'}
                </Text>

                {/* Gold-accented Progress Bar */}
                <View style={styles.progressBarBg}>
                    <Animated.View style={[styles.progressBarFill, progressStyle]} />
                </View>

                {/* Loading Percentage */}
                <Text style={styles.percentageText}>{percent}%</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 10000,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%'
    },
    bottomSection: {
        width: '100%',
        alignItems: 'center',
        gap: 12,
    },
    logoText: {
        width: '85%',
        maxWidth: 380,
        aspectRatio: 860 / 264,
        marginBottom: 1,
    },
    missionLabel: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 12,
        color: '#FFFFFF',
        letterSpacing: 2,
        opacity: 0.8,
        textTransform: 'uppercase',
    },
    progressBarBg: {
        width: '70%',
        height: 9,
        borderColor: 'rgba(197, 155, 78, 0.4)',
        borderWidth: 1.2,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 1.5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Theme.colors.red,
        borderRadius: 2.5,
    },
    percentageText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 20,
        color: Theme.colors.red,
        letterSpacing: 1.5,
    },
});
