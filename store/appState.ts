import { create } from 'zustand';

interface AppState {
    hasLaunched: boolean;
    setHasLaunched: () => void;
    showProfileModal: boolean;
    setShowProfileModal: (show: boolean) => void;
}

export const useAppState = create<AppState>((set) => ({
    hasLaunched: false,
    setHasLaunched: () => set({ hasLaunched: true }),
    showProfileModal: false,
    setShowProfileModal: (show) => set({ showProfileModal: show }),
}));
