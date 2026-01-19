import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    notificationsEnabled: boolean;
    language: 'fr' | 'en';
    toggleSound: () => void;
    toggleHaptics: () => void;
    toggleNotifications: () => void;
    setLanguage: (lang: 'fr' | 'en') => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            soundEnabled: true,
            hapticsEnabled: true,
            notificationsEnabled: true,
            language: 'fr',
            toggleSound: () => set((state: { soundEnabled: any; }) => ({ soundEnabled: !state.soundEnabled })),
            toggleHaptics: () => set((state: { hapticsEnabled: any; }) => ({ hapticsEnabled: !state.hapticsEnabled })),
            toggleNotifications: () => set((state: { notificationsEnabled: any; }) => ({ notificationsEnabled: !state.notificationsEnabled })),
            setLanguage: (lang) => set({ language: lang }),
        }),
        {
            name: 'incognito-settings',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
