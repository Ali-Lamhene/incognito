import AsyncStorage from '@react-native-async-storage/async-storage';
import { child, get, increment, onValue, ref, remove, serverTimestamp, set, update } from 'firebase/database';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { CHALLENGES } from '../constants/Challenges';
import { db } from '../services/firebase';

type MissionSession = {
    code: string;
    role: 'HOST' | 'AGENT';
    createdAt: number;
    threatLevel?: string;
    duration?: string;
    protocol?: string;
    startedAt?: number;
    pausedAt?: number;
    events?: Record<string, MissionEvent>;
};

type MissionEvent = {
    id: string;
    type: 'SUSPECT' | 'SUCCESS' | 'UNMASKED' | 'FAILED_UNMASK' | 'BLUFF_SUCCESS';
    agentName: string;
    agentId: string;
    timestamp: number;
    targetName?: string;
    points?: number;
    missionText?: string;
};

type Agent = {
    id: string;
    name: string;
    avatar: string;
    status: 'READY' | 'WAITING';
    lastSeen: any;
    challenge?: {
        text: string;
        id: string;
    };
    completed?: boolean;
    completedAt?: number;
    score?: number;
    incident?: {
        type: 'IMPOSSIBLE' | 'UNMASK_PROMPT' | 'UNMASK_VOTE';
        reportedAt: number;
        unmaskerId?: string;
        unmaskerName?: string;
        votes?: Record<string, 'FEASIBLE' | 'IMPOSSIBLE' | 'YES' | 'NO'>;
        rouletteWinnerId?: string;
    };
    pendingValidation?: {
        challengeId?: string;
        challengeText?: string;
        startedAt: number;
        isBluff: boolean;
    };
};

