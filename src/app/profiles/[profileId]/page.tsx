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
import {
    entryTypeIcons,
    formatKey,
    groupCategories,
    groupProviders,
    profileIcons
} from '@/lib/utils';
import { Group, Profile, TOP_NAV_LINKS, VaultEntry } from '@/lib/types/model';
import DeleteProfileDialog from '@/src/app/profiles/[profileId]/DeleteProfileDialog';
import UpdateProfileDetailsSheet from '@/src/app/profiles/[profileId]/UpdateProfileDetailsSheet';
import Header from '@/src/components/blocks/header';
import { Badge } from '@/src/components/ui/badge';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from '@/src/components/ui/breadcrumb';
import { Button } from '@/src/components/ui/button';
import AppSidebar from '@/src/components/ui/app-sidebar';
import { SidebarProvider } from '@/src/components/ui/sidebar';
import { Text, TextVariant } from '@/src/components/ui/text';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/src/components/ui/tooltip';

/**
 * This function renders the SingleProfilePage component which shows the details of a profile.
 *
 * @author Aayush Goyal
 * @created 2026-05-19
 */
export default function SingleProfilePage() {
    // SECTION: Constants and Variables
    const pathname = usePathname();
    const router = useRouter();
    const actions = useUIStore((state) => state.actions);
    const dataActions = useDataStore((state) => state.actions);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [profileDetails, setProfileDetails] = useState<Profile | null>(null);
    const [profileGroups, setProfileGroups] = useState<Group[]>([]);
    const [profileGroupEntriesCount, setProfileGroupEntriesCount] = useState<
        { groupId: string; entriesCount: number }[]
    >([]);
    const [profileVaultEntries, setProfileVaultEntries] = useState<
        VaultEntry[]
    >([]);
    // !SECTION: States

    // SECTION: API Queries
    /**
     * This function fetches a single profile details from the server.
     *
     * @param profileId - The ID of the profile to fetch details for.
     */
    const fetchProfileDetails = async (profileId: string) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const profileDetailsRes = await fetch(
                `/api/profiles/${profileId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-profile-id': profileId,
                        Authorization: `Bearer ${jwtToken}`
                    }
                }
            );

            if (profileDetailsRes.ok) {
                const profileDetailsData = await profileDetailsRes.json();
                setProfileDetails(profileDetailsData.data);
            } else {
                toast.error(
                    'Failed to fetch profile details. Please try again.'
                );
                logger.error('Failed to fetch profile details.');
                router.push('/profiles');
            }
        } catch (error: any) {
            logger.error('Error fetching profile details:', error);
            toast.error('Failed to fetch profile details. Please try again.');
            router.push('/profiles');
        }
    };

    /**
     * This function fetches the vault groups for the profile.
     *
     * @param profileId - The ID of the profile to fetch vault groups for.
     */
    const fetchProfileGroups = async (profileId: string): Promise<void> => {
        try {
            const entriesRes = await fetch(
                `/api/profiles/${profileId}/groups`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('jwtToken') || ''}`,
                        'X-Profile-Id': profileId
                    }
                }
            );

            if (entriesRes.ok) {
                const entriesData = await entriesRes.json();
                setProfileGroups(entriesData.data);
            } else {
                logger.error(
                    'Failed to fetch groups for profile:',
                    await entriesRes.text()
                );
                setProfileGroups([]);
            }
        } catch (error: any) {
            logger.error('Cannot fetch groups for profile:', error);
            setProfileGroups([]);
        }
    };

    /**
     * This function fetches the vault entries for the profile.
     *
     * @param profileId - The ID of the profile to fetch vault entries for.
     */
    const fetchProfileVaultEntries = async (
        profileId: string
    ): Promise<void> => {
        try {
            const entriesRes = await fetch(
                `/api/profiles/${profileId}/entries/`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('jwtToken') || ''}`,
                        'X-Profile-Id': profileId
                    }
                }
            );

            if (entriesRes.ok) {
                const entriesData = await entriesRes.json();
                setProfileVaultEntries(entriesData.data);
            } else {
                logger.error(
                    'Failed to fetch entries for profile:',
                    await entriesRes.text()
                );
                setProfileVaultEntries([]);
            }
        } catch (error: any) {
            logger.error('Cannot fetch entries for profile:', error);
            setProfileVaultEntries([]);
        }
    };

    /**
     * This function fetches the count of entries for each group in the profile.
     */
    const fetchProfileGroupsEntriesCount = async (): Promise<void> => {
        for (const group of profileGroups) {
            setProfileGroupEntriesCount((prev) => {
                if (!prev.find((count) => count.groupId === group.id)) {
                    return [...prev, { groupId: group.id, entriesCount: 0 }];
                }
                return prev;
            });

            try {
                const entriesCountRes = await fetch(
                    `/api/groups/${group.id}/entries/count`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('jwtToken') || ''}`,
                            'X-Group-Id': group.id
                        }
                    }
                );

                if (entriesCountRes.ok) {
                    const entriesCountData = await entriesCountRes.json();
                    setProfileGroupEntriesCount((prev) => {
                        if (prev.find((count) => count.groupId === group.id)) {
                            return prev.map((count) =>
                                count.groupId === group.id
                                    ? {
                                          ...count,
                                          entriesCount: entriesCountData.data
                                      }
                                    : count
                            );
                        }
                    });
                } else {
                    logger.error(
                        'Failed to fetch entries count for group:',
                        await entriesCountRes.text()
                    );
                    setProfileGroupEntriesCount((prev) => {
                        if (prev.find((count) => count.groupId === group.id)) {
                            return [
                                ...prev,
                                { groupId: group.id, entriesCount: 0 }
                            ];
                        }
                        return prev;
                    });
                }
            } catch (error: any) {
                logger.error('Cannot fetch entries count for group:', error);
                setProfileGroupEntriesCount((prev) => [
                    ...prev,
                    { groupId: group.id, entriesCount: 0 }
                ]);
            }
        }
    };
    // !SECTION API Queries

    // SECTION: Event Handlers
    /**
     * This function handles the selection of a user profile by setting it as the active profile in the global state.
     *
     * @param profile - The profile object to set as active. If null, it indicates a failure in selecting the profile.
     */
    const handleSelectProfile = (profile: Profile | null) => {
        if (profile) {
            dataActions.setActiveProfile(profile);
            toast.success(`Profile [${profile.name}] selected successfully!`);
        } else {
            toast.error('Failed to select profile. Please try again.');
        }
    };
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    useEffect(() => {
        actions.setCurrentPage(TOP_NAV_LINKS.PROFILES);

        const profileIdFromPath = pathname.split('/')[2];
        if (profileIdFromPath) {
            fetchProfileDetails(profileIdFromPath);
            fetchProfileGroups(profileIdFromPath);
            fetchProfileVaultEntries(profileIdFromPath);
        } else {
            router.push('/profiles');
        }
    }, [pathname]);

    useEffect(() => {
        if (!isEmpty(profileGroups)) {
            fetchProfileGroupsEntriesCount();
        }
    }, [profileGroups]);
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
                                    <Link href="/profiles">Profiles</Link>
                                </BreadcrumbLink>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    {profileDetails?.name}
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="py-8">
                            {/* Header Section */}
                            <div className="grid grid-cols-[96px_5fr_3fr] items-center justify-between gap-4">
                                {(() => {
                                    const iconObj = profileIcons.find(
                                        (icon) =>
                                            icon.id === profileDetails?.icon
                                    );
                                    if (iconObj && iconObj.icon) {
                                        const IconComponent = iconObj.icon;
                                        return (
                                            <div className="bg-bg-base-accent-primary rounded-sm p-4">
                                                <IconComponent
                                                    height={64}
                                                    width={64}
                                                    stroke={0}
                                                    className="text-text-primary"
                                                />
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                                <div className="">
                                    <Text variant={TextVariant.Caption}>
                                        VAULT PROFILE
                                    </Text>
                                    <Text variant={TextVariant.H2}>
                                        {profileDetails?.name}
                                    </Text>
                                    <Text variant={TextVariant.H5}>
                                        {profileDetails?.description}
                                    </Text>
                                </div>
                                <div className="flex items-center gap-1 justify-self-end">
                                    <Button
                                        onClick={() =>
                                            handleSelectProfile(profileDetails)
                                        }
                                    >
                                        Select Profile
                                    </Button>
                                    {!isEmpty(profileDetails) && (
                                        <UpdateProfileDetailsSheet
                                            profileDetails={profileDetails}
                                            updateProfileDetails={
                                                setProfileDetails
                                            }
                                        />
                                    )}
                                    <DeleteProfileDialog
                                        profileId={profileDetails?.id}
                                    />
                                </div>
                            </div>
                            {/* Groups and Entries */}
                            <div className="my-8 grid grid-cols-2 gap-4">
                                <div className="bg-bg-flat-secondary rounded-sm p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <Text
                                            variant={TextVariant.H4}
                                            color="text-text-accent-primary"
                                        >
                                            Profile Groups
                                        </Text>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                dataActions.setActiveProfile(
                                                    profileDetails
                                                );
                                                router.push('/groups');
                                            }}
                                        >
                                            <Text
                                                variant={TextVariant.H5}
                                                className="underline"
                                            >
                                                {
                                                    profileGroupEntriesCount.length
                                                }{' '}
                                                Groups
                                            </Text>
                                        </Button>
                                    </div>
                                    {profileGroups.map((group) => (
                                        <div className="my-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={
                                                        group.type ===
                                                        'category'
                                                            ? groupCategories.find(
                                                                  (category) =>
                                                                      category.id ===
                                                                      group.icon
                                                              )?.icon
                                                            : groupProviders.find(
                                                                  (provider) =>
                                                                      provider.id ===
                                                                      group.icon
                                                              )?.icon
                                                    }
                                                    alt={group.name}
                                                    height={24}
                                                    width={24}
                                                />
                                                <Text
                                                    variant={TextVariant.Button}
                                                >
                                                    {group.name}
                                                </Text>
                                                <Badge variant="outline">
                                                    {group.type
                                                        .substring(0, 1)
                                                        .toUpperCase() +
                                                        group.type.substring(1)}
                                                </Badge>
                                            </div>
                                            <div className="bg-bg-base-accent-secondary flex h-7 items-center justify-center rounded-full px-4 py-2">
                                                <Text className="font-bold">
                                                    <span className="font-mono">
                                                        {profileGroupEntriesCount.find(
                                                            (count) =>
                                                                count.groupId ===
                                                                group.id
                                                        )?.entriesCount || 0}
                                                    </span>
                                                    <span> entries</span>
                                                </Text>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-bg-flat-secondary rounded-sm p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <Text
                                            variant={TextVariant.H4}
                                            color="text-text-accent-primary"
                                        >
                                            Profile Entries
                                        </Text>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                dataActions.setActiveProfile(
                                                    profileDetails
                                                );
                                                router.push('/vault');
                                            }}
                                        >
                                            <Text
                                                variant={TextVariant.H5}
                                                className="underline"
                                            >
                                                {profileVaultEntries.length}{' '}
                                                Vault Entries
                                            </Text>
                                        </Button>
                                    </div>
                                    {profileVaultEntries.map((entry) => (
                                        <div className="my-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    height={24}
                                                    width={24}
                                                    src={entry.icon}
                                                    alt={entry.name}
                                                />
                                                <Text
                                                    variant={TextVariant.Button}
                                                >
                                                    {entry.name}
                                                </Text>
                                            </div>
                                            {(() => {
                                                const iconObj =
                                                    entryTypeIcons.find(
                                                        (icon) =>
                                                            icon.type ===
                                                            entry.type
                                                    );
                                                if (iconObj && iconObj.icon) {
                                                    const IconComponent =
                                                        iconObj.icon;
                                                    return (
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <div className="bg-bg-base-accent-secondary rounded-sm p-2">
                                                                    <IconComponent
                                                                        height={
                                                                            20
                                                                        }
                                                                        width={
                                                                            20
                                                                        }
                                                                        stroke={
                                                                            0
                                                                        }
                                                                        className="text-text-primary"
                                                                    />
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <Text>
                                                                    {formatKey(
                                                                        entry.type
                                                                    )}
                                                                </Text>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Profile Metadata and Health */}
                            <div className="grid grid-cols-2">
                                {profileDetails && (
                                    <div className="bg-bg-active-fill-accent-primary grid grid-cols-2 gap-y-2 rounded-sm p-4 shadow-sm">
                                        <Text
                                            variant={TextVariant.H4}
                                            className="col-span-2"
                                        >
                                            Profile Metadata
                                        </Text>
                                        <div>
                                            <Text color="text-text-secondary">
                                                Created At
                                            </Text>
                                            <Text variant={TextVariant.Button}>
                                                {format(
                                                    profileDetails.createdAt.toString(),
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
                                                    profileDetails.updatedAt.toString(),
                                                    'PPP'
                                                )}
                                            </Text>
                                        </div>
                                        <div>
                                            <Text color="text-text-secondary">
                                                Profile Id
                                            </Text>
                                            <Text variant={TextVariant.Button}>
                                                {profileDetails.id}
                                            </Text>
                                        </div>
                                    </div>
                                )}
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        </div>
    );
    // !SECTION: UI
}
