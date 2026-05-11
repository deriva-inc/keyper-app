import { create } from 'zustand';
import { THEME } from '@/lib/types/model';

/**
 * This file defines a Zustand store for managing user preferences.
 */
interface UIState {
    theme: THEME;
}

interface UIActions {
    actions: {
        setTheme: (theme: THEME) => void;
    };
}

const useUIStore = create<UIState & UIActions>((set) => ({
    theme: THEME.AMBER,
    actions: {
        setTheme: (theme: THEME) => set({ theme })
    }
}));

export default useUIStore;