type SessionContextType = {
    session: MissionSession | null;
    isInitialized: boolean;
    agents: Agent[];
    events: MissionEvent[];
    status: 'LOBBY' | 'ACTIVE' | 'FINISHED';
    createSession: (code: string, threatLevel: string, duration: string, protocol: string) => Promise<void>;
    joinSession: (code: string) => Promise<boolean>;
    clearSession: (agentId?: string) => Promise<void>;
    startMission: () => Promise<void>;
    finishMission: () => Promise<void>;
    checkSessionExists: (code: string) => Promise<boolean>;
    completeChallenge: (agentId: string) => Promise<void>;
    triggerBluff: (agentId: string) => Promise<void>;
    finalizeChallengePoints: (agentId: string) => Promise<void>;
    reportImpossibleChallenge: (agentId: string) => Promise<void>;
    voteIncident: (agentId: string, voterId: string, vote: 'FEASIBLE' | 'IMPOSSIBLE' | 'YES' | 'NO') => Promise<void>;
    resolveImpossibleChallenge: (agentId: string, wasActuallyImpossible: boolean) => Promise<void>;
    unmaskAgent: (targetId: string, validatorId: string) => Promise<boolean>;
    respondToUnmask: (targetId: string, isCorrect: boolean) => Promise<void>;
    resolveUnmaskVote: (targetId: string, wasActuallyCorrect: boolean) => Promise<void>;
    pushEvent: (event: Omit<MissionEvent, 'id' | 'timestamp'>) => Promise<void>;
    triggerRouletteTirage: (targetId: string, unmaskerId: string) => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<MissionSession | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [events, setEvents] = useState<MissionEvent[]>([]);
    const [status, setStatus] = useState<'LOBBY' | 'ACTIVE' | 'FINISHED'>('LOBBY');

    useEffect(() => {
        loadSession();
    }, []);

    // Synchronisation des agents, du statut et des événements
    useEffect(() => {
        if (!session?.code) {
            setAgents([]);
            setEvents([]);
            setStatus('LOBBY');
            return;
        }

        const missionRef = ref(db, `missions/${session.code}`);
        const unsubscribe = onValue(missionRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Sync agents
                if (data.agents) {
                    const agentsList: Agent[] = Object.entries(data.agents).map(([id, val]: [string, any]) => ({
                        id,
                        ...val
                    }));
                    setAgents(agentsList);
                } else {
                    setAgents([]);
                }

                // Sync status
                if (data.status) {
                    setStatus(data.status);
                }

                // Sync events
                if (data.events) {
                    const eventList: MissionEvent[] = Object.entries(data.events)
                        .map(([id, val]: [string, any]) => ({
                            id,
                            ...val
                        }))
                        .sort((a, b) => b.timestamp - a.timestamp);
                    setEvents(eventList);
                } else {
                    setEvents([]);
                }

                // Sync Session Metadata
                setSession(prev => prev ? {
                    ...prev,
                    threatLevel: data.threatLevel || prev.threatLevel,
                    duration: data.duration || prev.duration,
                    protocol: data.protocol || prev.protocol,
                    startedAt: data.startedAt || prev.startedAt,
                    pausedAt: data.pausedAt || null,
                } : null);
            } else {
                setAgents([]);
                setEvents([]);
                setStatus('LOBBY');
            }
        });

        return () => unsubscribe();
    }, [session?.code]);

    const loadSession = async () => {
        try {
            const saved = await AsyncStorage.getItem('incognito_session');
            if (saved) {
                const parsed = JSON.parse(saved);
                setSession(parsed);
            }
            setIsInitialized(true);
        } catch (e) {
            console.error('Failed to load session', e);
            setIsInitialized(true);
        }
    };

    const pushEvent = async (event: Omit<MissionEvent, 'id' | 'timestamp'>) => {
        if (!session?.code) return;
        const eventId = Date.now().toString() + Math.random().toString(36).substring(2, 5);
        await set(ref(db, `missions/${session.code}/events/${eventId}`), {
            ...event,
            timestamp: serverTimestamp()
        });
    };

    const createSession = async (code: string, threatLevel: string, duration: string, protocol: string) => {
        const newSession: MissionSession = {
            code,
            role: 'HOST',
            createdAt: Date.now(),
            threatLevel,
            duration,
            protocol
        };

        await set(ref(db, `missions/${code}`), {
            threatLevel,
            duration,
            protocol,
            createdAt: serverTimestamp(),
            status: 'LOBBY',
            hostId: 'TBD'
        });

        setSession(newSession);
        await AsyncStorage.setItem('incognito_session', JSON.stringify(newSession));
    };

    const checkSessionExists = async (code: string): Promise<boolean> => {
        const snapshot = await get(child(ref(db), `missions/${code}`));
        return snapshot.exists();
    };

    const joinSession = async (code: string): Promise<boolean> => {
        const normalizedCode = code.toUpperCase();
        const exists = await checkSessionExists(normalizedCode);
        if (!exists) return false;

        if (session && session.code === normalizedCode && session.role === 'HOST') return true;

        const newSession: MissionSession = {
            code: normalizedCode,
            role: 'AGENT',
            createdAt: Date.now()
        };

        setSession(newSession);
        await AsyncStorage.setItem('incognito_session', JSON.stringify(newSession));
        return true;
    };

    const startMission = async () => {
        if (!session || session.role !== 'HOST') return;

        const missionSnapshot = await get(ref(db, `missions/${session.code}`));
        const missionData = missionSnapshot.val();

        if (!missionData || !missionData.agents) return;

        const currentAgents = Object.entries(missionData.agents).map(([id, val]: [string, any]) => ({
            id,
            ...val
        }));

        const updates: any = {};
        const availableChallenges = [...CHALLENGES];

        currentAgents.forEach(agent => {
            if (availableChallenges.length === 0) return;
            const randomIndex = Math.floor(Math.random() * availableChallenges.length);
            const challenge = availableChallenges.splice(randomIndex, 1)[0];
            updates[`missions/${session.code}/agents/${agent.id}/challenge`] = challenge;
        });

        updates[`missions/${session.code}/status`] = 'ACTIVE';
        updates[`missions/${session.code}/startedAt`] = serverTimestamp();

        await update(ref(db), updates);
    };

    const finishMission = async () => {
        if (!session || session.role !== 'HOST') return;
        await update(ref(db, `missions/${session.code}`), {
            status: 'FINISHED'
        });
    };

    const clearSession = async (agentId?: string) => {
        if (!session?.code) return;

        try {
            if (agentId) {
                await remove(ref(db, `missions/${session.code}/agents/${agentId}`));
            }

            if (session.role === 'HOST') {
                const snapshot = await get(ref(db, `missions/${session.code}/agents`));
                const agentsData = snapshot.val();
                const otherAgentsCount = agentsData ? Object.keys(agentsData).length : 0;

                if (otherAgentsCount === 0) {
                    await remove(ref(db, `missions/${session.code}`));
                }
            }
        } catch (e) {
            console.error('Erreur lors de la fermeture de session Firebase', e);
        }

        setSession(null);
        await AsyncStorage.removeItem('incognito_session');
    };

    const completeChallenge = async (agentId: string) => {
        if (!session?.code) return;

        const missionSnapshot = await get(ref(db, `missions/${session.code}`));
        const missionData = missionSnapshot.val();
        const agentData = missionData.agents?.[agentId];

        if (!agentData || !agentData.challenge) return;

        const usedChallengeIds = Object.values(missionData.agents || {})
            .map((a: any) => a.challenge?.id)
            .filter(id => !!id);

        const availableChallenges = CHALLENGES.filter(c => !usedChallengeIds.includes(c.id));
        const nextChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)] || CHALLENGES[0];

        const updates: any = {};
        updates[`missions/${session.code}/agents/${agentId}/challenge`] = nextChallenge;
        updates[`missions/${session.code}/agents/${agentId}/pendingValidation`] = {
            challengeId: agentData.challenge.id,
            challengeText: agentData.challenge.text,
            startedAt: Date.now(),
            isBluff: false
        };

        await update(ref(db), updates);

        await pushEvent({
            type: 'SUSPECT',
            agentId,
            agentName: agentData.name
        });
    };

    const triggerBluff = async (agentId: string) => {
        if (!session?.code) return;

        const snapshot = await get(ref(db, `missions/${session.code}/agents/${agentId}`));
        const agentData = snapshot.val();

        await update(ref(db, `missions/${session.code}/agents/${agentId}/pendingValidation`), {
            startedAt: Date.now(),
            isBluff: true
        });

        await pushEvent({
            type: 'SUSPECT',
            agentId,
            agentName: agentData?.name || 'Inconnu'
        });
    };

    const finalizeChallengePoints = async (agentId: string) => {
        if (!session?.code) return;

        const agentRef = ref(db, `missions/${session.code}/agents/${agentId}`);
        const snapshot = await get(agentRef);
        const agentData = snapshot.val();

        if (agentData?.pendingValidation) {
            const currentScore = agentData.score || 0;
            const updates: any = {};

            if (!agentData.pendingValidation.isBluff) {
                updates['score'] = increment(10);
                await pushEvent({
                    type: 'SUCCESS',
                    agentId,
                    agentName: agentData.name,
                    points: 10
                });
            }

            updates['pendingValidation'] = null;
            await update(agentRef, updates);
        }
    };

    const reportImpossibleChallenge = async (agentId: string) => {
        if (!session?.code) return;
        await update(ref(db, `missions/${session.code}`), {
            [`agents/${agentId}/incident`]: {
                type: 'IMPOSSIBLE',
                reportedAt: Date.now(),
                votes: {}
            },
            pausedAt: serverTimestamp()
        });
    };

    const voteIncident = async (agentId: string, voterId: string, vote: 'FEASIBLE' | 'IMPOSSIBLE' | 'YES' | 'NO') => {
        if (!session?.code) return;
        await update(ref(db, `missions/${session.code}/agents/${agentId}/incident/votes`), {
            [voterId]: vote
        });
    };

    const resolveImpossibleChallenge = async (agentId: string, wasActuallyImpossible: boolean) => {
        if (!session?.code) return;

        const missionSnapshot = await get(ref(db, `missions/${session.code}`));
        const missionData = missionSnapshot.val();

        const usedChallengeIds = Object.values(missionData.agents || {})
            .map((a: any) => a.challenge?.id)
            .filter(id => !!id);

        const availableChallenges = CHALLENGES.filter(c => !usedChallengeIds.includes(c.id));
        const nextChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)] || CHALLENGES[0];

        const updates: any = {};
        updates[`missions/${session.code}/agents/${agentId}/challenge`] = nextChallenge;
        updates[`missions/${session.code}/agents/${agentId}/incident`] = null;

        if (!wasActuallyImpossible) {
            updates[`missions/${session.code}/agents/${agentId}/score`] = increment(-10);
        }

        // Reprise du minuteur
        const pausedAt = missionData.pausedAt;
        const currentStartedAt = missionData.startedAt;
        if (pausedAt && currentStartedAt) {
            const pauseDuration = Date.now() - pausedAt;
            updates[`missions/${session.code}/startedAt`] = currentStartedAt + pauseDuration;
            updates[`missions/${session.code}/pausedAt`] = null;
        }

        await update(ref(db), updates);
    };

    const unmaskAgent = async (targetId: string, validatorId: string): Promise<boolean> => {
        if (!session?.code) return false;

        const missionSnapshot = await get(ref(db, `missions/${session.code}`));
        const missionData = missionSnapshot.val();

        const target = missionData.agents?.[targetId];
        const validator = missionData.agents?.[validatorId];

        if (!target || !validator) return false;

        // On place la cible en état de PROMPT
        await update(ref(db, `missions/${session.code}`), {
            [`agents/${targetId}/incident`]: {
                type: 'UNMASK_PROMPT',
                unmaskerId: validatorId,
                unmaskerName: validator.name,
                reportedAt: Date.now()
            },
            pausedAt: serverTimestamp() // On met en pause le minuteur
        });

        // Event initial
        await pushEvent({
            type: 'SUSPECT',
            agentId: validatorId,
            agentName: `${validator.name} tente de démasquer ${target.name} !`
        });

        return true;
    };

    const respondToUnmask = async (targetId: string, isCorrect: boolean) => {
        if (!session?.code) return;

        const missionSnapshot = await get(ref(db, `missions/${session.code}`));
        const missionData = missionSnapshot.val();
        const target = missionData.agents?.[targetId];
        const unmaskerId = target.incident?.unmaskerId;
        const unmasker = missionData.agents?.[unmaskerId];

        if (isCorrect) {
            // L'agent avoue
            const updates: any = {};
            const targetScore = target.score || 0;
            const unmaskerScore = unmasker?.score || 0;

            updates[`missions/${session.code}/agents/${targetId}/score`] = increment(-10);
            updates[`missions/${session.code}/agents/${unmaskerId}/score`] = increment(10);
            updates[`missions/${session.code}/agents/${targetId}/incident`] = null;

            // Nouvelle mission pour celui qui a été démasqué
            const usedChallengeIds = Object.values(missionData.agents || {})
                .map((a: any) => a.challenge?.id)
                .filter(id => !!id);
            const availableChallenges = CHALLENGES.filter(c => !usedChallengeIds.includes(c.id));
            const nextChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)] || CHALLENGES[0];
            updates[`missions/${session.code}/agents/${targetId}/challenge`] = nextChallenge;

            // Reprise du minuteur
            const currentStartedAt = missionData.startedAt;
            const pausedAt = missionData.pausedAt;
            if (pausedAt && currentStartedAt) {
                const pauseDuration = Date.now() - pausedAt;
                updates[`missions/${session.code}/startedAt`] = currentStartedAt + pauseDuration;
                updates[`missions/${session.code}/pausedAt`] = null;
            }

            await update(ref(db), updates);

            await pushEvent({
                type: 'UNMASKED',
                agentId: targetId,
                agentName: target.name,
                targetName: unmasker?.name || 'Unmasker',
                missionText: target.challenge?.text,
                points: 10
            });
        } else {
            // L'agent nie - on passe au vote mais on GARDE les infos de l'unmasker
            await update(ref(db, `missions/${session.code}/agents/${targetId}/incident`), {
                type: 'UNMASK_VOTE',
                votes: {}
            });
        }
    };

    const triggerRouletteTirage = async (targetId: string, unmaskerId: string) => {
        if (!session?.code) return;
        const winnerId = Math.random() > 0.5 ? unmaskerId : targetId;
        await update(ref(db, `missions/${session.code}/agents/${targetId}/incident`), {
            rouletteWinnerId: winnerId
        });
    };

    const resolveUnmaskVote = async (targetId: string, wasActuallyCorrect: boolean) => {
        if (!session?.code) return;

        const missionSnapshot = await get(ref(db, `missions/${session.code}`));
        const missionData = missionSnapshot.val();
        const target = missionData.agents?.[targetId];
        const unmaskerId = target?.incident?.unmaskerId;

        if (!unmaskerId) return; // Sécurité : l'incident a déjà été nettoyé ou n'existe pas

        const unmasker = missionData.agents?.[unmaskerId];

        const updates: any = {};
        const targetScore = target.score || 0;
        const unmaskerScore = unmasker?.score || 0;

        if (wasActuallyCorrect) {
            // Le vote a donné raison à l'accusateur
            updates[`missions/${session.code}/agents/${targetId}/score`] = increment(-10);
            updates[`missions/${session.code}/agents/${unmaskerId}/score`] = increment(10);

            // Nouvelle mission pour celui qui a été démasqué
            const usedChallengeIds = Object.values(missionData.agents || {})
                .map((a: any) => a.challenge?.id)
                .filter(id => !!id);
            const availableChallenges = CHALLENGES.filter(c => !usedChallengeIds.includes(c.id));
            const nextChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)] || CHALLENGES[0];
            updates[`missions/${session.code}/agents/${targetId}/challenge`] = nextChallenge;

            await pushEvent({
                type: 'UNMASKED',
                agentId: targetId,
                agentName: target.name,
                targetName: unmasker?.name || 'Unmasker',
                missionText: target.challenge?.text,
                points: 10
            });
        } else {
            // Le vote a donné raison à l'accusé
            updates[`missions/${session.code}/agents/${targetId}/score`] = increment(10); // Bonus pour avoir été faussement accusé
            updates[`missions/${session.code}/agents/${unmaskerId}/score`] = increment(-10); // Malus pour fausse accusation

            await pushEvent({
                type: 'FAILED_UNMASK',
                agentId: unmaskerId,
                agentName: unmasker?.name || 'Unmasker',
                targetName: target.name,
                points: -10
            });
        }

        updates[`missions/${session.code}/agents/${targetId}/incident`] = null;

        // Reprise du minuteur
        const currentStartedAt = missionData.startedAt;
        const pausedAt = missionData.pausedAt;
        if (pausedAt && currentStartedAt) {
            const pauseDuration = Date.now() - pausedAt;
            updates[`missions/${session.code}/startedAt`] = currentStartedAt + pauseDuration;
            updates[`missions/${session.code}/pausedAt`] = null;
        }

        await update(ref(db), updates);
    };

    return (
        <SessionContext.Provider value={{
            session, isInitialized, agents, events, status,
            createSession, joinSession, clearSession,
            startMission, finishMission, checkSessionExists, completeChallenge, triggerBluff, finalizeChallengePoints,
            reportImpossibleChallenge, voteIncident, resolveImpossibleChallenge, unmaskAgent,
            respondToUnmask, resolveUnmaskVote, pushEvent, triggerRouletteTirage
        }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) throw new Error('useSession must be used within a SessionProvider');
    return context;
}
