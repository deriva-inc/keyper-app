'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import { Profile } from '@/lib/types/model';
import { profileIcons } from '@/lib/utils';
import { Badge } from '@/src/components/ui/badge';
import { Text, TextVariant } from '@/src/components/ui/text';

/**
 * This function renders the Profile Card to display basic information about a
 * user profile on the Profiles page.
 *
 * @author Aayush Goyal
 * @created 2026-05-13
 */
export default function ProfileCard({
    profile,
    index
}: {
    profile: Profile;
    index: number;
}) {
    // SECTION: Constants and Variables
    const activeProfile = useDataStore((state) => state.activeProfile);
    const router = useRouter();
    // !SECTION: Constants and Variables

    // SECTION: States
    const [entriesCount, setEntriesCount] = useState(0);
    const [groupsCount, setGroupsCount] = useState(0);
    // !SECTION: States

    // SECTION: API Queries
    /**
     * This function fetches the groups count for the profile.
     */
    const fetchGroupsCount = async (): Promise<void> => {
        try {
            const groupsCountRes = await fetch(
                `/api/profiles/${profile.id}/groups/count`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('jwtToken') || ''}`,
                        'X-Profile-Id': profile.id
                    }
                }
            );

            if (groupsCountRes.ok) {
                const groupsCountData = await groupsCountRes.json();
                setGroupsCount(groupsCountData.data);
            } else {
                logger.error(
                    'Failed to fetch groups count for profile:',
                    await groupsCountRes.text()
                );
                setGroupsCount(0);
            }
        } catch (error: any) {
            logger.error('Cannot fetch groups count for profile:', error);
            setGroupsCount(0);
        }
    };

    /**
     * This function fetches the vault entries count for the profile.
     */
    const fetchEntriesCount = async (): Promise<void> => {
        try {
            const entriesCountRes = await fetch(
                `/api/profiles/${profile.id}/entries/count`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('jwtToken') || ''}`,
                        'X-Profile-Id': profile.id
                    }
                }
            );

            if (entriesCountRes.ok) {
                const entriesCountData = await entriesCountRes.json();
                setEntriesCount(entriesCountData.data);
            } else {
                logger.error(
                    'Failed to fetch entries count for profile:',
                    await entriesCountRes.text()
                );
                setEntriesCount(0);
            }
        } catch (error: any) {
            logger.error('Cannot fetch entries count for profile:', error);
            setEntriesCount(0);
        }
    };
    // !SECTION API Queries

    // SECTION: Event Handlers
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    useEffect(() => {
        fetchGroupsCount();
        fetchEntriesCount();
    });
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <motion.div
            className="bg-bg-flat-primary flex min-h-72 w-80 cursor-pointer flex-col gap-6 rounded-md border px-6 py-8 shadow-md active:scale-95"
            key={profile.id}
            role="button"
            onClick={() => router.push(`/profiles/${profile.id}`)}
            initial={{ scale: 1, y: 20, opacity: 0 }}
            animate={{
                scale: 1,
                y: 0,
                opacity: 1,
                transition: { duration: 0.3, delay: index * 0.1 }
            }}
            whileHover={{ scale: 1.05 }}
        >
            <div className="flex items-center gap-4">
                {(() => {
                    const iconObj = profileIcons.find(
                        (icon) => icon.id === profile.icon
                    );
                    if (iconObj && iconObj.icon) {
                        const IconComponent = iconObj.icon;
                        return (
                            <div className="bg-bg-base-accent-primary rounded-sm p-2">
                                <IconComponent
                                    height={20}
                                    width={20}
                                    stroke={0}
                                    className="text-text-primary"
                                />
                            </div>
                        );
                    }
                    return null;
                })()}
                {activeProfile && activeProfile.id === profile.id && (
                    <motion.div
                        initial={{ opacity: 0, x: 4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Badge className="bg-bg-base-accent-secondary">
                            Active
                        </Badge>
                    </motion.div>
                )}
                {profile.isArchived && (
                    <motion.div
                        initial={{ opacity: 0, x: 4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Badge variant="warning">Archived</Badge>
                    </motion.div>
                )}
            </div>
            <div className="flex flex-col gap-1">
                <Text variant={TextVariant.H3} color="text-text-accent-primary">
                    {profile.name}
                </Text>
                <Text>{profile.description}</Text>
            </div>
            <div className="flex items-center gap-8">
                <div className="flex flex-col gap-0.5">
                    <Text color="text-text-secondary select-none">Groups</Text>
                    <Text className="font-bold select-none">{groupsCount}</Text>
                </div>
                <div className="flex flex-col gap-0.5">
                    <Text color="text-text-secondary select-none">Entries</Text>
                    <Text className="font-bold select-none">
                        {entriesCount}
                    </Text>
                </div>
            </div>
        </motion.div>
    );
    // !SECTION: UI
}
