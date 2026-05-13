'use client';

import { Add } from 'elementa-icons';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import { profileIcons } from '@/lib/utils';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/src/components/ui/sheet';
import { Text, TextVariant } from '@/src/components/ui/text';
import { Textarea } from '@/src/components/ui/textarea';

/**
 * This function renders the Create New Profile Sidebar which allows users to
 * create a new profile.
 *
 * @author Aayush Goyal
 * @created 2026-05-13
 */
export default function CreateNewProfileSidebar({
    isCreateNewProfileSheetOpen,
    setIsCreateNewProfileSheetOpen,
    showTrigger = true
}: {
    isCreateNewProfileSheetOpen: boolean;
    setIsCreateNewProfileSheetOpen: (open: boolean) => void;
    showTrigger?: boolean;
}) {
    // SECTION: Constants and Variables
    const dataActions = useDataStore((state) => state.actions);
    const profiles = useDataStore((state) => state.profiles);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [activeIcon, setActiveIcon] = useState<string>('');
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    const handleIconClick = (iconId: string) => {
        setActiveIcon(iconId);
    };

    /**
     * This function handles the creation of a new profile by sending a POST request.
     */
    const handleCreateProfile = async () => {
        try {
            const profileName = (
                document.getElementById(
                    'input-profile-name'
                ) as HTMLInputElement
            ).value;
            const profileDescription = (
                document.getElementById(
                    'textarea-profile-description'
                ) as HTMLTextAreaElement
            ).value;

            const jwtToken = localStorage.getItem('jwtToken');
            const createProfileRes = await fetch('/api/profiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    name: profileName,
                    description: profileDescription,
                    icon: activeIcon
                })
            });

            if (createProfileRes.ok) {
                const profileData = await createProfileRes.json();
                console.log(profileData);
                dataActions.setProfiles([
                    ...(profiles || []),
                    profileData.data
                ]);
                toast.success('Profile created successfully!');
                setIsCreateNewProfileSheetOpen(false);
            } else {
                toast.error('Failed to create profile. Please try again.');
            }
        } catch (error: any) {
            toast.error(
                'Something went wrong while creating the profile. Please try again.'
            );
            logger.error('Error while creating a new profile: ', error);
        }
    };
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <Sheet
            open={isCreateNewProfileSheetOpen}
            onOpenChange={setIsCreateNewProfileSheetOpen}
        >
            {showTrigger && (
                <SheetTrigger asChild>
                    <div className="bg-bg-flat-primary flex min-h-60 w-80 cursor-pointer flex-col items-center justify-center gap-4 rounded-md border px-6 py-8 shadow-md hover:scale-105 active:scale-95">
                        <div className="border-text-primary w-fit rounded-full border border-dashed p-4">
                            <Add
                                className="text-text-primary"
                                height={24}
                                width={24}
                            />
                        </div>
                        <Text variant={TextVariant.H3}>Create Profile</Text>
                        <Text className="text-center">
                            Set up a new isolated vault for your specific needs.
                        </Text>
                    </div>
                </SheetTrigger>
            )}
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        <Text
                            variant={TextVariant.H3}
                            className="text-text-accent-primary"
                        >
                            Create New Profile
                        </Text>
                    </SheetTitle>
                    <SheetDescription>
                        <Text>
                            Create a new profile to manage all your vault
                            entries in an isolated and contextual environment.
                        </Text>
                    </SheetDescription>
                </SheetHeader>
                <form className="px-4">
                    <Label htmlFor="input-profile-name">Profile Name</Label>
                    <Input className="mt-2" id="input-profile-name" />
                    <Label
                        className="mt-6"
                        htmlFor="textarea-profile-description"
                    >
                        Profile Description
                    </Label>
                    <Textarea
                        className="mt-2"
                        id="textarea-profile-description"
                    />
                    <Label className="mt-6">Profile Icon</Label>
                    <div className="mt-2 grid grid-cols-4 items-start justify-items-center gap-4">
                        {profileIcons.map((icon, index) => (
                            <div
                                role="button"
                                key={index}
                                className={`hover:bg-bg-base-accent-primary active cursor-pointer rounded-md border p-4 hover:scale-105 active:scale-95 ${activeIcon === icon.id ? 'bg-bg-active-accent-primary' : 'bg-bg-active-primary'}`}
                                onClick={() => handleIconClick(icon.id)}
                            >
                                <icon.icon
                                    height={32}
                                    width={32}
                                    stroke={0}
                                    className={
                                        activeIcon === icon.id
                                            ? 'text-bg-base-primary'
                                            : ''
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </form>
                <SheetFooter>
                    <Button
                        onClick={() => handleCreateProfile()}
                        className="w-full"
                    >
                        Create Profile
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
