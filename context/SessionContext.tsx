import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type MissionSession = {
    code: string;
    role: 'HOST' | 'AGENT';
    createdAt: number;
    threatLevel?: string;
};

type SessionContextType = {
    session: MissionSession | null;
    createSession: (code: string, threatLevel: string) => Promise<void>;
    joinSession: (code: string) => Promise<void>;
    clearSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<MissionSession | null>(null);

    useEffect(() => {
        loadSession();
    }, []);

    const loadSession = async () => {
        try {
            const saved = await AsyncStorage.getItem('incognito_session');
            if (saved) {
                setSession(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load session', e);
        }
    };

    const createSession = async (code: string, threatLevel: string) => {
        const newSession: MissionSession = {
            code,
            role: 'HOST',
            createdAt: Date.now(),
            threatLevel
        };
        setSession(newSession);
        await AsyncStorage.setItem('incognito_session', JSON.stringify(newSession));
    };

    const joinSession = async (code: string) => {
        const newSession: MissionSession = {
            code,
            role: 'AGENT',
            createdAt: Date.now()
        };
        setSession(newSession);
        await AsyncStorage.setItem('incognito_session', JSON.stringify(newSession));
    };

    const clearSession = async () => {
        setSession(null);
        await AsyncStorage.removeItem('incognito_session');
    };

    return (
        <SessionContext.Provider value={{ session, createSession, joinSession, clearSession }}>
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
