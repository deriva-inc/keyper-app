import { create } from 'zustand';
import { Profile, User } from '@/lib/types/model';

/**
 * This file defines a Zustand store for managing user data across the application.
 */
interface State {
    isUserLoggedIn: boolean;
    activeProfile: Profile | null;
    profiles: Profile[];
    userDetails: Omit<User, 'authHash' | 'recoveryKey' | 'salt'> | null;
}

interface Actions {
    actions: {
        setIsUserLoggedIn: (loggedIn: boolean) => void;
        setActiveProfile: (profile: Profile | null) => void;
        setProfiles: (profiles: Profile[]) => void;
        setUserDetails: (
            userDetails: Omit<User, 'authHash' | 'recoveryKey' | 'salt'> | null
        ) => void;
    };
}

export const useDataStore = create<State & Actions>((set) => ({
    isUserLoggedIn: false,
    activeProfile: null,
    profiles: [],
    userDetails: null,
    actions: {
        setIsUserLoggedIn: (loggedIn: boolean) =>
            set({ isUserLoggedIn: loggedIn }),
        setActiveProfile: (profile: Profile | null) =>
            set({ activeProfile: profile }),
        setProfiles: (profiles: Profile[]) => set({ profiles }),
        setUserDetails: (
            userDetails: Omit<User, 'authHash' | 'recoveryKey' | 'salt'> | null
        ) => set({ userDetails })
    }
}));
