import { create } from 'zustand';
import { THEME } from '@/lib/types/model';

/**
 * This file defines a Zustand store for managing user preferences.
 */
interface UIState {
    isUserLoggedIn: boolean;
    theme: THEME;
}

interface UIActions {
    actions: {
        setIsUserLoggedIn: (loggedIn: boolean) => void;
        setTheme: (theme: THEME) => void;
    };
}

const useUIStore = create<UIState & UIActions>((set) => ({
    isUserLoggedIn: false,
    theme: THEME.AMBER,
    actions: {
        setIsUserLoggedIn: (loggedIn: boolean) =>
            set({ isUserLoggedIn: loggedIn }),
        setTheme: (theme: THEME) => set({ theme })
    }
}));

export default useUIStore;
