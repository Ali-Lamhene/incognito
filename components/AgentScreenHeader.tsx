import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';

interface AgentScreenHeaderProps {
    title: string;
    backLabel?: string;
    onBack?: () => void;
}

export function AgentScreenHeader({
    title,
    backLabel,
    onBack
}: AgentScreenHeaderProps) {
    const router = useRouter();
    const { t } = useTranslation();

    const handleBack = onBack || (() => router.back());
    const displayBackLabel = backLabel || t('common.return');

    return (
        <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <ThemedText type="code" style={styles.backText}>
                    {'<< ' + displayBackLabel}
                </ThemedText>
            </TouchableOpacity>
            <ThemedText type="subtitle" style={styles.screenTitle}>
                {title}
            </ThemedText>
            <View style={styles.headerLine} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    backButton: {
        marginBottom: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
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
    headerLine: {
        height: 1,
        backgroundColor: '#FFF',
        opacity: 0.3,
        marginTop: 10,
        width: '40%',
    },
});
