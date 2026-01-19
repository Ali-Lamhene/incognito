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
    isInitialized: boolean;
    createSession: (code: string, threatLevel: string) => Promise<void>;
    joinSession: (code: string) => Promise<boolean>;
    clearSession: () => Promise<void>;
    checkSessionExists: (code: string) => Promise<boolean>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<MissionSession | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        loadSession();
    }, []);

    const loadSession = async () => {
        try {
            const saved = await AsyncStorage.getItem('incognito_session');
            if (saved) {
                setSession(JSON.parse(saved));
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
        setSession(newSession);
        await AsyncStorage.setItem('incognito_session', JSON.stringify(newSession));

        // Mock Global Registry: Add to active missions
        const activeMissionsStr = await AsyncStorage.getItem('incognito_active_missions');
        const activeMissions = activeMissionsStr ? JSON.parse(activeMissionsStr) : [];
        if (!activeMissions.includes(code)) {
            activeMissions.push(code);
            await AsyncStorage.setItem('incognito_active_missions', JSON.stringify(activeMissions));
        }
    };

    const checkSessionExists = async (code: string): Promise<boolean> => {
        const activeMissionsStr = await AsyncStorage.getItem('incognito_active_missions');
        if (!activeMissionsStr) return false;
        const activeMissions: string[] = JSON.parse(activeMissionsStr);
        return activeMissions.includes(code.toUpperCase());
    };

    const joinSession = async (code: string): Promise<boolean> => {
        const normalizedCode = code.toUpperCase();

        // Safety: If already HOST for this code, don't downgrade to AGENT
        if (session && session.code === normalizedCode && session.role === 'HOST') {
            return true;
        }

        // Check if mission exists in registry
        const exists = await checkSessionExists(normalizedCode);
        if (!exists) {
            return false;
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

    const clearSession = async () => {
        if (session?.role === 'HOST') {
            // Remove from global registry if host destroys it
            const activeMissionsStr = await AsyncStorage.getItem('incognito_active_missions');
            if (activeMissionsStr) {
                const activeMissions: string[] = JSON.parse(activeMissionsStr);
                const updated = activeMissions.filter(c => c !== session.code);
                await AsyncStorage.setItem('incognito_active_missions', JSON.stringify(updated));
            }
        }
        setSession(null);
        await AsyncStorage.removeItem('incognito_session');
    };

    return (
        <SessionContext.Provider value={{ session, isInitialized, createSession, joinSession, clearSession, checkSessionExists }}>
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
