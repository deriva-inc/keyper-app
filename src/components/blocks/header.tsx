'use client';

import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import { THEME } from '@/lib/types/model';
import useUIStore from '@/lib/ui-store';
import { profileIcons } from '@/lib/utils';
import { Search } from 'elementa-icons';
import {
    EnergySwitcher,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Text,
    ThemeSwitcher
} from 'get-elementa-ui';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * This function renders the Header component of the app.
 *
 * @author Aayush Goyal
 * @created 2026-11-12
 */
export default function Header() {
    // SECTION: Constants and Variables
    const theme = useUIStore((state) => state.theme);
    const actions = useUIStore((state) => state.actions);
    const activeProfile = useDataStore((state) => state.activeProfile);
    const profiles = useDataStore((state) => state.profiles);
    const dataActions = useDataStore((state) => state.actions);
    // !SECTION: Constants and Variables

    // SECTION: States
    // !SECTION: States

    // SECTION: API Queries
    /**
     * This function fetches the user profiles from the server and updates the data store.
     */
    const fetchUserProfiles = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');

            const userProfilesRes = await fetch('/api/profiles', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`
                }
            });

            if (userProfilesRes.ok) {
                const profilesData = await userProfilesRes.json();
                dataActions.setProfiles(profilesData.data);
                if (!activeProfile) {
                    dataActions.setActiveProfile(profilesData.data[0] || null);
                }
            } else {
                toast.error('Failed to fetch user profiles. Please try again.');
                logger.error('Failed to fetch user profiles.');
            }
        } catch (error: any) {
            toast.error(
                'Something went wrong while fetching user profiles. Please try again.'
            );
            logger.error('Error while fetching user profiles: ', error);
        }
    };
    // !SECTION API Queries

    // SECTION: Event Handlers
    /**
     * This function handles the logic for setting the active profile based on the selected profile ID.
     *
     * @param profileId - The ID of the profile to be set as active
     */
    const handleSetActiveProfile = (profileId: string): void => {
        const selectedProfile =
            profiles.find((profile) => profile.id === profileId) || null;
        dataActions.setActiveProfile(selectedProfile);
    };
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    useEffect(() => {
        if (!activeProfile) {
            fetchUserProfiles();
        }
    }, []);
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <header className="bg-bg-flat-primary sticky top-0 z-10 flex items-center justify-between px-8 py-3 shadow-sm">
            <InputGroup className="max-w-md">
                <InputGroupInput
                    id="inline-start-input"
                    placeholder="Search..."
                    className=""
                />
                <InputGroupAddon align="inline-start">
                    <Search className="text-muted-foreground" />
                </InputGroupAddon>
            </InputGroup>
            <div className="flex items-center gap-4">
                {!isEmpty(profiles) && (
                    <Select
                        value={
                            activeProfile ? activeProfile.id : profiles[0].id
                        }
                        onValueChange={(value) => handleSetActiveProfile(value)}
                    >
                        <SelectTrigger className="border-stroke-active-primary">
                            <SelectValue placeholder="Select Profile" />
                        </SelectTrigger>
                        <SelectContent>
                            {profiles.map((profile) => (
                                <SelectItem
                                    key={profile.id}
                                    value={profile.id}
                                    className="my-2 flex items-center gap-2 px-2 py-1"
                                >
                                    {(() => {
                                        const iconObj = profileIcons.find(
                                            (icon) => icon.id === profile.icon
                                        );
                                        if (iconObj && iconObj.icon) {
                                            const IconComponent = iconObj.icon;
                                            return (
                                                <IconComponent
                                                    height={20}
                                                    width={20}
                                                    stroke={0}
                                                    className="text-text-primary mr-2"
                                                />
                                            );
                                        }
                                        return null;
                                    })()}
                                    <Text>{profile.name}</Text>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                <EnergySwitcher />
                <ThemeSwitcher
                    onThemeChange={(newTheme) => {
                        actions.setTheme(
                            newTheme === 'dark' ? THEME.GUN_METAL : THEME.AMBER
                        );
                    }}
                />
            </div>
        </header>
    );
    // !SECTION: UI
}
