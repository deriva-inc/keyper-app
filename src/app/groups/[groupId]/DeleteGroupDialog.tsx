'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import { Group } from '@/lib/types/model';
import { Button } from '@/src/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';

/**
 * This function renders the Delete Group Dialog which allows users to delete a group.
 *
 * @author Aayush Goyal
 * @created 2026-05-19
 */
export default function DeleteGroupDialog({
    groupDetails
}: {
    groupDetails: Group;
}) {
    // SECTION: Constants and Variables
    const router = useRouter();
    const groups = useDataStore((state) => state.groups);
    const dataActions = useDataStore((state) => state.actions);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [groupName, setGroupName] = useState<string>('');
    const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] =
        useState<boolean>(false);
    // !SECTION: States

    // SECTION: API Queries
    /**
     * This function handles the deletion of a user group.
     */
    const handleGroupDeletion = async (): Promise<void> => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const deleteGroupRes = await fetch(
                `/api/groups/${groupDetails.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-group-id': groupDetails.id,
                        Authorization: `Bearer ${jwtToken}`
                    }
                }
            );

            if (deleteGroupRes.ok) {
                toast.success(
                    `Group "${groupDetails.name}" deleted successfully!`
                );
                dataActions.setGroups(
                    groups.filter((g) => g.id !== groupDetails.id)
                );
                router.push('/groups');
            } else {
                toast.error('Failed to delete group. Please try again.');
                logger.error('Failed to delete group.');
            }
        } catch (error: any) {
            logger.error('Error deleting group:', error);
            toast.error('Failed to delete group. Please try again.');
        }
    };
    // !SECTION API Queries

    // SECTION: Event Handlers
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <Dialog
            open={isDeleteGroupDialogOpen}
            onOpenChange={setIsDeleteGroupDialogOpen}
        >
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    onClick={() => setIsDeleteGroupDialogOpen(true)}
                >
                    Delete Group
                </Button>
            </DialogTrigger>
            <DialogContent showCloseButton>
                <DialogHeader>
                    <DialogTitle>
                        Are you sure you want to delete this group?
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <Text>
                        Please enter the group name{' '}
                        <span className="font-code font-bold">
                            [{groupDetails.name}]
                        </span>{' '}
                        in the input field below to confirm deletion.
                    </Text>
                    <Input
                        className="mt-2"
                        id="input-profile-name"
                        type="text"
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>Cancel</DialogClose>
                    <Button
                        variant="destructive"
                        disabled={groupName !== groupDetails.name}
                        onClick={() => handleGroupDeletion()}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
    // !SECTION: UI
}
