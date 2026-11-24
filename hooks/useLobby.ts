import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { useSession } from '../context/SessionContext';
import { useProfileStore } from '../store/profileStore';

export function useLobby() {
    const { code: rawCode } = useLocalSearchParams();
    const code = typeof rawCode === 'string' ? rawCode.trim().toUpperCase() : '';

    const router = useRouter();
    const { session, clearSession, joinSession, isInitialized, agents: syncedAgents, status, startMission } = useSession();
    const { profile } = useProfileStore();

    const [isExiting, setIsExiting] = useState(false);
    const [showStartModal, setShowStartModal] = useState(false);
    const [showDestroyModal, setShowDestroyModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    // Redirection quand la mission commence
    useEffect(() => {
        if (status === 'ACTIVE') {
            router.replace('/mission/active');
        }
    }, [status]);

    // L'inscription du joueur dans Firebase (et sa présence en ligne / hors ligne)
    // est gérée par SessionProvider dès qu'une session est active.

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
            handleAbort();
        }
    };

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
        }
    };

    return {
        code,
        isHost,
        hostId: session?.hostId,
        agents,
        isInitialized,
        animatedScannerStyle,
        modals: {
            showStartModal,
            setShowStartModal,
            showDestroyModal,
            setShowDestroyModal,
            showLeaveModal,
            setShowLeaveModal,
        },
        actions: {
            handleBack,
            handleAbort,
            confirmDestroy,
            handleLeave,
            confirmLeave,
            handleDeploy,
            confirmStart,
            copyToClipboard,
        }
    };
}
