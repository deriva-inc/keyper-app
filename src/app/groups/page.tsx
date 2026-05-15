'use client';

import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import { TOP_NAV_LINKS } from '@/lib/types/model';
import useUIStore from '@/lib/ui-store';
import CreateNewGroupSheet from '@/src/app/groups/CreateNewGroupSheet';
import GroupCard from '@/src/app/groups/GroupCard';
import Header from '@/src/components/blocks/header';
import AppSidebar from '@/src/components/ui/app-sidebar';
import { SidebarProvider } from '@/src/components/ui/sidebar';
import EmptyState from '@/src/components/blocks/empty-state';

/**
 * This function renders the Groups page on the app.
 *
 * @author Aayush Goyal
 * @created 2026-05-13
 */
export default function GroupsPage() {
    // SECTION: Constants and Variables
    const actions = useUIStore((state) => state.actions);
    const dataActions = useDataStore((state) => state.actions);
    const activeProfile = useDataStore((state) => state.activeProfile);
    const groups = useDataStore((state) => state.groups);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [isCreateNewGroupSheetOpen, setIsCreateNewGroupSheetOpen] =
        useState(false);
    // !SECTION: States

    // SECTION: API Queries
    /**
     * This function fetches the groups for a given user profile from the server.
     *
     * @param profileId - The ID of the profile for which to fetch groups.
     */
    const fetchGroupsForProfile = async (profileId: string) => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const groupsRes = await fetch(`/api/groups`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                    'x-profile-id': profileId
                }
            });

            const groupsData = await groupsRes.json();
            if (groupsRes.ok) {
                dataActions.setGroups(groupsData.data);
            } else {
                toast.error('Failed to fetch groups. Please try again.');
                logger.error('Failed to fetch groups.');
            }
        } catch (error) {
            toast.error('Failed to fetch groups. Please try again.');
            logger.error('Error fetching groups:', error);
        }
    };
    // !SECTION API Queries

    // SECTION: Event Handlers
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    useEffect(() => {
        if (isEmpty(groups)) {
            actions.setCurrentPage(TOP_NAV_LINKS.GROUPS);

            if (activeProfile) {
                fetchGroupsForProfile(activeProfile.id);
            } else {
                toast.info(
                    'No active profile found. Please select one from top nav bar.'
                );
            }
        }
    }, [activeProfile]);

    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <div className="min-h-screen transition-colors duration-300">
            <SidebarProvider>
                <AppSidebar />
                <div className="w-full px-4 py-2">
                    <Header />
                    {isEmpty(groups) ? (
                        <>
                            <EmptyState
                                heading="Things are empty here!"
                                text="There are no active groups in this profile. Start by creating one."
                                primaryButtonOptions={{
                                    text: 'Create New Group',
                                    onClick: () => {
                                        setIsCreateNewGroupSheetOpen(true);
                                    }
                                }}
                            />
                            <CreateNewGroupSheet
                                isCreateNewGroupSheetOpen={
                                    isCreateNewGroupSheetOpen
                                }
                                setIsCreateNewGroupSheetOpen={
                                    setIsCreateNewGroupSheetOpen
                                }
                                showTrigger={false}
                            />
                        </>
                    ) : (
                        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center justify-items-center gap-8">
                            {groups.map((group) => (
                                <GroupCard key={group.id} group={group} />
                            ))}
                            <CreateNewGroupSheet
                                isCreateNewGroupSheetOpen={
                                    isCreateNewGroupSheetOpen
                                }
                                setIsCreateNewGroupSheetOpen={
                                    setIsCreateNewGroupSheetOpen
                                }
                            />
                        </div>
                    )}
                </div>
            </SidebarProvider>
        </div>
    );
    // !SECTION: UI
}
