'use client';

import { Search } from 'elementa-icons';
import { debounce, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { cryptoService } from '@/lib/crypto';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import { TOP_NAV_LINKS, VaultEntry } from '@/lib/types/model';
import useUIStore from '@/lib/ui-store';
import {
    entryTypeIcons,
    formatKey,
    groupCategories,
    groupProviders
} from '@/lib/utils';
import CreateNewVaultEntrySheet from '@/src/app/vault/CreateNewVaultEntrySheet';
import VaultEntryTableRowItem from '@/src/app/vault/VaultEntryTableRowItem';
import EmptyState from '@/src/components/blocks/empty-state';
import Header from '@/src/components/blocks/header';
import AppSidebar from '@/src/components/ui/app-sidebar';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from '@/src/components/ui/input-group';
import { SidebarProvider } from '@/src/components/ui/sidebar';
import { Text, TextVariant } from '@/src/components/ui/text';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow
} from '@/src/components/ui/table';

/**
 * This function renders the Vault page of the app where all the password entries are listed.
 *
 * @author Aayush Goyal
 * @created 2026-05-27
 */
export default function VaultPage() {
    // SECTION: Constants and Variables
    const activeProfile = useDataStore((state) => state.activeProfile);
    const groups = useDataStore((state) => state.groups);
    const actions = useUIStore((state) => state.actions);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [entries, setEntries] = useState<VaultEntry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<VaultEntry[]>([]);
    const [isCreateNewVaultEntrySheetOpen, setIsCreateNewVaultEntrySheetOpen] =
        useState<boolean>(false);
    // !SECTION: States

    // SECTION: API Queries
    const fetchProfileEntries = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const response = await fetch('/api/entries', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                    'X-Profile-Id': activeProfile?.id || ''
                }
            });
            const data = await response.json();
            setEntries(data.data);
            setFilteredEntries(data.data);
        } catch (error) {
            logger.error('Error fetching entries:', error);
            toast.error('Failed to fetch entries. Please try again.');
        }
    };
    // !SECTION API Queries

    // SECTION: Event Handlers
    const handleEntrySearch = (): void => {
        const searchTerm = (
            document.getElementById('input-entry-search') as HTMLInputElement
        ).value.toLowerCase();
        setFilteredEntries(
            entries.filter((entry) =>
                entry.name.toLowerCase().includes(searchTerm)
            )
        );
    };
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    useEffect(() => {
        actions.setCurrentPage(TOP_NAV_LINKS.VAULT);
        if (activeProfile) {
            fetchProfileEntries();
        }
    }, [activeProfile]);
    // !SECTION: Side Effects

    // SECTION: Helpers
    /**
     * Resolves a group's display icon URL from its ID.
     */
    const getGroupIconUrl = (groupId?: string): string | undefined => {
        if (!groupId) return undefined;
        const group = groups.find((g) => g.id === groupId);
        if (!group) return undefined;
        return group.type === 'category'
            ? groupCategories.find((c) => c.id === group.icon)?.icon
            : groupProviders.find((p) => p.id === group.icon)?.icon;
    };
    // !SECTION: Helpers

    // SECTION: UI
    return (
        <div className="min-h-screen transition-colors duration-300">
            <SidebarProvider>
                <AppSidebar />
                <div className="w-full overflow-y-scroll pb-8">
                    <Header />
                    <div className="px-8">
                        {/* Page Header */}
                        <div className="my-8 flex items-center justify-between">
                            <div>
                                <Text
                                    variant={TextVariant.H2}
                                    color="text-text-accent-primary"
                                >
                                    Vault Entries
                                </Text>
                                <Text
                                    variant={TextVariant.H5}
                                    color="text-text-secondary"
                                >
                                    {filteredEntries.length} entr
                                    {filteredEntries.length === 1 ? 'y' : 'ies'}
                                </Text>
                            </div>
                            <div className="flex items-center gap-4">
                                <InputGroup className="max-w-md">
                                    <InputGroupInput
                                        id="input-entry-search"
                                        placeholder="Search entries..."
                                        onChange={debounce(
                                            () => handleEntrySearch(),
                                            300
                                        )}
                                    />
                                    <InputGroupAddon align="inline-start">
                                        <Search className="text-muted-foreground" />
                                    </InputGroupAddon>
                                </InputGroup>
                                <CreateNewVaultEntrySheet
                                    isCreateNewVaultEntrySheetOpen={
                                        isCreateNewVaultEntrySheetOpen
                                    }
                                    setIsCreateNewVaultEntrySheetOpen={
                                        setIsCreateNewVaultEntrySheetOpen
                                    }
                                />
                            </div>
                        </div>

                        {isEmpty(filteredEntries) ? (
                            <EmptyState
                                heading="No Entries"
                                text="You have no entries yet in this profile."
                                primaryButtonOptions={{
                                    text: 'Create New Entry',
                                    onClick: () =>
                                        setIsCreateNewVaultEntrySheetOpen(true)
                                }}
                            />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {/* Col 1: Icon + Name + Type */}
                                        <TableHead className="min-w-50 pl-4">
                                            Entry
                                        </TableHead>
                                        {/* Col 2: Password */}
                                        <TableHead className="min-w-40">
                                            Password
                                        </TableHead>
                                        {/* Col 3: Group */}
                                        <TableHead className="min-w-40">
                                            Group
                                        </TableHead>
                                        {/* Col 4: Updated At + Website URL */}
                                        <TableHead className="min-w-40">
                                            Updated At
                                        </TableHead>
                                        {/* Col 5: isFav + isArch flags + delete */}
                                        <TableHead className="min-w-60 pr-4 text-right">
                                            Details
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEntries.map((entry) => {
                                        const typeIconObj = entryTypeIcons.find(
                                            (i) => i.type === entry.type
                                        );
                                        const TypeIconComponent =
                                            typeIconObj?.icon;
                                        const groupName = groups.find(
                                            (g) => g.id === entry.groupId
                                        )?.name;
                                        const groupIconUrl = getGroupIconUrl(
                                            entry.groupId
                                        );

                                        return (
                                            <VaultEntryTableRowItem
                                                key={entry.id}
                                                entry={entry}
                                                groupName={groupName}
                                                groupIconUrl={groupIconUrl}
                                                TypeIconComponent={
                                                    TypeIconComponent
                                                }
                                            />
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
            </SidebarProvider>
        </div>
    );
    // !SECTION: UI
}
