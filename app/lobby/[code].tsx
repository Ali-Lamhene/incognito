import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Animated, { Easing, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { MainButton } from '../../components/MainButton';
import { ThemedText } from '../../components/ThemedText';

import { useSession } from '../../context/SessionContext';
import { useTranslation } from '../../hooks/useTranslation';

import { onDisconnect, ref, remove, serverTimestamp, set } from 'firebase/database';
import { db } from '../../services/firebase';
import { useProfileStore } from '../../store/profileStore';

export default function LobbyScreen() {
    const { code: rawCode } = useLocalSearchParams();
    const code = typeof rawCode === 'string' ? rawCode.trim().toUpperCase() : '';

    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { session, clearSession, joinSession, isInitialized, agents: syncedAgents, status, startMission } = useSession();
    const { t } = useTranslation();
    const { profile } = useProfileStore();
    const [isExiting, setIsExiting] = useState(false);
    const [showStartModal, setShowStartModal] = useState(false);

    // Redirection quand la mission commence
    useEffect(() => {
        if (status === 'ACTIVE') {
            router.replace('/mission/active');
        }
    }, [status]);

    // Enregistrement de l'agent sur Firebase
    useEffect(() => {
        if (!isInitialized || !code || !profile || isExiting) return;

        const agentRef = ref(db, `missions/${code}/agents/${profile.id}`);

        // S'enregistrer
        set(agentRef, {
            name: profile.codename,
            avatar: profile.avatar,
            status: 'READY',
            lastSeen: serverTimestamp()
        });

        // Se retirer automatiquement en cas de déconnexion (fermeture app, perte réseau)
        onDisconnect(agentRef).remove();

        return () => {
            // On ne supprime l'agent que s'il a explicitement quitté (bouton abandonner)
            // ou si on est encore dans le lobby et qu'il change d'écran.
            // Si la mission est ACTIVE, on garde l'agent pour qu'il puisse voir son objectif.
            if (isExiting) {
                remove(agentRef);
            }
        };
    }, [code, profile?.id, isInitialized, isExiting]);

    useEffect(() => {
        if (isExiting) return;
        if (isInitialized && code && typeof code === 'string' && code.length > 0) {
            // If no active session or session code differs, join as agent
            if (!session || session.code !== code) {
                joinSession(code);
            }
        }
    }, [code, session, isInitialized, isExiting]);

    const isHost = session?.role === 'HOST';

    // Remplacer l'état local par les agents synchronisés
    const agents = syncedAgents;

    const scannerOpacity = useSharedValue(0.3);

    useEffect(() => {
        scannerOpacity.value = withRepeat(
            withTiming(0.8, { duration: 2000 }),
            -1,
            true
        );
    }, []);

    const animatedScannerStyle = useAnimatedStyle(() => ({
        opacity: scannerOpacity.value,
        borderColor: '#FFF',
    }));

    const handleBack = () => {
        if (!isHost) {
            handleLeave();
        } else {
            router.push('/');
        }
    };

    const [showDestroyModal, setShowDestroyModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    const handleAbort = () => {
        setShowDestroyModal(true);
    };

    const confirmDestroy = async () => {
        setIsExiting(true);
        setShowDestroyModal(false);
        await clearSession(profile?.id);
        router.replace('/');
    };

    const handleLeave = () => {
        setShowLeaveModal(true);
    };

    const confirmLeave = async () => {
        setIsExiting(true);
        setShowLeaveModal(false);
        await clearSession(profile?.id);
        router.replace('/');
    };

    const handleDeploy = () => {
        setShowStartModal(true);
    };

    const confirmStart = async () => {
        setShowStartModal(false);
        await startMission();
    };

    const copyToClipboard = async () => {
        if (typeof code === 'string') {
            await Clipboard.setStringAsync(code);
            // Could add a toast here
        }
    };

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
            <View style={styles.emptySlot}>
                <Animated.View style={animatedStyle}>
                    <ThemedText type="code" style={styles.emptyText}>{t('lobby.waiting')}</ThemedText>
                </Animated.View>
            </View>
        );
    };

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

    return (
        <View style={styles.container}>
            {/* BACKGROUND: Surveillance Desk for Planning Phase */}
            <View style={styles.backgroundContainer}>
                <Image
                    source={require('../../assets/images/surveillance_desk_monochrome.png')}
                    style={styles.backgroundImage}
                    contentFit="cover"
                />
                <View style={styles.backgroundOverlay} />
                <Image
                    source={require('../../assets/images/tactical_texture.png')}
                    style={styles.tacticalOverlay}
                    contentFit="cover"
                />
            </View>

            <ScrollView
                style={{ flex: 1, marginBottom: insets.bottom }}
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingTop: insets.top + 20,
                        paddingBottom: 20
                    }
                ]}
                showsVerticalScrollIndicator={false}
            >

                {/* Header */}
                <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <ThemedText type="code" style={styles.backText}>{'<< ' + t('common.return')}</ThemedText>
                        </TouchableOpacity>

                        {isHost && (
                            <TouchableOpacity onPress={handleAbort} style={styles.destroyButton}>
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

                {/* Central Code & QR */}
                <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.codeSection}>
                    <Animated.View style={[styles.qrFrame, animatedScannerStyle]}>
                        <View style={styles.qrContainer}>
                            <QRCode
                                value={code as string || 'ERROR'}
                                size={180}
                                color="black"
                                backgroundColor="white"
                            />
                        </View>
                        <View style={styles.cornerTL} />
                        <View style={styles.cornerTR} />
                        <View style={styles.cornerBL} />
                        <View style={styles.cornerBR} />
                    </Animated.View>

                    <TouchableOpacity onPress={copyToClipboard} style={styles.codeDisplay}>
                        <ThemedText type="futuristic" style={styles.missionCodeText}>{code}</ThemedText>
                        <ThemedText type="code" style={styles.copyHint}>{t('lobby.copy_hint')}</ThemedText>
                    </TouchableOpacity>
                </Animated.View>

                {/* Footer Action */}
                {isHost && (
                    <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.footer}>
                        <MainButton
                            title={agents.length < 2 ? t('lobby.waiting_agents') : t('lobby.btn_deploy')}
                            onPress={handleDeploy}
                            disabled={agents.length < 2}
                            style={styles.startButton}
                        />
                        {agents.length < 2 && (
                            <ThemedText type="code" style={styles.aloneHint}>
                                {t('lobby.recruitment_required')}
                            </ThemedText>
                        )}
                    </Animated.View>
                )}

                {/* Agents List */}
                <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.agentsSection}>
                    <ThemedText type="code" style={styles.sectionLabel}>{t('lobby.agents_connected')} [{agents.length}]</ThemedText>
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


            </ScrollView>

            <ConfirmationModal
                visible={showDestroyModal}
                title={t('lobby.abort_title')}
                message={t('lobby.abort_msg')}
                confirmLabel={t('lobby.btn_abort')}
                cancelLabel={t('common.cancel')}
                onConfirm={confirmDestroy}
                onCancel={() => setShowDestroyModal(false)}
                variant="danger"
            />

            <ConfirmationModal
                visible={showLeaveModal}
                title={t('lobby.leave_title')}
                message={t('lobby.leave_msg')}
                confirmLabel={t('lobby.btn_leave')}
                cancelLabel={t('common.cancel')}
                onConfirm={confirmLeave}
                onCancel={() => setShowLeaveModal(false)}
            />

            <ConfirmationModal
                visible={showStartModal}
                title={t('lobby.start_op_title')}
                message={t('lobby.start_op_msg')}
                confirmLabel={t('lobby.btn_deploy_simple')}
                cancelLabel={t('common.cancel')}
                onConfirm={confirmStart}
                onCancel={() => setShowStartModal(false)}
            />
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
        opacity: 0.4,
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(5, 5, 8, 0.85)',
    },
    tacticalOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.15,
    },
    scrollContent: {
        flexGrow: 1, // Ensures it fills height if content is small
        paddingHorizontal: 25,
        justifyContent: 'space-between',
        gap: 15,
    },
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
    codeSection: {
        alignItems: 'center',
        gap: 20,
    },
    qrFrame: {
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'relative',
    },
    qrContainer: {
        padding: 10,
        backgroundColor: '#FFF',
    },
    cornerTL: { position: 'absolute', top: -1, left: -1, width: 10, height: 10, borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#FFF' },
    cornerTR: { position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#FFF' },
    cornerBL: { position: 'absolute', bottom: -1, left: -1, width: 10, height: 10, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: '#FFF' },
    cornerBR: { position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#FFF' },
    codeDisplay: {
        alignItems: 'center',
    },
    missionCodeText: {
        fontSize: 28,
        color: '#FFF',
        letterSpacing: 3,
        textAlign: 'center',
    },
    copyHint: {
        fontSize: 8,
        opacity: 0.4,
        marginTop: 5,
    },
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
    },
    emptyText: {
        color: '#FFF',
        fontSize: 10,
    },
    startButton: {
        width: '100%',
    },
    footer: {
        gap: 15,
    },
    destroyButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.2)',
    },
    aloneHint: {
        fontSize: 8,
        color: '#FF6B6B',
        textAlign: 'center',
        opacity: 0.8,
        letterSpacing: 1,
    }
});
