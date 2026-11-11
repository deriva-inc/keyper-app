'use client';

import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import {
    Button,
    Input,
    Label,
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Text,
    TextVariant
} from 'get-elementa-ui';
import { toast } from 'sonner';

/**
 * This function renders the UpdateProfileSheet component, which is responsible for displaying the user profile update interface.
 *
 * @author Aayush Goyal
 * @created 2026-11-12
 */
export default function UpdateProfileSheet({
    isUpdateProfileSheetOpen,
    setIsUpdateProfileSheetOpen
}: {
    isUpdateProfileSheetOpen: boolean;
    setIsUpdateProfileSheetOpen: (isOpen: boolean) => void;
}) {
    // SECTION: Constants and Variables
    const dataActions = useDataStore((state) => state.actions);
    const activeProfile = useDataStore((state) => state.activeProfile);
    const userDetails = useDataStore((state) => state.userDetails);
    // !SECTION: Constants and Variables

    // SECTION: States
    // !SECTION: States

    // SECTION: API Queries
    const handleUpdateProfile = async () => {
        try {
            const userName = (
                document.getElementById(
                    'input-update-entry-name'
                ) as HTMLInputElement
            ).value;
            const userEmail = (
                document.getElementById(
                    'input-update-entry-email'
                ) as HTMLInputElement
            ).value;

            const jwtToken = localStorage.getItem('jwtToken');

            const updateEntryRes = await fetch(`/api/users`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                    'X-Profile-Id': activeProfile?.id || ''
                },
                body: JSON.stringify({
                    name: userName,
                    email: userEmail
                })
            });

            const vaultEntryData = await updateEntryRes.json();

            if (updateEntryRes.ok) {
                toast.success('Profile updated successfully.');
                setIsUpdateProfileSheetOpen(false);
                dataActions.setUserDetails({
                    ...userDetails,
                    name: userName,
                    email: userEmail
                });
            } else {
                toast.error(
                    vaultEntryData.error ||
                        'Failed to update profile. Please try again.'
                );
                logger.error('Error updating profile: ', vaultEntryData.error);
            }
        } catch (error: any) {
            toast.error(
                'Something went wrong while updating the profile. Please try again.'
            );
            logger.error('Error while updating the profile: ', error);
        }
    };
    // !SECTION API Queries

    // SECTION: Event Handlers
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <Sheet
            open={isUpdateProfileSheetOpen}
            onOpenChange={setIsUpdateProfileSheetOpen}
        >
            <SheetTrigger asChild>
                <Button>Update Profiles</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        <Text
                            variant={TextVariant.H3}
                            className="text-text-accent-primary"
                        >
                            Update Profile
                        </Text>
                    </SheetTitle>
                    <SheetDescription>
                        <Text>
                            Update your profile information here. Click save
                            when you're done.
                        </Text>
                    </SheetDescription>
                </SheetHeader>
                <form className="flex-1 overflow-y-auto px-4">
                    {/* Profile Name */}
                    <Label htmlFor="input-update-entry-name">
                        Vault Entry Name
                    </Label>
                    <Input
                        className="mt-2"
                        id="input-update-entry-name"
                        defaultValue={userDetails.name}
                    />

                    {/* Profile Email */}
                    <Label htmlFor="input-update-entry-email" className="mt-6">
                        Vault Entry Email
                    </Label>
                    <Input
                        className="mt-2"
                        id="input-update-entry-email"
                        defaultValue={userDetails.email}
                    />
                </form>
                <SheetFooter>
                    <Button
                        onClick={() => handleUpdateProfile()}
                        className="w-full"
                    >
                        Update Vault Entry
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" className="w-full">
                            Cancel
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
    // !SECTION: UI
}
