import { create } from 'zustand';

interface AppState {
    hasLaunched: boolean;
    setHasLaunched: () => void;
}

export const useAppState = create<AppState>((set) => ({
    hasLaunched: false,
    setHasLaunched: () => set({ hasLaunched: true }),
}));
