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

import { Switch, ActivityIndicator, TouchableOpacity } from "react-native";

export default function ResultsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { agents, session, clearSession, status } = useSession();
    const { profile } = useProfileStore();
    const { t } = useTranslation();

    const [validationState, setValidationState] = React.useState<Record<string, {
        challenges: Record<string, { completed: boolean, unmasked: boolean, lied: boolean, failed: boolean }>
    }>>({});

    const [currentAgentIndex, setCurrentAgentIndex] = React.useState(0);

    React.useEffect(() => {
        setValidationState(prev => {
            const next = { ...prev };
            let changed = false;
            agents.forEach(agent => {
                if (!next[agent.id]) {
                    const challenges = agent.challenges || (agent.challenge ? [agent.challenge] : []);
                    const challengesDict: Record<string, { completed: boolean, unmasked: boolean, lied: boolean, failed: boolean }> = {};
                    challenges.forEach(c => {
                        challengesDict[c.id] = {
                            completed: c.completed || false,
                            unmasked: c.unmasked || false,
                            lied: c.lied || false,
                            failed: false,
                        };
                    });
                    next[agent.id] = {
                        challenges: challengesDict
                    };
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, [agents]);

    const sortedAgentsRaw = [...agents].sort((a, b) => (b.score || 0) - (a.score || 0));
    
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
            updates[`missions/${session.code}/scoresValidated`] = null; // reset scores validated flag
            
            if (currentAgents) {
                Object.keys(currentAgents).forEach(agentId => {
                    updates[`missions/${session.code}/agents/${agentId}/completed`] = null;
                    updates[`missions/${session.code}/agents/${agentId}/completedAt`] = null;
                    updates[`missions/${session.code}/agents/${agentId}/challenge`] = null;
                    updates[`missions/${session.code}/agents/${agentId}/score`] = 0;
                    updates[`missions/${session.code}/agents/${agentId}/status`] = 'READY';
                    updates[`missions/${session.code}/agents/${agentId}/unmaskedStatus`] = null;
                    updates[`missions/${session.code}/agents/${agentId}/pendingAccusation`] = null;
                });
            }
            
            await update(ref(db), updates);
        } catch (error) {
            console.error("Failed to restart game:", error);
        }
    };

    const isCurrentAgentValidated = () => {
        const agent = agents[currentAgentIndex];
        if (!agent) return false;
        const state = validationState[agent.id];
        if (!state) return false;
        const challenges = agent.challenges || (agent.challenge ? [agent.challenge] : []);
        return challenges.every(c => {
            const cState = state.challenges[c.id];
            return cState && (cState.completed || cState.unmasked || cState.lied || cState.failed);
        });
    };

    const handleValidateScores = async () => {
        if (!session?.code) return;
        
        try {
            const updates: any = {};
            agents.forEach(agent => {
                const state = validationState[agent.id];
                if (!state) return;

                const challenges = agent.challenges || (agent.challenge ? [agent.challenge] : []);
                
                let score = 0;
                challenges.forEach(c => {
                    const cState = state.challenges[c.id];
                    if (cState) {
                        if (cState.lied) {
                            score -= 30;
                        } else if (cState.unmasked) {
                            score -= 10;
                        } else if (cState.completed) {
                            score += 10;
                        }
                    }
                });

                updates[`missions/${session.code}/agents/${agent.id}/score`] = score;
                
                const anyCompleted = challenges.some(c => {
                    const cState = state.challenges[c.id];
                    return cState?.completed && !cState?.unmasked && !cState?.lied;
                });
                updates[`missions/${session.code}/agents/${agent.id}/completed`] = anyCompleted;
                
                challenges.forEach((c, idx) => {
                    const cState = state.challenges[c.id];
                    updates[`missions/${session.code}/agents/${agent.id}/challenges/${idx}/completed`] = cState?.completed || false;
                    updates[`missions/${session.code}/agents/${agent.id}/challenges/${idx}/unmasked`] = cState?.unmasked || false;
                    updates[`missions/${session.code}/agents/${agent.id}/challenges/${idx}/lied`] = cState?.lied || false;
                });
                
                if (agent.challenge) {
                    const cState = state.challenges[agent.challenge.id];
                    updates[`missions/${session.code}/agents/${agent.id}/challenge/completed`] = cState?.completed || false;
                    updates[`missions/${session.code}/agents/${agent.id}/challenge/unmasked`] = cState?.unmasked || false;
                    updates[`missions/${session.code}/agents/${agent.id}/challenge/lied`] = cState?.lied || false;
                }
            });

            updates[`missions/${session.code}/scoresValidated`] = true;
            await update(ref(db), updates);
        } catch (error) {
            console.error("Failed to validate scores:", error);
        }
    };

    const renderHostTribunal = () => {
        const agent = agents[currentAgentIndex];
        if (!agent) {
            return (
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={Theme.colors.red} />
                </View>
            );
        }

        const agentColor = getAgentColor(agent.id, agents);
        const challenges = agent.challenges || (agent.challenge ? [agent.challenge] : []);
        const state = validationState[agent.id];

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

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
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
                            {t('results.court_title')}
                        </ThemedText>
                        <ThemedText style={styles.courtSubtitle}>
                            {t('results.court_subtitle')}
                        </ThemedText>
                    </Animated.View>

                    {/* Agent dossier validation */}
                    {state && (
                        <Animated.View
                            key={agent.id}
                            entering={FadeInLeft.duration(400)}
                            style={styles.courtCard}
                        >
                            {/* Dossier Meta */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', paddingBottom: 10, marginBottom: 5 }}>
                                <ThemedText style={{ fontFamily: Theme.fonts.subtitle, fontSize: 11, color: '#C6A15C', letterSpacing: 1 }}>
                                    {t('results.court_dossier').replace('{{current}}', String(currentAgentIndex + 1)).replace('{{total}}', String(agents.length))}
                                </ThemedText>
                            </View>

                            {/* Card Header */}
                            <View style={styles.courtCardHeader}>
                                <View style={[styles.slotAvatar, { borderColor: agentColor, backgroundColor: agentColor, width: 48, height: 48, borderRadius: 24 }]}>
                                    <FontAwesome5 name="user-secret" size={38} color="#000" style={{ transform: [{ translateY: 7 }] }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <ThemedText style={styles.courtAgentName}>{agent.name}</ThemedText>
                                </View>
                                {agent.unmaskedStatus === 'CONFESSED' && (
                                    <View style={styles.confessedBadge}>
                                        <ThemedText style={styles.confessedBadgeText}>
                                            {t('results.court_confessed')}
                                        </ThemedText>
                                    </View>
                                )}
                            </View>

                            {/* Challenges list */}
                            <View style={[styles.challengesGroup, { marginTop: 5 }]}>
                                {challenges.map((c) => {
                                    const cState = state.challenges[c.id];
                                    const isCompleted = cState?.completed || false;
                                    const isUnmasked = cState?.unmasked || false;
                                    const isLied = cState?.lied || false;
                                    const isFailed = cState?.failed || false;

                                    return (
                                        <View key={c.id} style={styles.courtChallengeRow}>
                                            <ThemedText style={styles.courtChallengeText}>{c.text}</ThemedText>
                                            <View style={styles.courtChallengeButtons}>
                                                {/* Row 1: Réussi & Échoué */}
                                                <View style={styles.courtChallengeBtnRow}>
                                                    {/* Réussi Button */}
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        disabled={isUnmasked}
                                                        onPress={() => {
                                                            setValidationState(prev => {
                                                                const agentState = prev[agent.id];
                                                                const currentVal = agentState.challenges[c.id]?.completed || false;
                                                                return {
                                                                    ...prev,
                                                                    [agent.id]: {
                                                                        ...agentState,
                                                                        challenges: {
                                                                            ...agentState.challenges,
                                                                            [c.id]: {
                                                                                completed: !currentVal,
                                                                                unmasked: false,
                                                                                lied: false,
                                                                                failed: false,
                                                                            }
                                                                        }
                                                                    }
                                                                };
                                                            });
                                                        }}
                                                        style={[
                                                            styles.courtChallengeBtn,
                                                            styles.courtChallengeBtnHalf,
                                                            isCompleted && styles.courtChallengeBtnSuccess,
                                                            isUnmasked && styles.courtChallengeBtnDisabled
                                                        ]}
                                                    >
                                                        <Ionicons
                                                            name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
                                                            size={16}
                                                            color={isCompleted ? "#2ECC71" : "#666"}
                                                        />
                                                        <ThemedText style={[styles.courtChallengeBtnText, isCompleted && styles.courtChallengeBtnTextSuccess]}>
                                                            {t('results.court_succeeded')}
                                                        </ThemedText>
                                                    </TouchableOpacity>

                                                    {/* Échoué Button */}
                                                    <TouchableOpacity
                                                        activeOpacity={isUnmasked ? 1 : 0.8}
                                                        disabled={isUnmasked}
                                                        onPress={() => {
                                                            setValidationState(prev => {
                                                                const agentState = prev[agent.id];
                                                                const currentFailed = agentState.challenges[c.id]?.failed || false;
                                                                return {
                                                                    ...prev,
                                                                    [agent.id]: {
                                                                        ...agentState,
                                                                        challenges: {
                                                                            ...agentState.challenges,
                                                                            [c.id]: {
                                                                                completed: false,
                                                                                unmasked: false,
                                                                                lied: false,
                                                                                failed: !currentFailed,
                                                                            }
                                                                        }
                                                                    }
                                                                };
                                                            });
                                                        }}
                                                        style={[
                                                            styles.courtChallengeBtn,
                                                            styles.courtChallengeBtnHalf,
                                                            isFailed && styles.courtChallengeBtnFailed,
                                                            isUnmasked && styles.courtChallengeBtnDisabled
                                                        ]}
                                                    >
                                                        <Ionicons
                                                            name={isFailed ? "close-circle" : "close-circle-outline"}
                                                            size={16}
                                                            color={isFailed ? "#FFF" : "#666"}
                                                        />
                                                        <ThemedText style={[styles.courtChallengeBtnText, isFailed && styles.courtChallengeBtnTextFailed]}>
                                                            {t('results.court_failed')}
                                                        </ThemedText>
                                                    </TouchableOpacity>
                                                </View>

                                                {/* Row 2: Démasqué & Mensonge */}
                                                <View style={styles.courtChallengeBtnRow}>
                                                    {/* Démasqué Button */}
                                                    <TouchableOpacity
                                                        activeOpacity={c.unmasked ? 1 : 0.8}
                                                        disabled={!!c.unmasked}
                                                        onPress={() => {
                                                            setValidationState(prev => {
                                                                const agentState = prev[agent.id];
                                                                const currentUnmasked = agentState.challenges[c.id]?.unmasked || false;
                                                                return {
                                                                    ...prev,
                                                                    [agent.id]: {
                                                                        ...agentState,
                                                                        challenges: {
                                                                            ...agentState.challenges,
                                                                            [c.id]: {
                                                                                completed: false,
                                                                                unmasked: !currentUnmasked,
                                                                                lied: false,
                                                                                failed: false,
                                                                            }
                                                                        }
                                                                    }
                                                                };
                                                            });
                                                        }}
                                                        style={[
                                                            styles.courtChallengeBtn,
                                                            styles.courtChallengeBtnHalf,
                                                            isUnmasked && styles.courtChallengeBtnDanger,
                                                        ]}
                                                    >
                                                        <Ionicons
                                                            name={isUnmasked ? "eye-off" : "eye-outline"}
                                                            size={16}
                                                            color={isUnmasked ? Theme.colors.red : "#666"}
                                                        />
                                                        <ThemedText style={[styles.courtChallengeBtnText, isUnmasked && styles.courtChallengeBtnTextDanger]}>
                                                            {t('results.court_unmasked')}
                                                        </ThemedText>
                                                    </TouchableOpacity>

                                                    {/* Mensonge Button */}
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        disabled={!!c.unmasked}
                                                        onPress={() => {
                                                            setValidationState(prev => {
                                                                const agentState = prev[agent.id];
                                                                const currentLied = agentState.challenges[c.id]?.lied || false;
                                                                return {
                                                                    ...prev,
                                                                    [agent.id]: {
                                                                        ...agentState,
                                                                        challenges: {
                                                                            ...agentState.challenges,
                                                                            [c.id]: {
                                                                                completed: false,
                                                                                unmasked: false,
                                                                                lied: !currentLied,
                                                                                failed: false,
                                                                            }
                                                                        }
                                                                    }
                                                                };
                                                            });
                                                        }}
                                                        style={[
                                                            styles.courtChallengeBtn,
                                                            styles.courtChallengeBtnHalf,
                                                            isLied && styles.courtChallengeBtnWarning,
                                                            !!c.unmasked && styles.courtChallengeBtnDisabled
                                                        ]}
                                                    >
                                                        <Ionicons
                                                            name={isLied ? "alert-circle" : "alert-circle-outline"}
                                                            size={16}
                                                            color={isLied ? "#FFA500" : "#666"}
                                                        />
                                                        <ThemedText style={[styles.courtChallengeBtnText, isLied && styles.courtChallengeBtnTextWarning]}>
                                                            {t('results.court_lied')}
                                                        </ThemedText>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </Animated.View>
                    )}

                    {/* Navigation buttons */}
                    <View style={styles.courtNavigation}>
                        <Button
                            title={t('results.court_prev')}
                            onPress={() => setCurrentAgentIndex(prev => Math.max(0, prev - 1))}
                            variant="secondary"
                            disabled={currentAgentIndex === 0}
                            style={{ flex: 1, height: 48 }}
                        />
                        {currentAgentIndex < agents.length - 1 ? (
                            <Button
                                title={t('results.court_next')}
                                onPress={() => setCurrentAgentIndex(prev => prev + 1)}
                                variant="primary"
                                disabled={!isCurrentAgentValidated()}
                                style={{ flex: 1, height: 48 }}
                            />
                        ) : (
                            <Button
                                title={t('results.court_btn_validate')}
                                onPress={handleValidateScores}
                                variant="primary"
                                disabled={!isCurrentAgentValidated()}
                                style={{ flex: 1, height: 48 }}
                            />
                        )}
                    </View>
                </ScrollView>
            </View>
        );
    };

    const renderAgentWaiting = () => {
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

                <View style={styles.waitingContainer}>
                    <Animated.View entering={FadeInDown.duration(1000)} style={{ alignItems: 'center', gap: 20 }}>
                        <FontAwesome5 name="balance-scale" size={60} color={Theme.colors.red} />
                        <ThemedText style={styles.waitingTitle}>
                            {t('results.court_title')}
                        </ThemedText>
                        <ThemedText style={styles.waitingSubtitle}>
                            {t('results.court_waiting_agents')}
                        </ThemedText>
                        
                        <ActivityIndicator size="large" color={Theme.colors.red} style={{ marginTop: 20 }} />
                    </Animated.View>
                </View>
            </View>
        );
    };

    if (!session) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Theme.colors.red} />
            </View>
        );
    }

    const scoresValidated = session.scoresValidated;

    if (!scoresValidated) {
        if (isHost) {
            return renderHostTribunal();
        } else {
            return renderAgentWaiting();
        }
    }

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
            <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
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
            </View>
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
        width: '100%',
        alignSelf: 'stretch',
        gap: 10,
        paddingHorizontal: 25,
        paddingTop: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    actionButton: {
        height: 48,
    },
    courtSubtitle: {
        fontFamily: Theme.fonts.subtitle,
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginTop: 6,
        paddingHorizontal: 20,
    },
    courtList: {
        gap: 16,
        marginVertical: 10,
    },
    courtCard: {
        backgroundColor: 'rgba(20, 5, 5, 0.45)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        padding: 16,
        gap: 14,
    },
    courtCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    courtAgentName: {
        fontFamily: Theme.fonts.title,
        fontSize: 16,
        color: '#FFF',
        letterSpacing: 0.5,
    },
    confessedBadge: {
        backgroundColor: 'rgba(153, 0, 0, 0.2)',
        borderColor: Theme.colors.red,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    confessedBadgeText: {
        fontFamily: Theme.fonts.title,
        fontSize: 10,
        color: Theme.colors.red,
        letterSpacing: 0.5,
    },
    challengesGroup: {
        gap: 8,
    },
    courtChallengeRow: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 10,
        gap: 10,
    },
    courtChallengeText: {
        fontFamily: Theme.fonts.body,
        fontSize: 13,
        color: '#AAA',
        lineHeight: 18,
    },
    courtChallengeButtons: {
        flexDirection: 'column',
        gap: 8,
        marginTop: 4,
        alignItems: 'stretch',
    },
    courtChallengeBtnRow: {
        flexDirection: 'row',
        gap: 8,
        width: '100%',
    },
    courtChallengeBtnFull: {
        width: '100%',
        alignSelf: 'stretch',
        paddingVertical: 12,
    },
    courtChallengeBtnHalf: {
        flex: 1,
    },
    courtChallengeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        paddingVertical: 8,
        gap: 6,
    },
    courtChallengeBtnSuccess: {
        backgroundColor: 'rgba(46, 204, 113, 0.08)',
        borderColor: 'rgba(46, 204, 113, 0.3)',
    },
    courtChallengeBtnDanger: {
        backgroundColor: 'rgba(153, 0, 0, 0.08)',
        borderColor: 'rgba(153, 0, 0, 0.3)',
    },
    courtChallengeBtnWarning: {
        backgroundColor: 'rgba(255, 165, 0, 0.08)',
        borderColor: 'rgba(255, 165, 0, 0.3)',
    },
    courtChallengeBtnFailed: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    courtChallengeBtnTextFailed: {
        color: '#FFF',
    },
    courtChallengeBtnDisabled: {
        opacity: 0.3,
    },
    courtChallengeBtnText: {
        fontFamily: Theme.fonts.subtitle,
        fontSize: 10,
        color: '#777',
        letterSpacing: 0.5,
    },
    courtChallengeBtnTextSuccess: {
        color: '#2ECC71',
    },
    courtChallengeBtnTextDanger: {
        color: Theme.colors.red,
    },
    courtChallengeBtnTextWarning: {
        color: '#FFA500',
    },
    courtNavigation: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 10,
        paddingVertical: 8,
        gap: 6,
    },
    toggleRowActive: {
        borderColor: 'rgba(153, 0, 0, 0.2)',
    },
    toggleText: {
        fontFamily: Theme.fonts.subtitle,
        fontSize: 10,
        color: '#888',
        letterSpacing: 0.5,
    },
    toggleTextActive: {
        color: '#FFF',
    },
    waitingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        gap: 15,
    },
    waitingTitle: {
        fontFamily: Theme.fonts.title,
        fontSize: 24,
        color: Theme.colors.red,
        letterSpacing: 2,
        textAlign: 'center',
    },
    waitingSubtitle: {
        fontFamily: Theme.fonts.subtitle,
        fontSize: 13,
        color: '#AAA',
        letterSpacing: 0.5,
        textAlign: 'center',
        lineHeight: 18,
    },
});
