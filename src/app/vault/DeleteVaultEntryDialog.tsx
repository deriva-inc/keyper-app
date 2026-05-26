'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import logger from '@/lib/logger';
import { Button } from '@/src/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/src/components/ui/dialog';
import { Text } from '@/src/components/ui/text';
import { VaultEntry } from '@/lib/types/model';
import { Input } from '@/src/components/ui/input';

/**
 * This function renders the DeleteVaultEntryDialog component to delete a vault entry.
 *
 * @author Aayush Goyal
 * @created 2026-05-27
 */
export default function DeleteVaultEntryDialog({
    vaultEntry,
    setIsVaultEntryDetailsSheetOpen
}: {
    vaultEntry: VaultEntry;
    setIsVaultEntryDetailsSheetOpen: (open: boolean) => void;
}) {
    // SECTION: Constants and Variables
    // !SECTION: Constants and Variables

    // SECTION: States
    const [vaultEntryName, setVaultEntryName] = useState<string>('');
    // !SECTION: States

    // SECTION: API Queries
    const handleDeleteVaultEntry = async (): Promise<void> => {
        try {
            const deleteEntryRes = await fetch(
                `/api/entries/${vaultEntry.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('jwtToken') || ''}`,
                        'x-profile-id': vaultEntry.profileId || '',
                        'x-entry-id': vaultEntry.id
                    }
                }
            );

            if (deleteEntryRes.ok) {
                toast.success('Vault entry deleted successfully');
                setIsVaultEntryDetailsSheetOpen(false);
            } else {
                logger.error(
                    'Failed to delete vault entry:',
                    await deleteEntryRes.text()
                );
                toast.error('Failed to delete vault entry. Please try again.');
            }
        } catch (error: any) {
            logger.error('Error deleting vault entry:', error);
            toast.error('Failed to delete vault entry. Please try again.');
        }
    };
    // !SECTION API Queries

    // SECTION: Event Handlers
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Vault Entry</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this vault entry? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Text>
                        Please enter the vault entry name{' '}
                        <span className="font-code font-bold">
                            [{vaultEntry.name}]
                        </span>{' '}
                        in the input field below to confirm deletion.
                    </Text>
                    <Input
                        className="mt-2"
                        id="input-profile-name"
                        type="text"
                        onChange={(e) => setVaultEntryName(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>Cancel</DialogClose>
                    <Button
                        disabled={vaultEntryName !== vaultEntry.name}
                        variant="destructive"
                        onClick={() => handleDeleteVaultEntry()}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
    // !SECTION: UI
}
