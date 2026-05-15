'use client';

import { Edit } from 'elementa-icons';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import { Profile } from '@/lib/types/model';
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

type UpdateProfileFields = Pick<Profile, 'name' | 'description' | 'icon'>;

/**
 * This function renders the UpdateProfileDetailsSheet component which is used to update the details of a user profile such as name and avatar.
 *
 * @author Aayush Goyal
 * @created 2026-05-15
 */
export default function UpdateProfileDetailsSheet({
    profileDetails,
    updateProfileDetails
}: {
    profileDetails: Profile;
    updateProfileDetails: (profileData: Profile) => void;
}) {
    // SECTION: Constants and Variables
    const dataActions = useDataStore((state) => state.actions);
    const profiles = useDataStore((state) => state.profiles);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [editProfileDetails, setEditProfileDetails] =
        useState<UpdateProfileFields>({
            name: profileDetails.name,
            description: profileDetails.description || '',
            icon: profileDetails.icon
        });
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    const handleIconClick = (iconId: string) => {
        setEditProfileDetails((prev) => ({ ...prev, icon: iconId }));
    };

    /**
     * This function handles the updating of an existing profile by sending a POST request.
     */
    const handleUpdateProfile = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const updateProfileRes = await fetch(
                `/api/profiles/${profileDetails.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`,
                        'X-profile-id': profileDetails.id
                    },
                    body: JSON.stringify({
                        name: editProfileDetails.name,
                        description: editProfileDetails.description,
                        icon: editProfileDetails.icon
                    })
                }
            );

            if (updateProfileRes.ok) {
                const profileData = await updateProfileRes.json();
                dataActions.setProfiles(
                    profiles.map((p) =>
                        p.id === profileData.data.id ? profileData.data : p
                    )
                );
                updateProfileDetails(profileData.data);
                toast.success('Profile updated successfully!');
                setIsSheetOpen(false);
            } else {
                toast.error('Failed to update profile. Please try again.');
            }
        } catch (error: any) {
            toast.error(
                'Something went wrong while updating the profile. Please try again.'
            );
            logger.error('Error while updating the profile: ', error);
        }
    };
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <Sheet open={isSheetOpen} onOpenChange={(open) => setIsSheetOpen(open)}>
            <SheetTrigger asChild>
                <Button
                    variant="secondary"
                    onClick={() => setIsSheetOpen(true)}
                >
                    <Edit height={24} width={24} />
                    Update
                </Button>
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
                            Update your profile to manage all your vault entries
                            in an isolated and contextual environment.
                        </Text>
                    </SheetDescription>
                </SheetHeader>
                <form className="px-4">
                    <Label htmlFor="input-profile-name">Profile Name</Label>
                    <Input
                        className="mt-2"
                        id="input-profile-name"
                        value={editProfileDetails.name}
                        onChange={(e) =>
                            setEditProfileDetails((prev) => ({
                                ...prev,
                                name: e.target.value
                            }))
                        }
                    />
                    <Label
                        className="mt-6"
                        htmlFor="textarea-profile-description"
                    >
                        Profile Description
                    </Label>
                    <Textarea
                        className="mt-2"
                        id="textarea-profile-description"
                        value={editProfileDetails.description}
                        onChange={(e) =>
                            setEditProfileDetails((prev) => ({
                                ...prev,
                                description: e.target.value
                            }))
                        }
                    />
                    <Label className="mt-6">Profile Icon</Label>
                    <div className="mt-2 grid grid-cols-4 items-start justify-items-center gap-4">
                        {profileIcons.map((icon, index) => (
                            <motion.div
                                role="button"
                                key={index}
                                className={`hover:bg-bg-base-accent-primary active cursor-pointer rounded-md border p-4 active:scale-95 ${editProfileDetails.icon === icon.id ? 'bg-bg-active-accent-primary' : 'bg-bg-active-primary'}`}
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => handleIconClick(icon.id)}
                            >
                                <icon.icon
                                    height={32}
                                    width={32}
                                    stroke={0}
                                    className={
                                        editProfileDetails.icon === icon.id
                                            ? 'text-bg-base-primary'
                                            : ''
                                    }
                                />
                            </motion.div>
                        ))}
                    </div>
                </form>
                <SheetFooter>
                    <Button
                        onClick={() => handleUpdateProfile()}
                        className="w-full"
                    >
                        Update Profile
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
