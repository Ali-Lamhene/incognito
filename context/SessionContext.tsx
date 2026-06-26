import AsyncStorage from '@react-native-async-storage/async-storage';
import { child, get, increment, onValue, ref, remove, serverTimestamp, set, update } from 'firebase/database';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { CHALLENGES } from '../constants/Challenges';
import { db } from '../services/firebase';
import { useProfileStore } from '../store/profileStore';

type MissionSession = {
    code: string;
    role: 'HOST' | 'AGENT';
    createdAt: number;
    duration?: string;
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

export type Agent = {
    id: string;
    name: string;
    avatar: string;
    status: 'READY' | 'WAITING';
    lastSeen: any;
    challenge?: {
        text: string;
        id: string;
    };
    challenges?: {
        text: string;
        id: string;
        completed?: boolean;
    }[];
    completed?: boolean;
    completedAt?: number;
    score?: number;
};

type SessionContextType = {
    session: MissionSession | null;
    isInitialized: boolean;
    agents: Agent[];
    events: MissionEvent[];
    status: 'LOBBY' | 'ACTIVE' | 'FINISHED';
    createSession: (code: string, duration: string) => Promise<void>;
    joinSession: (code: string) => Promise<boolean>;
    clearSession: (agentId?: string) => Promise<void>;
    startMission: () => Promise<void>;
    finishMission: () => Promise<void>;
    checkSessionExists: (code: string) => Promise<boolean>;
    unmaskAgent: (targetId: string, validatorId: string) => Promise<boolean>;
    pushEvent: (event: Omit<MissionEvent, 'id' | 'timestamp'>) => Promise<void>;
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
                    duration: data.duration || prev.duration,
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

    const createSession = async (code: string, duration: string) => {
        const newSession: MissionSession = {
            code,
            role: 'HOST',
            createdAt: Date.now(),
            duration
        };

        await set(ref(db, `missions/${code}`), {
            duration,
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

        // Check if there is already a saved host session for this code in AsyncStorage to avoid race conditions
        try {
            const saved = await AsyncStorage.getItem('incognito_session');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.code === normalizedCode && parsed.role === 'HOST') {
                    setSession(parsed);
                    return true;
                }
            }
        } catch (e) {
            console.error('Error reading saved session from AsyncStorage', e);
        }

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
            const agentChallenges = [];
            for (let i = 0; i < 3; i++) {
                if (availableChallenges.length === 0) break;
                const randomIndex = Math.floor(Math.random() * availableChallenges.length);
                const challenge = availableChallenges.splice(randomIndex, 1)[0];
                agentChallenges.push(challenge);
            }
            if (agentChallenges.length > 0) {
                updates[`missions/${session.code}/agents/${agent.id}/challenge`] = agentChallenges[0];
                updates[`missions/${session.code}/agents/${agent.id}/challenges`] = agentChallenges;
            }
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

        const resolvedAgentId = agentId || useProfileStore.getState().profile?.id;

        try {
            if (session.role === 'HOST') {
                await remove(ref(db, `missions/${session.code}`));
            } else if (resolvedAgentId) {
                await remove(ref(db, `missions/${session.code}/agents/${resolvedAgentId}`));
            }
        } catch (e) {
            console.error('Erreur lors de la fermeture de session Firebase', e);
        }

        setSession(null);
        await AsyncStorage.removeItem('incognito_session');
    };

    const unmaskAgent = async (targetId: string, validatorId: string): Promise<boolean> => {
        if (!session?.code) return false;
        const target = agents.find(a => a.id === targetId);
        const validator = agents.find(a => a.id === validatorId);
        if (!target || !validator) return false;

        await pushEvent({
            type: 'SUSPECT',
            agentId: validatorId,
            agentName: validator.name,
            targetName: target.name
        });
        return true;
    };

    return (
        <SessionContext.Provider value={{
            session, isInitialized, agents, events, status,
            createSession, joinSession, clearSession,
            startMission, finishMission, checkSessionExists, unmaskAgent, pushEvent
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
