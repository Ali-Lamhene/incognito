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
        clearSession,
        unmaskAgent,
        finishMission,
    } = useSession();

    const [isRevealed, setIsRevealed] = useState(false);
    const [showAbortModal, setShowAbortModal] = useState(false);
    const [showUnmaskModal, setShowUnmaskModal] = useState(false);
    const [targetIdToUnmask, setTargetIdToUnmask] = useState<string | null>(null);

    const [visibleEvents, setVisibleEvents] = useState<string[]>([]);
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
    const timeLeft = Math.max(0, endTime - now);

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
            SoundService.stopBackgroundMusic();
        };
    }, [status, isHost, session?.duration, session?.startedAt, finishMission]);

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
            SoundService.playSFX('TENSION_STINGER');
            await unmaskAgent(targetIdToUnmask, profile.id);
            setShowUnmaskModal(false);
            setTargetIdToUnmask(null);
        }
    };

    useEffect(() => {
        if (isLowTime && status === "ACTIVE") {
            SoundService.playBackgroundMusic('HEARTBEAT');
        } else if (status === "ACTIVE") {
            SoundService.stopBackgroundMusic();
        }
    }, [isLowTime, status]);

    const targetAgent = agents.find((a) => a.id === targetIdToUnmask);
    const targetAgentName = targetAgent ? targetAgent.name : '';

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
        actions: {
            handleAbort,
            handleUnmask,
            handleConfirmUnmask,
        }
    };
}
