import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
    soundEnabled: boolean;
    musicEnabled: boolean;
    hapticsEnabled: boolean;
    language: 'fr' | 'en';
    toggleSound: () => void;
    toggleMusic: () => void;
    toggleHaptics: () => void;
    setLanguage: (lang: 'fr' | 'en') => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            soundEnabled: true,
            musicEnabled: true,
            hapticsEnabled: true,
            language: 'fr',
            toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
            toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
            toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
            setLanguage: (lang) => set({ language: lang }),
        }),
        {
            name: 'incognito-settings',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
