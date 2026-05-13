import { create } from 'zustand';
import { THEME, TOP_NAV_LINKS } from '@/lib/types/model';

/**
 * This file defines a Zustand store for managing user preferences.
 */
interface UIState {
    theme: THEME;
    currentPage: TOP_NAV_LINKS | null;
}

interface UIActions {
    actions: {
        setTheme: (theme: THEME) => void;
        setCurrentPage: (page: TOP_NAV_LINKS | null) => void;
    };
}

const useUIStore = create<UIState & UIActions>((set) => ({
    theme: THEME.AMBER,
    currentPage: null,
    actions: {
        setTheme: (theme: THEME) => set({ theme }),
        setCurrentPage: (page: TOP_NAV_LINKS | null) =>
            set({ currentPage: page })
    }
}));

export default useUIStore;
