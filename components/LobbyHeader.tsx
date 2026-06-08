import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';

interface LobbyHeaderProps {
    isHost: boolean;
    onBack: () => void;
    onAbort: () => void;
}

const AnimatedWaitingText = ({ text }: { text: string }) => {
    const step = useSharedValue(0);

    useEffect(() => {
        step.value = withRepeat(
            withTiming(4, { duration: 2000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const d1Style = useAnimatedStyle(() => ({
        opacity: step.value >= 1 ? 1 : 0
    }));
    const d2Style = useAnimatedStyle(() => ({
        opacity: step.value >= 2 ? 1 : 0
    }));
    const d3Style = useAnimatedStyle(() => ({
        opacity: step.value >= 3 ? 1 : 0
    }));

    const baseText = text.replace(/\.+$/, '');

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedText type="code" style={styles.subTitle}>{baseText}</ThemedText>
            <Animated.View style={d1Style}><ThemedText type="code" style={styles.subTitle}>.</ThemedText></Animated.View>
            <Animated.View style={d2Style}><ThemedText type="code" style={styles.subTitle}>.</ThemedText></Animated.View>
            <Animated.View style={d3Style}><ThemedText type="code" style={styles.subTitle}>.</ThemedText></Animated.View>
        </View>
    );
};

export function LobbyHeader({
    isHost,
    onBack,
    onAbort
}: LobbyHeaderProps) {
    const { t } = useTranslation();

    return (
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <View style={styles.headerTop}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ThemedText type="code" style={styles.backText}>{'<< ' + t('common.return')}</ThemedText>
                </TouchableOpacity>

                {isHost && (
                    <TouchableOpacity onPress={onAbort} style={styles.destroyButton}>
                        <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                    </TouchableOpacity>
                )}
            </View>
            <View style={{ marginTop: 10 }}>
                <ThemedText type="subtitle" style={styles.screenTitle}>{t('lobby.title')}</ThemedText>
                {isHost ? (
                    <AnimatedWaitingText text={t('lobby.waiting')} />
                ) : (
                    <ThemedText type="code" style={styles.subTitle}>{t('lobby.linked_msg')}</ThemedText>
                )}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    header: {
        gap: 15,
        marginBottom: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        paddingVertical: 5,
    },
    backText: {
        fontSize: 10,
        opacity: 0.6,
        letterSpacing: 2,
    },
    screenTitle: {
        color: '#FFF',
        fontSize: 24,
        letterSpacing: 4,
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 10,
        opacity: 0.5,
    },
    destroyButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.2)',
    },
});
