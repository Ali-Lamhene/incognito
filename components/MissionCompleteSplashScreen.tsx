import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../hooks/useTranslation';
import SoundService from '../services/SoundService';
import { Theme } from '../constants/Theme';

const { width, height } = Dimensions.get('window');

// Mission end splash screen duration (5 seconds)
const COMPLETE_DURATION = 5000; 

interface MissionCompleteSplashScreenProps {
    onComplete: () => void;
}

export function MissionCompleteSplashScreen({ onComplete }: MissionCompleteSplashScreenProps) {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const [countdown, setCountdown] = useState(5);

    // Reanimated Shared Values
    const bgScale = useSharedValue(1.0);
    const textPulse = useSharedValue(1.0);
    const contentOpacity = useSharedValue(0);
    const containerOpacity = useSharedValue(1);

    useEffect(() => {
        // Play success/game-over sound
        SoundService.playSFX('SUCCESS');

        // Slowly zoom background image over duration
        bgScale.value = withTiming(1.08, { duration: COMPLETE_DURATION, easing: Easing.out(Easing.quad) });

        // Pulse the "TEMPS ÉCOULÉ" title text
        textPulse.value = withRepeat(
            withSequence(
                withTiming(1.03, { duration: 400, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        // Fade in text contents
        contentOpacity.value = withTiming(1, { duration: 500 });

        // Increment countdown every second
        const countInterval = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // Exit transition to results screen after 3 seconds
        const timer = setTimeout(() => {
            containerOpacity.value = withTiming(0, { duration: 500 }, () => {
                if (onComplete) {
                    runOnJS(onComplete)();
                }
            });
        }, COMPLETE_DURATION);

        return () => {
            clearInterval(countInterval);
            clearTimeout(timer);
        };
    }, [onComplete]);

    // Animated Styles
    const bgStyle = useAnimatedStyle(() => ({
        transform: [{ scale: bgScale.value }]
    }));

    const timeUpStyle = useAnimatedStyle(() => ({
        transform: [{ scale: textPulse.value }]
    }));

    const contentStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value
    }));

    const containerStyle = useAnimatedStyle(() => ({
        opacity: containerOpacity.value
    }));

    // Dynamic countdown redirection string
    const redirectText = (t('splash.redirecting_in') || 'Redirection dans {{seconds}}s...')
        .replace('{{seconds}}', countdown.toString());

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            {/* Background Image */}
            <Animated.View style={[StyleSheet.absoluteFill, bgStyle]}>
                <Image
                    source={require('../assets/UI/end_game_bg.png')}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    priority="high"
                />
            </Animated.View>

            {/* Empty view for top spacing */}
            <View />

            {/* Bottom Content Area */}
            <Animated.View style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, 40) }, contentStyle]}>
                {/* TEMPS ÉCOULÉ (with pulse effect) */}
                <Animated.Text style={[styles.timeUpTitle, timeUpStyle]}>
                    {t('splash.time_up') || 'TEMPS ÉCOULÉ'}
                </Animated.Text>

                {/* Summon Notice */}
                <Text style={styles.summonsText}>
                    {t('splash.all_agents_summoned_court') || 'TOUS LES AGENTS SONT CONVOQUÉS AU TRIBUNAL DES ESPIONS'}
                </Text>

                {/* Countdown display */}
                <Text style={styles.countdownText}>
                    {redirectText}
                </Text>

                {/* Fingerprint Icon */}
                <MaterialCommunityIcons 
                    name="fingerprint" 
                    size={26} 
                    color={Theme.colors.red} 
                    style={styles.fingerprint} 
                />
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 20000,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomSection: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    timeUpTitle: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 54,
        color: Theme.colors.red,
        letterSpacing: 3,
        textAlign: 'center',
    },
    summonsText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 12.5,
        color: '#F2E8CF',
        letterSpacing: 1.5,
        textAlign: 'center',
        lineHeight: 18,
        marginTop: 6,
        textTransform: 'uppercase',
    },
    countdownText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 11,
        color: 'rgba(242, 232, 207, 0.5)',
        letterSpacing: 1.2,
        textAlign: 'center',
        marginTop: 10,
    },
    fingerprint: {
        marginTop: 18,
        opacity: 0.85,
    },
});
