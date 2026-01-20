import AsyncStorage from '@react-native-async-storage/async-storage';
import { child, get, onValue, ref, remove, serverTimestamp, set, update } from 'firebase/database';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { CHALLENGES } from '../constants/Challenges';
import { db } from '../services/firebase';

type MissionSession = {
    code: string;
    role: 'HOST' | 'AGENT';
    createdAt: number;
    threatLevel?: string;
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
        type: 'IMPOSSIBLE';
        reportedAt: number;
        votes?: Record<string, 'FEASIBLE' | 'IMPOSSIBLE'>;
    };
};

type SessionContextType = {
    session: MissionSession | null;
    isInitialized: boolean;
    agents: Agent[];
    status: 'LOBBY' | 'ACTIVE' | 'FINISHED';
    createSession: (code: string, threatLevel: string) => Promise<void>;
    joinSession: (code: string) => Promise<boolean>;
    clearSession: (agentId?: string) => Promise<void>;
    startMission: () => Promise<void>;
    checkSessionExists: (code: string) => Promise<boolean>;
    completeChallenge: (agentId: string) => Promise<void>;
    reportImpossibleChallenge: (agentId: string) => Promise<void>;
    voteIncident: (agentId: string, voterId: string, vote: 'FEASIBLE' | 'IMPOSSIBLE') => Promise<void>;
    resolveImpossibleChallenge: (agentId: string, wasActuallyImpossible: boolean) => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<MissionSession | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [status, setStatus] = useState<'LOBBY' | 'ACTIVE' | 'FINISHED'>('LOBBY');

    useEffect(() => {
        loadSession();
    }, []);

    // Synchronisation des agents et du statut quand une session est active
    useEffect(() => {
        if (!session?.code) {
            setAgents([]);
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
            } else {
                setAgents([]);
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
                // On pourrait vérifier si la mission existe encore sur Firebase ici
            }
            setIsInitialized(true);
        } catch (e) {
            console.error('Failed to load session', e);
            setIsInitialized(true);
        }
    };

    const createSession = async (code: string, threatLevel: string) => {
        const newSession: MissionSession = {
            code,
            role: 'HOST',
            createdAt: Date.now(),
            threatLevel
        };

        // Création sur Firebase
        await set(ref(db, `missions/${code}`), {
            threatLevel,
            createdAt: serverTimestamp(),
            status: 'LOBBY',
            hostId: 'TBD' // On pourra lier à l'ID du profil plus tard
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

        // Check if mission exists in Firebase
        const exists = await checkSessionExists(normalizedCode);
        if (!exists) {
            return false;
        }

        // Si on est déjà HOST, on ne change pas de rôle
        if (session && session.code === normalizedCode && session.role === 'HOST') {
            return true;
        }

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

        // 1. Récupérer la liste la plus à jour des agents directement sur Firebase
        const missionSnapshot = await get(ref(db, `missions/${session.code}`));
        const missionData = missionSnapshot.val();

        if (!missionData || !missionData.agents) {
            console.warn("No agents found to start mission");
            return;
        }

        const currentAgents = Object.entries(missionData.agents).map(([id, val]: [string, any]) => ({
            id,
            ...val
        }));

        // 2. Distribuer des défis aléatoires
        const updates: any = {};
        const availableChallenges = [...CHALLENGES];

        currentAgents.forEach(agent => {
            if (availableChallenges.length === 0) return;
            const randomIndex = Math.floor(Math.random() * availableChallenges.length);
            const challenge = availableChallenges.splice(randomIndex, 1)[0];

            updates[`missions/${session.code}/agents/${agent.id}/challenge`] = challenge;
        });

        // 3. Changer le statut
        updates[`missions/${session.code}/status`] = 'ACTIVE';
        updates[`missions/${session.code}/startedAt`] = serverTimestamp();

        await update(ref(db), updates);
    };

    const clearSession = async (agentId?: string) => {
        if (!session?.code) return;

        try {
            if (agentId) {
                // Supprimer l'agent de la liste sur Firebase
                await remove(ref(db, `missions/${session.code}/agents/${agentId}`));
            }

            if (session.role === 'HOST') {
                // Vérifier s'il reste d'autres agents
                const snapshot = await get(ref(db, `missions/${session.code}/agents`));
                const agentsData = snapshot.val();
                const otherAgentsCount = agentsData ? Object.keys(agentsData).length : 0;

                // Si l'hôte est seul (ou si plus personne après son départ), on supprime la mission
                if (otherAgentsCount === 0) {
                    await remove(ref(db, `missions/${session.code}`));
                }
                // Sinon, on laisse couler, la mission reste active pour les autres
            }
        } catch (e) {
            console.error('Erreur lors de la fermeture de session Firebase', e);
        }

        setSession(null);
        await AsyncStorage.removeItem('incognito_session');
    };

    const completeChallenge = async (agentId: string) => {
        if (!session?.code) return;
        await update(ref(db, `missions/${session.code}/agents/${agentId}`), {
            completed: true,
            completedAt: serverTimestamp()
        });
    };

    const reportImpossibleChallenge = async (agentId: string) => {
        if (!session?.code) return;
        await update(ref(db, `missions/${session.code}/agents/${agentId}`), {
            incident: {
                type: 'IMPOSSIBLE',
                reportedAt: Date.now(),
                votes: {}
            }
        });
    };

    const voteIncident = async (agentId: string, voterId: string, vote: 'FEASIBLE' | 'IMPOSSIBLE') => {
        if (!session?.code) return;
        await update(ref(db, `missions/${session.code}/agents/${agentId}/incident/votes`), {
            [voterId]: vote
        });
    };

    const resolveImpossibleChallenge = async (agentId: string, wasActuallyImpossible: boolean) => {
        if (!session?.code) return;

        // 1. Calculer le nouveau challenge
        const missionSnapshot = await get(ref(db, `missions/${session.code}`));
        const missionData = missionSnapshot.val();

        // Trouver les challenges déjà utilisés
        const usedChallengeIds = Object.values(missionData.agents || {})
            .map((a: any) => a.challenge?.id)
            .filter(id => !!id);

        const availableChallenges = CHALLENGES.filter(c => !usedChallengeIds.includes(c.id));
        const nextChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)] || CHALLENGES[0];

        // 2. Mettre à jour Firebase (nouveau challenge, reset incident, points si besoin)
        const updates: any = {};
        updates[`missions/${session.code}/agents/${agentId}/challenge`] = nextChallenge;
        updates[`missions/${session.code}/agents/${agentId}/incident`] = null;

        if (!wasActuallyImpossible) {
            // L'agent perd des points (on les stocke dans la session pour l'instant)
            const currentScore = missionData.agents?.[agentId]?.score || 0;
            updates[`missions/${session.code}/agents/${agentId}/score`] = currentScore - 10;
        }

        await update(ref(db), updates);
    };

    return (
        <SessionContext.Provider value={{
            session, isInitialized, agents, status,
            createSession, joinSession, clearSession,
            startMission, checkSessionExists, completeChallenge,
            reportImpossibleChallenge, voteIncident, resolveImpossibleChallenge
        }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
