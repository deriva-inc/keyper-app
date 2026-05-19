'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Group } from '@/lib/types/model';
import { groupProviders, groupCategories } from '@/lib/utils';
import { Badge } from '@/src/components/ui/badge';
import { Text, TextVariant } from '@/src/components/ui/text';

/**
 * This function renders the Group Card to display basic information about a
 * user group on the Groups page.
 *
 * @author Aayush Goyal
 * @created 2026-05-13
 */
export default function GroupCard({
    group,
    index
}: {
    group: Group;
    index: number;
}) {
    // SECTION: Constants and Variables
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
            key={group.id}
            role="button"
            onClick={() => router.push(`/groups/${group.id}`)}
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
                <div className="bg-bg-base-accent-primary rounded-sm p-2">
                    <Image
                        src={
                            group.type === 'category'
                                ? groupCategories.find(
                                      (category) => category.id === group.icon
                                  )?.icon
                                : groupProviders.find(
                                      (provider) => provider.id === group.icon
                                  )?.icon
                        }
                        alt={group.name}
                        height={24}
                        width={24}
                    />
                </div>
                <Badge variant="outline">
                    {group.type.substring(0, 1).toUpperCase() +
                        group.type.substring(1)}
                </Badge>
            </div>
            <div className="flex flex-col gap-1">
                <Text variant={TextVariant.H3} color="text-text-accent-primary">
                    {group.name}
                </Text>
                <Text>{group.description}</Text>
            </div>
            <div className="flex items-center gap-8">
                <div className="flex flex-col gap-0.5">
                    <Text color="text-text-secondary select-none">Entries</Text>
                    <Text className="font-bold select-none">12</Text>
                </div>
            </div>
        </motion.div>
    );
    // !SECTION: UI
}
