import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface AgentProfile {
    id: string;
    codename: string; // e.g., 'Viper', 'Ghost'
    avatar: string; // Icon name e.g. 'skull-outline'
    role: 'OPERATIVE' | 'COMMANDER'; // Flavor text mainly
    themeColor: string; // Hex code for avatar
    stats: {
        missionsCompleted: number;
        missionsWon: number;
        timeInField: number; // minutes
    };
}

interface ProfileState {
    profile: AgentProfile | null;
    isFirstSetupDone: boolean;
    createProfile: (codename: string, avatar: string, color: string) => void;
    updateProfile: (updates: Partial<AgentProfile>) => void;
}

const DEFAULT_COLORS = ['#0D9488', '#F43F5E', '#Eab308', '#8B5CF6', '#F97316'];

export const useProfileStore = create<ProfileState>()(
    persist(
        (set, get) => ({
            profile: null,
            isFirstSetupDone: false,

            createProfile: (codename, avatar, color) => {
                const uniqueId = `AGENT-${Math.random().toString(36).toUpperCase().substr(2, 6)}`;
                const newProfile: AgentProfile = {
                    id: uniqueId,
                    codename: codename || `RECRUE-${Math.floor(1000 + Math.random() * 9000)}`,
                    avatar: avatar || 'finger-print-outline',
                    role: 'OPERATIVE',
                    themeColor: color || DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)],
                    stats: {
                        missionsCompleted: 0,
                        missionsWon: 0,
                        timeInField: 0,
                    },
                };
                set({ profile: newProfile, isFirstSetupDone: true });
            },

            updateProfile: (updates) => {
                const currentCallback = get().profile;
                if (!currentCallback) return;
                set({ profile: { ...currentCallback, ...updates } });
            },
        }),
        {
            name: 'incognito-agent-profile',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
