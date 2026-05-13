'use client';

import { Search } from 'elementa-icons';
import { isEmpty } from 'lodash';
import { Moon, Sun } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ButtonGroup } from '@/src/components/ui/button-group';
import { Button } from '@/src/components/ui/button';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from '@/src/components/ui/input-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/src/components/ui/select';
import { Text, TextVariant } from '@/src/components/ui/text';
import { useDataStore } from '@/lib/data-store';
import { handleThemeChange } from '@/lib/ui';
import useUIStore from '@/lib/ui-store';
import { THEME, TOP_NAV_LINKS } from '@/lib/types/model';
import { toast } from 'sonner';
import logger from '@/lib/logger';
import { profileIcons } from '@/lib/utils';

/**
 * This function renders the Header component of the app.
 *
 * @author Aayush Goyal
 * @created 2026-04-15
 */
export default function Header() {
    // SECTION: Constants and Variables
    const theme = useUIStore((state) => state.theme);
    const currentPage = useUIStore((state) => state.currentPage);
    const actions = useUIStore((state) => state.actions);
    const activeProfile = useDataStore((state) => state.activeProfile);
    const profiles = useDataStore((state) => state.profiles);
    const dataActions = useDataStore((state) => state.actions);
    const params = useSearchParams();
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
        fetchUserProfiles();
        console.log(currentPage);
    }, []);
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <header className="flex items-center justify-between py-2">
            <Text variant={TextVariant.H3} className="text-text-accent-primary">
                {TOP_NAV_LINKS[currentPage]}
            </Text>
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
                        onValueChange={(value) => handleSetActiveProfile(value)}
                    >
                        <SelectTrigger>
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
                <ButtonGroup>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (theme === THEME.GUN_METAL) {
                                handleThemeChange(theme, actions.setTheme);
                            }
                        }}
                        className={
                            theme === THEME.AMBER
                                ? 'bg-bg-active-fill-accent-primary'
                                : ''
                        }
                    >
                        <Sun className="text-text-primary" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (theme === THEME.AMBER) {
                                handleThemeChange(theme, actions.setTheme);
                            }
                        }}
                        className={
                            theme === THEME.GUN_METAL
                                ? 'bg-bg-active-fill-accent-primary'
                                : ''
                        }
                    >
                        <Moon className="text-text-primary" />
                    </Button>
                </ButtonGroup>
            </div>
        </header>
    );
    // !SECTION: UI
}
