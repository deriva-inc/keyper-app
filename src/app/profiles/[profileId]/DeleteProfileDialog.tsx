'use client';

import { Delete } from 'elementa-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
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
import { Text } from '@/src/components/ui/text';
import { Input } from '@/src/components/ui/input';

/**
 * This function renders the Delete Profile Dialog which allows users to delete an existing profile.
 *
 * @author Aayush Goyal
 * @created 2026-05-16
 */
export default function DeleteProfileDialog({
    profileId
}: {
    profileId: string;
}) {
    // SECTION: Constants and Variables
    const router = useRouter();
    const dataActions = useDataStore((state) => state.actions);
    const profiles = useDataStore((state) => state.profiles);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [isDeleteProfileDialogOpen, setIsDeleteProfileDialogOpen] =
        useState<boolean>(false);
    // !SECTION: States

    // SECTION: API Queries
    /**
     * This function handles the deletion of a user profile.
     */
    const handleProfileDeletion = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const deleteProfileRes = await fetch(`/api/profiles/${profileId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-profile-id': profileId,
                    Authorization: `Bearer ${jwtToken}`
                }
            });

            if (deleteProfileRes.ok) {
                toast.success('Profile deleted successfully!');
                router.push('/profiles');
                dataActions.setProfiles(
                    profiles.filter((profile) => profile.id !== profileId)
                );
            } else {
                toast.error('Failed to delete profile. Please try again.');
                logger.error('Failed to delete profile.');
            }
        } catch (error: any) {
            logger.error('Error deleting profile:', error);
            toast.error('Failed to delete profile. Please try again.');
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
            open={isDeleteProfileDialogOpen}
            onOpenChange={setIsDeleteProfileDialogOpen}
        >
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    onClick={() => setIsDeleteProfileDialogOpen(true)}
                >
                    <Delete />
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent showCloseButton>
                <DialogHeader>
                    <DialogTitle>
                        Are you sure you want to delete this profile?
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <Text>
                        Please enter the profile name{' '}
                        <span className="font-code font-bold">
                            [
                            {
                                profiles.find(
                                    (profile) => profile.id === profileId
                                )?.name
                            }
                            ]
                        </span>{' '}
                        in the input field below to confirm deletion.
                    </Text>
                    <Input
                        className="mt-2"
                        id="input-profile-name"
                        type="text"
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>Cancel</DialogClose>
                    <Button
                        variant="destructive"
                        onClick={() => handleProfileDeletion()}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
    // !SECTION: UI
}
