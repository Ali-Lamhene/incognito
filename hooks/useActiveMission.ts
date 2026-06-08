import { useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { useSharedValue, withRepeat, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { useSession } from '../context/SessionContext';
import { useProfileStore } from '../store/profileStore';
import SoundService from '../services/SoundService';

export function useActiveMission() {
    const router = useRouter();
    const { profile } = useProfileStore();
    const {
        session,
        agents,
        events,
        status,
        completeChallenge,
        triggerBluff,
        clearSession,
        reportImpossibleChallenge,
        voteIncident,
        unmaskAgent,
        respondToUnmask,
        resolveUnmaskVote,
        triggerRouletteTirage,
        finishMission,
        finalizeChallengePoints,
        resolveImpossibleChallenge,
    } = useSession();

    const [isRevealed, setIsRevealed] = useState(false);
    const [showAbortModal, setShowAbortModal] = useState(false);
    const [showImpossibleModal, setShowImpossibleModal] = useState(false);
    const [showUnmaskModal, setShowUnmaskModal] = useState(false);
    const [targetIdToUnmask, setTargetIdToUnmask] = useState<string | null>(null);

    const [visibleEvents, setVisibleEvents] = useState<string[]>([]);
    const [isRouletteActive, setIsRouletteActive] = useState(false);
    const [rouletteWinner, setRouletteWinner] = useState<string | null>(null);
    const [processedRouletteIncident, setProcessedRouletteIncident] = useState<string | null>(null);
    const [now, setNow] = useState(Date.now());
    const [showStartSplash, setShowStartSplash] = useState(true);
    const [showCompleteSplash, setShowCompleteSplash] = useState(false);

    const parseDuration = (d?: string) => {
        if (!d) return 0;
        const match = d.match(/(\d+)/);
        return match ? parseInt(match[1]) * 60 * 1000 : 0;
    };

    const durationMs = parseDuration(session?.duration);
    const startTime = session?.startedAt || 0;
    const endTime = startTime + durationMs;
    const isPaused = !!session?.pausedAt;
    const timeLeft = isPaused
        ? Math.max(0, endTime - (session?.pausedAt || 0))
        : Math.max(0, endTime - now);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const isLowTime = timeLeft < 60000 && timeLeft > 0;

    const scanPos = useSharedValue(0);

    const me = agents.find((a) => a.id === profile?.id);
    const myChallenge = me?.challenge;
    const isCompleted = me?.completed;
    const isHost = session?.role === "HOST";

    const agentInIncident = agents.find((a) => !!a.incident);
    const incidentType = agentInIncident?.incident?.type;
    const incidentVotes = agentInIncident?.incident?.votes || {};
    const myVote = incidentVotes[profile?.id || ""];

    const countPossible = Object.values(incidentVotes).filter(
        (v) => v === "IMPOSSIBLE"
    ).length;
    const countFeasible = Object.values(incidentVotes).filter(
        (v) => v === "FEASIBLE"
    ).length;

    const countYes = Object.values(incidentVotes).filter(
        (v) => v === "YES"
    ).length;
    const countNo = Object.values(incidentVotes).filter(
        (v) => v === "NO"
    ).length;

    const maxVoters = agents.length - 2;
    const currentVoters = Object.keys(incidentVotes).length;
    const isUnmaskTie =
        incidentType === "UNMASK_VOTE" &&
        countYes === countNo &&
        currentVoters >= maxVoters;

    useEffect(() => {
        if (status === "LOBBY") {
            router.replace("/");
            return;
        }

        if (status === "FINISHED") {
            setShowCompleteSplash(true);
            return;
        }

        SoundService.stopBackgroundMusic();
        scanPos.value = withRepeat(withTiming(1, { duration: 3000 }), -1, false);
    }, [status, router, scanPos]);

    const animatedScanStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scanPos.value * 250 }],
    }));

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = Date.now();
            setNow(currentTime);

            if (isHost && status === "ACTIVE" && !isPaused) {
                const dMs = parseDuration(session?.duration);
                const sTime = session?.startedAt || 0;
                if (sTime > 0 && currentTime >= sTime + dMs) {
                    finishMission();
                }
            }

            agents.forEach((agent) => {
                if (agent.pendingValidation) {
                    const elapsed = currentTime - agent.pendingValidation.startedAt;
                    if (elapsed >= 60000) {
                        finalizeChallengePoints(agent.id);
                    }
                }
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            SoundService.stopBackgroundMusic();
        };
    }, [agents, status, isHost, isPaused, session?.duration, session?.startedAt, finishMission, finalizeChallengePoints]);

    useEffect(() => {
        const currentTime = Date.now();
        const newEvents = events.filter((e) => {
            const isRecent = currentTime - e.timestamp < 5000;
            const notShowing = !visibleEvents.includes(e.id);
            return isRecent && notShowing;
        });

        if (newEvents.length > 0) {
            const newIds = newEvents.map((e) => e.id);
            setVisibleEvents((prev) => [...prev, ...newIds]);

            newIds.forEach((id) => {
                setTimeout(() => {
                    setVisibleEvents((prev) => prev.filter((vid) => vid !== id));
                }, 5000);
            });
        }
    }, [events, visibleEvents]);

    const handleComplete = async () => {
        if (profile?.id) {
            await completeChallenge(profile.id);
            SoundService.playSFX('SUCCESS');
            setIsRevealed(false);
        }
    };

    const handleBluff = async () => {
        if (profile?.id) {
            await triggerBluff(profile.id);
            setIsRevealed(false);
        }
    };

    const handleAbort = async () => {
        setShowAbortModal(false);
        await clearSession(profile?.id);
        router.replace("/");
    };

    const handleImpossible = async () => {
        setShowImpossibleModal(false);
        if (profile?.id) {
            await reportImpossibleChallenge(profile.id);
        }
    };

    const handleVote = async (vote: "FEASIBLE" | "IMPOSSIBLE" | "YES" | "NO") => {
        if (agentInIncident && profile?.id) {
            await voteIncident(agentInIncident.id, profile.id, vote);
        }
    };

    const handleUnmask = (targetId: string) => {
        setTargetIdToUnmask(targetId);
        setShowUnmaskModal(true);
    };

    const handleConfirmUnmask = async () => {
        if (profile?.id && targetIdToUnmask) {
            SoundService.playSFX('TENSION_STINGER');
            await unmaskAgent(targetIdToUnmask, profile.id);
            setShowUnmaskModal(false);
            setTargetIdToUnmask(null);
        }
    };

    const handleRespondToUnmask = async (isCorrect: boolean) => {
        if (agentInIncident && profile?.id) {
            await respondToUnmask(agentInIncident.id, isCorrect);
        }
    };

    const handleResolveUnmaskVote = useCallback(async (wasActuallyCorrect: boolean) => {
        if (agentInIncident && profile?.id) {
            await resolveUnmaskVote(agentInIncident.id, wasActuallyCorrect);
        }
    }, [agentInIncident, profile?.id, resolveUnmaskVote]);

    const startRoulette = useCallback((sharedWinnerId: string) => {
        if (!agentInIncident || isRouletteActive) return;
        setIsRouletteActive(true);
        const unmaskerId = agentInIncident.incident?.unmaskerId;

        setTimeout(() => {
            setRouletteWinner(sharedWinnerId);
            setTimeout(() => {
                const isUnmasker = profile?.id === unmaskerId;
                if (isUnmasker) {
                    handleResolveUnmaskVote(sharedWinnerId === unmaskerId);
                }
                setIsRouletteActive(false);
                setRouletteWinner(null);
            }, 2000);
        }, 4000);
    }, [agentInIncident, isRouletteActive, profile?.id, handleResolveUnmaskVote]);

    useEffect(() => {
        if (
            incidentType === "UNMASK_VOTE" &&
            (isUnmaskTie || maxVoters <= 0) &&
            agentInIncident
        ) {
            const sharedWinner = agentInIncident.incident?.rouletteWinnerId;
            const isUnmasker = profile?.id === agentInIncident.incident?.unmaskerId;
            const incidentId = `${agentInIncident.id}-${agentInIncident.incident?.reportedAt}`;

            if (sharedWinner) {
                if (
                    processedRouletteIncident !== incidentId &&
                    !isRouletteActive &&
                    !rouletteWinner
                ) {
                    setProcessedRouletteIncident(incidentId);
                    startRoulette(sharedWinner);
                }
            } else if (isUnmasker) {
                triggerRouletteTirage(
                    agentInIncident.id,
                    agentInIncident.incident!.unmaskerId!
                );
            }
        } else if (!agentInIncident) {
            setProcessedRouletteIncident(null);
        }
    }, [
        incidentType,
        isUnmaskTie,
        maxVoters,
        isRouletteActive,
        rouletteWinner,
        agentInIncident,
        processedRouletteIncident,
        profile?.id,
        startRoulette,
        triggerRouletteTirage
    ]);

    useEffect(() => {
        if (isLowTime && status === "ACTIVE" && !isPaused) {
            SoundService.playBackgroundMusic('HEARTBEAT');
        } else if (status === "ACTIVE") {
            SoundService.stopBackgroundMusic();
        }
    }, [isLowTime, status, isPaused]);

    useEffect(() => {
        if (isRouletteActive) {
            SoundService.playSFX('ROULETTE');
        }
    }, [isRouletteActive]);

    return {
        session,
        profile,
        agents,
        events,
        status,
        now,
        me,
        myChallenge,
        isCompleted,
        isHost,
        timeLeft,
        isLowTime,
        animatedScanStyle,
        visibleEvents,
        isRouletteActive,
        rouletteWinner,
        agentInIncident,
        incidentType,
        incidentVotes,
        myVote,
        countPossible,
        countFeasible,
        countYes,
        countNo,
        maxVoters,
        currentVoters,
        isUnmaskTie,
        isRevealed,
        setIsRevealed,
        showAbortModal,
        setShowAbortModal,
        showImpossibleModal,
        setShowImpossibleModal,
        showUnmaskModal,
        setShowUnmaskModal,
        showStartSplash,
        setShowStartSplash,
        showCompleteSplash,
        setShowCompleteSplash,
        formatTime,
        actions: {
            handleComplete,
            handleBluff,
            handleAbort,
            handleImpossible,
            handleVote,
            handleUnmask,
            handleConfirmUnmask,
            handleRespondToUnmask,
            handleResolveUnmaskVote,
            resolveImpossibleChallenge,
        }
    };
}
