import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
    hapticsEnabled: boolean;
    language: 'fr' | 'en';
    toggleHaptics: () => void;
    setLanguage: (lang: 'fr' | 'en') => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            hapticsEnabled: true,
            language: 'fr',
            toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
            setLanguage: (lang) => set({ language: lang }),
        }),
        {
            name: 'incognito-settings',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
