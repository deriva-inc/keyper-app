'use client';

import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import useUIStore from '@/lib/ui-store';
import { groupCategories, groupProviders } from '@/lib/utils';
import { Group, TOP_NAV_LINKS, VaultEntry } from '@/lib/types/model';
import DeleteGroupDialog from '@/src/app/groups/[groupId]/DeleteGroupDialog';
import GroupDetailsEntryCard from '@/src/app/groups/[groupId]/GroupDetailsEntryCard';
import UpdateGroupDetailsSheet from '@/src/app/groups/[groupId]/UpdateGroupDetailsSheet';
import Header from '@/src/components/blocks/header';
import { Badge } from '@/src/components/ui/badge';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from '@/src/components/ui/breadcrumb';
import AppSidebar from '@/src/components/ui/app-sidebar';
import { SidebarProvider } from '@/src/components/ui/sidebar';
import { Text, TextVariant } from '@/src/components/ui/text';

/**
 * This function renders the GroupDetailsPage component which shows the details of a group.
 *
 * @author Aayush Goyal
 * @created 2026-05-26
 */
export default function GroupDetailsPage() {
    // SECTION: Constants and Variables
    const pathname = usePathname();
    const router = useRouter();
    const actions = useUIStore((state) => state.actions);
    const profiles = useDataStore((state) => state.profiles);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [groupDetails, setGroupDetails] = useState<Group>(null);
    const [groupEntries, setGroupEntries] = useState<VaultEntry[]>([]);
    // !SECTION: States

    // SECTION: API Queries
    /**
     * This function fetches a single group details from the server.
     *
     * @param groupId - The ID of the group to fetch details for.
     */
    const fetchGroupDetails = async (groupId: string) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const groupDetailsRes = await fetch(`/api/groups/${groupId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-group-id': groupId,
                    Authorization: `Bearer ${jwtToken}`
                }
            });

            if (groupDetailsRes.ok) {
                const groupDetailsData = await groupDetailsRes.json();
                setGroupDetails(groupDetailsData.data);
            } else {
                toast.error('Failed to fetch group details. Please try again.');
                logger.error('Failed to fetch group details.');
                router.push('/groups');
            }
        } catch (error: any) {
            logger.error('Error fetching group details:', error);
            toast.error('Failed to fetch group details. Please try again.');
            router.push('/groups');
        }
    };

    /**
     * This function fetches the vault entries under a group.
     *
     * @param groupId - The ID of the group to fetch entries for.
     */
    const fetchGroupEntries = async (groupId: string) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const groupEntriesRes = await fetch(
                `/api/groups/${groupId}/entries`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`,
                        'x-group-id': groupId
                    }
                }
            );

            if (groupEntriesRes.ok) {
                const groupEntriesData = await groupEntriesRes.json();
                setGroupEntries(groupEntriesData.data);
            } else {
                toast.error('Failed to fetch group entries. Please try again.');
                logger.error('Failed to fetch group entries.');
            }
        } catch (error: any) {
            logger.error('Error fetching group entries:', error);
            toast.error('Failed to fetch group entries. Please try again.');
            router.push('/groups');
        }
    };
    // !SECTION API Queries

    // SECTION: Event Handlers
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    useEffect(() => {
        actions.setCurrentPage(TOP_NAV_LINKS.GROUPS);
    }, []);

    useEffect(() => {
        const groupId = pathname.split('/')[2];
        if (groupId) {
            fetchGroupDetails(groupId);
            fetchGroupEntries(groupId);
        } else {
            router.push('/groups');
        }
    }, [pathname]);
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <div className="min-h-screen transition-colors duration-300">
            <SidebarProvider>
                <AppSidebar />
                <div className="w-full pb-2">
                    <Header />
                    <div className="px-8">
                        <Breadcrumb className="mt-4">
                            <BreadcrumbList>
                                <BreadcrumbLink>
                                    <Link href="/groups">Groups</Link>
                                </BreadcrumbLink>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    {groupDetails?.name}
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="py-8">
                            {/* Header Section */}
                            <div className="grid grid-cols-[96px_5fr_3fr] items-center justify-between gap-4">
                                <div className="bg-bg-base-accent-primary rounded-md p-4">
                                    <Image
                                        src={
                                            groupDetails?.type === 'category'
                                                ? groupCategories.find(
                                                      (category) =>
                                                          category.id ===
                                                          groupDetails?.icon
                                                  )?.icon
                                                : groupProviders.find(
                                                      (provider) =>
                                                          provider.id ===
                                                          groupDetails?.icon
                                                  )?.icon
                                        }
                                        alt={groupDetails?.name}
                                        height={64}
                                        width={64}
                                    />
                                </div>
                                <div className="">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="bg-bg-base-accent-secondary"
                                        >
                                            {groupDetails?.type
                                                .substring(0, 1)
                                                .toUpperCase() +
                                                groupDetails?.type.substring(1)}
                                        </Badge>
                                        {groupDetails?.isArchived && (
                                            <Badge variant="warning">
                                                Archived
                                            </Badge>
                                        )}
                                    </div>
                                    <Text variant={TextVariant.H2}>
                                        {groupDetails?.name}
                                    </Text>
                                    <Text variant={TextVariant.H5}>
                                        {groupDetails?.description}
                                    </Text>
                                </div>
                                {!isEmpty(groupDetails) && (
                                    <div className="flex items-center gap-2 justify-self-end">
                                        <UpdateGroupDetailsSheet
                                            groupDetails={groupDetails}
                                            updateGroupDetails={setGroupDetails}
                                        />
                                        <DeleteGroupDialog
                                            groupDetails={groupDetails}
                                        />
                                    </div>
                                )}
                            </div>
                            {groupDetails && (
                                <div className="bg-bg-active-fill-accent-primary mt-4 grid grid-cols-[1fr_1fr_2fr_1fr] gap-y-2 rounded-md p-4 shadow-sm">
                                    <Text
                                        variant={TextVariant.H4}
                                        className="col-span-4"
                                    >
                                        Group Metadata
                                    </Text>
                                    <div>
                                        <Text color="text-text-secondary">
                                            Created At
                                        </Text>
                                        <Text variant={TextVariant.Button}>
                                            {format(
                                                groupDetails.createdAt.toString(),
                                                'PPP'
                                            )}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text color="text-text-secondary">
                                            Updated At
                                        </Text>
                                        <Text variant={TextVariant.Button}>
                                            {format(
                                                groupDetails.updatedAt.toString(),
                                                'PPP'
                                            )}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text color="text-text-secondary">
                                            Group Id
                                        </Text>
                                        <Text variant={TextVariant.Button}>
                                            {groupDetails.id}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text color="text-text-secondary">
                                            Profile Name
                                        </Text>
                                        <Text variant={TextVariant.Button}>
                                            {profiles.find(
                                                (profile) =>
                                                    profile.id ===
                                                    groupDetails.profileId
                                            )?.name || 'N/A'}
                                        </Text>
                                    </div>
                                </div>
                            )}

                            {/* Entry Cards */}
                            <div className="my-8 grid gap-4 lg:grid-cols-3 xl:grid-cols-4">
                                {groupEntries.map((groupEntry, idx: number) => (
                                    <GroupDetailsEntryCard
                                        key={groupEntry.id}
                                        groupEntry={groupEntry}
                                        index={idx}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        </div>
    );
    // !SECTION: UI
}
