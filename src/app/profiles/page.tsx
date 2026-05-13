'use client';

import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDataStore } from '@/lib/data-store';
import { TOP_NAV_LINKS } from '@/lib/types/model';
import useUIStore from '@/lib/ui-store';
import CreateNewProfileSheet from '@/src/app/profiles/CreateNewProfileSheet';
import ProfileCard from '@/src/app/profiles/ProfileCard';
import EmptyState from '@/src/components/blocks/empty-state';
import Header from '@/src/components/blocks/header';
import AppSidebar from '@/src/components/ui/app-sidebar';
import { SidebarProvider } from '@/src/components/ui/sidebar';
import { Text, TextVariant } from '@/src/components/ui/text';

/**
 * This function renders the Profiles page of the app.
 *
 * @author Aayush Goyal
 * @created 2026-05-13
 */
export default function ProfilesPage() {
    // SECTION: Constants and Variables
    const actions = useUIStore((state) => state.actions);
    const profiles = useDataStore((state) => state.profiles);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [isCreateNewProfileSheetOpen, setIsCreateNewProfileSheetOpen] =
        useState(false);
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    useEffect(() => {
        actions.setCurrentPage(TOP_NAV_LINKS.PROFILES);
    }, []);
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <div className="min-h-screen transition-colors duration-300">
            <SidebarProvider>
                <AppSidebar />
                <div className="w-full px-8 py-2">
                    <Header />
                    {isEmpty(profiles) ? (
                        <>
                            <EmptyState
                                heading="Oh this is a mixed bag."
                                text="You like to keep things a little unpredictable."
                                primaryButtonOptions={{
                                    text: 'Create New Profile',
                                    onClick: () => {
                                        setIsCreateNewProfileSheetOpen(true);
                                    }
                                }}
                            />
                            <CreateNewProfileSheet
                                isCreateNewProfileSheetOpen={
                                    isCreateNewProfileSheetOpen
                                }
                                setIsCreateNewProfileSheetOpen={
                                    setIsCreateNewProfileSheetOpen
                                }
                                showTrigger={false}
                            />
                        </>
                    ) : (
                        <div className="px-4">
                            <div className="my-8">
                                <Text
                                    variant={TextVariant.H2}
                                    color="text-text-accent-primary"
                                >
                                    Profiles
                                </Text>
                                <Text variant={TextVariant.H5}>Profiles</Text>
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-8">
                                {profiles.map((profile) => (
                                    <ProfileCard
                                        key={profile.id}
                                        profile={profile}
                                    />
                                ))}
                                <CreateNewProfileSheet
                                    isCreateNewProfileSheetOpen={
                                        isCreateNewProfileSheetOpen
                                    }
                                    setIsCreateNewProfileSheetOpen={
                                        setIsCreateNewProfileSheetOpen
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            </SidebarProvider>
        </div>
    );
    // !SECTION: UI
}
