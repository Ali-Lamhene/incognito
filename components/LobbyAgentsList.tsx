import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Agent } from '../context/SessionContext';
import { Theme } from '../constants/Theme';

interface LobbyAgentsListProps {
    agents: Agent[];
}

const SearchingSlot = () => {
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
        <Animated.View style={[styles.agentSlot, animatedStyle]}>
            <View style={styles.agentInfo}>
                <View style={styles.emptyAvatar} />
                <Text style={styles.emptyText}>En attente...</Text>
            </View>
            <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: '#555' }]} />
                <Text style={styles.statusTextWaiting}>EN ATTENTE</Text>
            </View>
        </Animated.View>
    );
};

export function LobbyAgentsList({ agents }: LobbyAgentsListProps) {
    const maxAgents = 8;
    const hasEmptySlot = agents.length < maxAgents;

    // 15 muted tactical colors
    const avatarColors = [
        '#6B2D2D', // Muted dark red
        '#2D4A6B', // Muted slate blue
        '#3B5B3B', // Muted olive green
        '#6B522D', // Muted bronze/brown
        '#4A2D6B', // Muted purple
        '#2D6B5B', // Muted teal
        '#6B402D', // Muted rust
        '#454552', // Slate grey
        '#54384A', // Muted plum
        '#3D4A3D', // Forest drab
        '#5A4D3D', // Khaki
        '#2C3E50', // Midnight blue
        '#4E342E', // Chocolate brown
        '#37474F', // Blue grey
        '#424242', // Dark grey
    ];

    return (
        <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.agentsSection}>
            <View style={styles.sectionHeader}>
                <Ionicons name="people" size={16} color="#D1D1D1" />
                <Text style={styles.sectionLabel}>
                    AGENTS CONNECTÉS ({agents.length})
                </Text>
            </View>
            
            <View style={styles.agentsList}>
                {agents.map((agent, index) => {
                    const isHost = index === 0; // Assuming first agent is host
                    const isReady = agent.status === 'READY' || isHost; // Usually host is always ready
                    const avatarBg = avatarColors[index % avatarColors.length];
                    
                    return (
                        <View key={agent.id} style={styles.agentSlot}>
                            <View style={styles.agentInfo}>
                                <View style={[styles.avatar, { borderColor: isHost ? Theme.colors.red : '#444', backgroundColor: avatarBg }]}>
                                    <FontAwesome5 name="user-secret" size={16} color="#FFF" />
                                </View>
                                <Text style={styles.agentName}>{agent.name || agent.codename}</Text>
                                {isHost && (
                                    <View style={styles.hostBadge}>
                                        <Text style={styles.hostBadgeText}>HÔTE</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.statusContainer}>
                                <View style={[styles.statusDot, { backgroundColor: isReady ? '#4CAF50' : '#555' }]} />
                                <Text style={[styles.statusTextReady, { color: isReady ? '#4CAF50' : '#555' }]}>
                                    {isReady ? 'PRÊT' : 'EN ATTENTE'}
                                </Text>
                            </View>
                        </View>
                    );
                })}
                
                {/* Single placeholder if space available */}
                {hasEmptySlot && (
                    <SearchingSlot />
                )}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    agentsSection: {
        gap: 15,
        marginTop: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 5,
    },
    sectionLabel: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 18,
        color: '#D1D1D1',
        letterSpacing: 1,
    },
    agentsList: {
        backgroundColor: 'rgba(20, 5, 5, 0.4)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 8,
        overflow: 'hidden',
    },
    agentSlot: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    agentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    emptyAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#333',
        borderStyle: 'dashed',
    },
    agentName: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 13,
        color: '#FFF',
        letterSpacing: 1,
    },
    hostBadge: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Theme.colors.red,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    hostBadgeText: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 10,
        color: Theme.colors.red,
    },
    emptyText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#555',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusTextReady: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 14,
        letterSpacing: 1,
    },
    statusTextWaiting: {
        fontFamily: 'BebasNeue-Bold',
        fontSize: 14,
        color: '#555',
        letterSpacing: 1,
    },
});
