import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { useTranslation } from '../hooks/useTranslation';
import { Agent } from '../context/SessionContext';

interface LobbyAgentsListProps {
    agents: Agent[];
}

const SearchingSlot = () => {
    const { t } = useTranslation();
    const pulse = useSharedValue(0.4);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 1500 }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: pulse.value
    }));

    return (
        <View style={styles.emptySlot}>
            <Animated.View style={animatedStyle}>
                <ThemedText type="code" style={styles.emptyText}>{t('lobby.waiting')}</ThemedText>
            </Animated.View>
        </View>
    );
};

export function LobbyAgentsList({ agents }: LobbyAgentsListProps) {
    const { t } = useTranslation();

    return (
        <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.agentsSection}>
            <ThemedText type="code" style={styles.sectionLabel}>
                {t('lobby.agents_connected')} [{agents.length}]
            </ThemedText>
            <View style={styles.agentsGrid}>
                {agents.map((agent) => (
                    <View key={agent.id} style={styles.agentBadge}>
                        <View style={[styles.statusDot, { backgroundColor: agent.status === 'READY' ? '#FFF' : '#333' }]} />
                        <ThemedText type="code" style={styles.agentName}>{agent.name}</ThemedText>
                    </View>
                ))}
                {/* Placeholder for empty slots */}
                {[...Array(1)].map((_, i) => (
                    <SearchingSlot key={`empty-${i}`} />
                ))}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    agentsSection: {
        gap: 10,
    },
    sectionLabel: {
        fontSize: 10,
        opacity: 0.5,
        marginBottom: 5,
    },
    agentsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    agentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderLeftWidth: 2,
        borderLeftColor: '#FFF',
        minWidth: '45%',
    },
    emptySlot: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderStyle: 'dashed',
        minWidth: '45%',
        alignItems: 'center',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    agentName: {
        color: '#FFF',
        fontSize: 12,
        letterSpacing: 0.5,
    },
    emptyText: {
        color: '#FFF',
        fontSize: 10,
    },
});
