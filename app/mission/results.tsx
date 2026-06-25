import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInLeft, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { ThemedText } from "../../components/ThemedText";
import { useSession } from "../../context/SessionContext";
import { useTranslation } from "../../hooks/useTranslation";
import { useProfileStore } from "../../store/profileStore";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { getAgentColor } from "../../utils/agentColors";
import { db } from "../../services/firebase";
import { ref, update, get } from "firebase/database";
import { Theme } from "@/constants/Theme";

export default function ResultsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { agents, session, clearSession, status } = useSession();
    const { profile } = useProfileStore();
    const { t } = useTranslation();

    const [frozenAgents] = React.useState([...agents]);
    const sortedAgentsRaw = [...frozenAgents].sort((a, b) => (b.score || 0) - (a.score || 0));
    
    // Fill in mock placeholders if there are fewer than 3 players to preview the full podium
    const sortedAgents = [...sortedAgentsRaw];
    if (sortedAgents.length < 2) {
        sortedAgents.push({
            id: 'mock_2',
            name: 'AGENT SHADOW',
            avatar: 'spy_2',
            score: Math.max(0, (sortedAgents[0]?.score || 10) - 4),
            status: 'READY',
            lastSeen: Date.now(),
        });
    }
    if (sortedAgents.length < 3) {
        sortedAgents.push({
            id: 'mock_3',
            name: 'AGENT GHOST',
            avatar: 'spy_3',
            score: Math.max(0, (sortedAgents[1]?.score || 6) - 3),
            status: 'READY',
            lastSeen: Date.now(),
        });
    }
    const isHost = session?.role === 'HOST';
    const [showExitModal, setShowExitModal] = React.useState(false);

    // Redirect to lobby if status changes to LOBBY (host started a new game)
    React.useEffect(() => {
        if (session?.code && status === 'LOBBY') {
            router.replace(`/lobby/${session.code}`);
        }
    }, [status, session?.code]);

    const handleBackHome = async () => {
        await clearSession(profile?.id);
        router.replace("/");
    };

    const handleNewGame = async () => {
        if (!session?.code || !isHost) return;
        
        try {
            const snapshot = await get(ref(db, `missions/${session.code}/agents`));
            const currentAgents = snapshot.val();
            
            const updates: any = {};
            updates[`missions/${session.code}/status`] = 'LOBBY';
            updates[`missions/${session.code}/startedAt`] = null;
            updates[`missions/${session.code}/events`] = null; // reset event list
            
            if (currentAgents) {
                Object.keys(currentAgents).forEach(agentId => {
                    updates[`missions/${session.code}/agents/${agentId}/completed`] = null;
                    updates[`missions/${session.code}/agents/${agentId}/completedAt`] = null;
                    updates[`missions/${session.code}/agents/${agentId}/challenge`] = null;
                    updates[`missions/${session.code}/agents/${agentId}/score`] = 0;
                    updates[`missions/${session.code}/agents/${agentId}/status`] = 'READY';
                });
            }
            
            await update(ref(db), updates);
        } catch (error) {
            console.error("Failed to restart game:", error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Background Image */}
            <View style={styles.backgroundContainer}>
                <Image
                    source={require("../../assets/UI/result_bg.png")}
                    style={styles.backgroundImage}
                    contentFit="cover"
                />
            </View>

            <ConfirmationModal
                visible={showExitModal}
                title={t('lobby.leave_title')}
                message={t('mission.abort_msg')}
                onConfirm={handleBackHome}
                onCancel={() => setShowExitModal(false)}
            />

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: 20 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
                    <View style={styles.crestContainer}>
                        <LinearGradient
                            colors={['transparent', 'rgba(242, 232, 207, 0.25)']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.separatorLine}
                        />
                        <Image
                            source={require("../../assets/UI/logo_agency.png")}
                            style={styles.logoCrest}
                            contentFit="contain"
                        />
                        <LinearGradient
                            colors={['rgba(242, 232, 207, 0.25)', 'transparent']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.separatorLine}
                        />
                    </View>
                    <ThemedText style={styles.screenTitle}>
                        {t('results.mission_accomplished')}
                    </ThemedText>
                </Animated.View>

                {/* Podium Section */}
                {sortedAgents.length > 0 && (
                    <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.podiumCard}>
                        {/* "VAINQUEURS" separator — same pattern as PageHeader */}
                        <View style={styles.winnersSeparator}>
                            <LinearGradient
                                colors={['transparent', 'rgba(198, 161, 92, 0.35)']}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.winnersSeparatorLine}
                            />
                            <ThemedText style={styles.winnersSeparatorLabel}>{t('results.winners')}</ThemedText>
                            <LinearGradient
                                colors={['rgba(198, 161, 92, 0.35)', 'transparent']}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.winnersSeparatorLine}
                            />
                        </View>

                        <View style={styles.podiumColumns}>
                            {/* 2nd Place */}
                            {sortedAgents[1] ? (
                                <View style={styles.podiumCol}>
                                    <View style={[styles.podiumAvatar, { borderColor: getAgentColor(sortedAgents[1].id, sortedAgents), backgroundColor: getAgentColor(sortedAgents[1].id, sortedAgents) }]}>
                                        <FontAwesome5 name="user-secret" size={42} color="#000" style={{ transform: [{ translateY: 10 }] }} />
                                    </View>
                                    <ThemedText numberOfLines={1} style={styles.podiumName}>{sortedAgents[1].name}</ThemedText>
                                    <ThemedText style={[styles.podiumScore, { color: getAgentColor(sortedAgents[1].id, sortedAgents) }]}>{sortedAgents[1].score || 0} pts</ThemedText>
                                    <View style={styles.podiumRank}>
                                        <ThemedText style={styles.podiumRankText}>2</ThemedText>
                                    </View>
                                </View>
                            ) : <View style={styles.podiumCol} />}

                            {/* 1st Place */}
                            {sortedAgents[0] && (
                                <View style={[styles.podiumCol, styles.podiumColFirst]}>
                                    <FontAwesome5 name="crown" size={14} color="#C6A15C" style={{ marginBottom: 2 }} />
                                    <View style={[styles.podiumAvatarFirst, { borderColor: getAgentColor(sortedAgents[0].id, sortedAgents), backgroundColor: getAgentColor(sortedAgents[0].id, sortedAgents) }]}>
                                        <FontAwesome5 name="user-secret" size={54} color="#000" style={{ transform: [{ translateY: 12 }] }} />
                                    </View>
                                    <ThemedText numberOfLines={1} style={[styles.podiumName, { color: '#C6A15C' }]}>{sortedAgents[0].name}</ThemedText>
                                    <ThemedText style={[styles.podiumScore, { color: '#C6A15C', fontSize: 18 }]}>{sortedAgents[0].score || 0} pts</ThemedText>
                                    <View style={[styles.podiumRank, styles.podiumRankFirst]}>
                                        <ThemedText style={[styles.podiumRankText, { color: '#000' }]}>1</ThemedText>
                                    </View>
                                </View>
                            )}

                            {/* 3rd Place */}
                            {sortedAgents[2] ? (
                                <View style={styles.podiumCol}>
                                    <View style={[styles.podiumAvatar, { borderColor: getAgentColor(sortedAgents[2].id, sortedAgents), backgroundColor: getAgentColor(sortedAgents[2].id, sortedAgents) }]}>
                                        <FontAwesome5 name="user-secret" size={42} color="#000" style={{ transform: [{ translateY: 10 }] }} />
                                    </View>
                                    <ThemedText numberOfLines={1} style={styles.podiumName}>{sortedAgents[2].name}</ThemedText>
                                    <ThemedText style={[styles.podiumScore, { color: getAgentColor(sortedAgents[2].id, sortedAgents) }]}>{sortedAgents[2].score || 0} pts</ThemedText>
                                    <View style={styles.podiumRank}>
                                        <ThemedText style={styles.podiumRankText}>3</ThemedText>
                                    </View>
                                </View>
                            ) : <View style={styles.podiumCol} />}
                        </View>
                    </Animated.View>
                )}

                {/* Classement List */}
                <Animated.View entering={FadeInUp.delay(500).duration(600)} style={styles.listSection}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="trophy-outline" size={14} color="#999" />
                        <ThemedText style={[styles.sectionHeaderLabel, { color: '#999', fontSize: 10 }]}>
                            {t('results.rank_pts').toUpperCase()}
                        </ThemedText>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
                    </View>

                    <View style={styles.agentsList}>
                        {sortedAgents.map((agent, index) => {
                            const agentColor = getAgentColor(agent.id, sortedAgents);
                            const isMe = agent.id === profile?.id;
                            const isCleared = (agent.score || 0) > 0;
                            
                            return (
                                <Animated.View
                                    key={agent.id}
                                    entering={FadeInLeft.delay(600 + index * 50)}
                                    style={[
                                        styles.agentSlot,
                                        isMe && { borderLeftWidth: 2, borderLeftColor: agentColor },
                                    ]}
                                >
                                    {/* Rank number */}
                                    <ThemedText style={[styles.slotRank, { color: index === 0 ? '#C6A15C' : agentColor }]}>
                                        {String(index + 1).padStart(2, '0')}
                                    </ThemedText>

                                    {/* Avatar */}
                                    <View style={[styles.slotAvatar, { borderColor: agentColor, backgroundColor: agentColor }]}>
                                        <FontAwesome5 name="user-secret" size={22} color="#000" style={{ transform: [{ translateY: 5 }] }} />
                                    </View>

                                    {/* Name */}
                                    <ThemedText style={[styles.slotName, { flex: 1 }]}>
                                        {isMe ? `${agent.name} (${t('results.you').toUpperCase()})` : agent.name}
                                    </ThemedText>

                                    {/* Score */}
                                    <ThemedText style={[styles.slotScore, { color: agentColor }]}>
                                        {agent.score || 0}
                                    </ThemedText>
                                </Animated.View>
                            );
                        })}
                    </View>
                </Animated.View>

            </ScrollView>

            {/* Footer Action Buttons — pinned to bottom */}
            <Animated.View entering={FadeInUp.delay(800).duration(600)} style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
                <Button
                    title={isHost ? t('results.new_game') : (t('lobby.waiting_host') || "ATTENTE DE L'HÔTE...")}
                    onPress={handleNewGame}
                    style={styles.actionButton}
                    icon="refresh-outline"
                    variant="primary"
                    disabled={!isHost}
                />
                <Button
                    title={t('results.leave_lobby')}
                    onPress={() => setShowExitModal(true)}
                    style={styles.actionButton}
                    icon="exit-outline"
                    variant="secondary"
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    content: {
        paddingHorizontal: 25,
        gap: 20,
    },
    
    // ── Header ──
    header: {
        alignItems: 'center',
        width: '100%',
    },
    crestContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 60,
        marginBottom: 8,
    },
    logoCrest: {
        width: 60,
        height: 60,
        marginHorizontal: 2,
    },
    separatorLine: {
        flex: 1,
        height: 1,
    },
    screenTitle: {
        fontSize: 42,
        fontFamily: Theme.fonts.title,
        color: Theme.colors.red,
        textAlign: 'center',
        letterSpacing: 2,
        lineHeight: 36,
        paddingTop: 6,
    },
    
    // ── Section Header (reused) ──
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionHeaderLine: {
        flex: 1,
        height: 1,
    },
    sectionHeaderLabel: {
        fontFamily: Theme.fonts.subtitle,
        fontSize: 9,
        color: '#C6A15C',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },

    // ── Podium ──
    podiumCard: {
        backgroundColor: 'rgba(20, 5, 5, 0.4)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        paddingVertical: 14,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    winnersSeparator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 14,
    },
    winnersSeparatorLine: {
        flex: 1,
        height: 1,
    },
    winnersSeparatorLabel: {
        fontFamily: Theme.fonts.subtitle,
        fontSize: 9,
        color: '#C6A15C',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginHorizontal: 12,
    },
    podiumColumns: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 10,
    },
    podiumCol: {
        width: 90,
        alignItems: 'center',
        gap: 3,
    },
    podiumColFirst: {
        width: 105,
        marginBottom: 6,
    },
    podiumAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    podiumAvatarFirst: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    podiumName: {
        fontFamily: Theme.fonts.title,
        fontSize: 12,
        color: '#FFF',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    podiumScore: {
        fontFamily: Theme.fonts.title,
        fontSize: 15,
        letterSpacing: 0.5,
    },
    podiumRank: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    podiumRankFirst: {
        backgroundColor: '#C6A15C',
        width: 22,
        height: 22,
        borderRadius: 11,
    },
    podiumRankText: {
        fontFamily: Theme.fonts.title,
        fontSize: 10,
        color: '#FFF',
    },

    // ── Classement List ──
    listSection: {
        // gap handled by sectionHeader marginBottom
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
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
        gap: 10,
    },
    slotRank: {
        fontFamily: Theme.fonts.title,
        fontSize: 14,
        width: 20,
        textAlign: 'center',
    },
    slotAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    slotName: {
        fontFamily: Theme.fonts.title,
        fontSize: 13,
        color: '#FFF',
        letterSpacing: 0.5,
    },
    slotScore: {
        fontFamily: Theme.fonts.title,
        fontSize: 16,
        textAlign: 'right',
        minWidth: 30,
    },

    // ── Footer ──
    footer: {
        gap: 3,
        paddingHorizontal: 25,
        paddingTop: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    actionButton: {
        height: 48,
    },
});
