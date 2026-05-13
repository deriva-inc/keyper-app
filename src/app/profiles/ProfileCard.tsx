'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useDataStore } from '@/lib/data-store';
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
export default function ProfileCard({ profile }: { profile: Profile }) {
    // SECTION: Constants and Variables
    const activeProfile = useDataStore((state) => state.activeProfile);
    const router = useRouter();
    // !SECTION: Constants and Variables

    // SECTION: States
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <motion.div
            className="bg-bg-flat-primary flex min-h-64 w-80 cursor-pointer flex-col gap-6 rounded-md border px-6 py-8 shadow-md active:scale-95"
            key={profile.id}
            role="button"
            onClick={() => router.push(`/profiles/${profile.id}`)}
            initial={{ scale: 1 }}
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
                    <Text className="font-bold select-none">12</Text>
                </div>
                <div className="flex flex-col gap-0.5">
                    <Text color="text-text-secondary select-none">Entries</Text>
                    <Text className="font-bold select-none">12</Text>
                </div>
            </div>
        </motion.div>
    );
    // !SECTION: UI
}
