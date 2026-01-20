import AsyncStorage from '@react-native-async-storage/async-storage';
import { child, get, onValue, ref, remove, serverTimestamp, set } from 'firebase/database';
import React, { createContext, useContext, useEffect, useState } from 'react';
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
};

type SessionContextType = {
    session: MissionSession | null;
    isInitialized: boolean;
    agents: Agent[];
    createSession: (code: string, threatLevel: string) => Promise<void>;
    joinSession: (code: string) => Promise<boolean>;
    clearSession: (agentId?: string) => Promise<void>;
    checkSessionExists: (code: string) => Promise<boolean>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<MissionSession | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [agents, setAgents] = useState<Agent[]>([]);

    useEffect(() => {
        loadSession();
    }, []);

    // Synchronisation des agents quand une session est active
    useEffect(() => {
        if (!session?.code) {
            setAgents([]);
            return;
        }

        const agentsRef = ref(db, `missions/${session.code}/agents`);
        const unsubscribe = onValue(agentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const agentsList: Agent[] = Object.entries(data).map(([id, val]: [string, any]) => ({
                    id,
                    ...val
                }));
                setAgents(agentsList);
            } else {
                setAgents([]);
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

    return (
        <SessionContext.Provider value={{ session, isInitialized, agents, createSession, joinSession, clearSession, checkSessionExists }}>
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
