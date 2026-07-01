import { useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { useSharedValue, withRepeat, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { useSession } from '../context/SessionContext';
import { useProfileStore } from '../store/profileStore';


export function useActiveMission() {
    const router = useRouter();
    const { profile } = useProfileStore();
    const {
        session,
        agents,
        status,
        clearSession,
        unmaskAgent,
        finishMission,
        confessAccusation,
        denyAccusation,
    } = useSession();

    const [isRevealed, setIsRevealed] = useState(false);
    const [showAbortModal, setShowAbortModal] = useState(false);
    const [showUnmaskModal, setShowUnmaskModal] = useState(false);
    const [targetIdToUnmask, setTargetIdToUnmask] = useState<string | null>(null);
    const [now, setNow] = useState(Date.now());
    const [showStartSplash, setShowStartSplash] = useState(true);
    const [showCompleteSplash, setShowCompleteSplash] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const parseDuration = (d?: string) => {
        if (!d) return 0;
        const match = d.match(/(\d+)/);
        return match ? parseInt(match[1]) * 60 * 1000 : 0;
    };

    const durationMs = parseDuration(session?.duration);
    const startTime = session?.startedAt || 0;
    const endTime = startTime + durationMs;
    const timeLeft = Math.max(0, endTime - now);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const isLowTime = timeLeft < 60000 && timeLeft > 0;

    const me = agents.find((a) => a.id === profile?.id);
    const myChallenge = me?.challenge;
    const isCompleted = me?.completed;
    const isHost = session?.role === "HOST";

    useEffect(() => {
        if (status === "LOBBY") {
            router.replace("/");
            return;
        }

        if (status === "FINISHED") {
            setShowCompleteSplash(true);
            return;
        }


    }, [status, router]);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = Date.now();
            setNow(currentTime);

            if (isHost && status === "ACTIVE") {
                const dMs = parseDuration(session?.duration);
                const sTime = session?.startedAt || 0;
                if (sTime > 0 && currentTime >= sTime + dMs) {
                    finishMission();
                }
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [status, isHost, session?.duration, session?.startedAt, finishMission]);

    const handleAbort = async () => {
        setShowAbortModal(false);
        await clearSession(profile?.id);
        router.replace("/");
    };

    const handleUnmask = (targetId: string) => {
        setTargetIdToUnmask(targetId);
        setShowUnmaskModal(true);
    };

    const handleConfirmUnmask = async () => {
        if (profile?.id && targetIdToUnmask) {
            await unmaskAgent(targetIdToUnmask, profile.id);
            setShowUnmaskModal(false);
            setTargetIdToUnmask(null);
        }
    };



    const handleConfessAccusation = async (challengeId: string) => {
        if (profile?.id) {
            await confessAccusation(profile.id, challengeId);
        }
    };

    const handleDenyAccusation = async () => {
        if (profile?.id) {
            await denyAccusation(profile.id);
        }
    };

    const targetAgent = agents.find((a) => a.id === targetIdToUnmask);
    const targetAgentName = targetAgent ? targetAgent.name : '';

    return {
        session,
        profile,
        agents,
        status,
        now,
        me,
        myChallenge,
        isCompleted,
        isHost,
        timeLeft,
        isLowTime,
        isRevealed,
        setIsRevealed,
        showAbortModal,
        setShowAbortModal,
        showUnmaskModal,
        setShowUnmaskModal,
        showStartSplash,
        setShowStartSplash,
        showCompleteSplash,
        setShowCompleteSplash,
        formatTime,
        targetAgentName,
        activeIndex,
        setActiveIndex,
        actions: {
            handleAbort,
            handleUnmask,
            handleConfirmUnmask,
            handleConfessAccusation,
            handleDenyAccusation,
        }
    };
}
