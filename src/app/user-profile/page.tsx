'use client';

import { isEmpty } from 'lodash';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import Header from '@/src/components/blocks/header';
import AppSidebar from '@/src/components/ui/app-sidebar';
import { Button } from '@/src/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { SidebarProvider } from '@/src/components/ui/sidebar';
import { Text, TextVariant } from '@/src/components/ui/text';

/**
 * This function renders the User Profile page of the app.
 *
 * @author Aayush Goyal
 * @created 2026-05-15
 */
export default function ProfilePage() {
    // SECTION: Constants and Variables
    const router = useRouter();
    const userDetails = useDataStore((state) => state.userDetails);
    const actions = useDataStore((state) => state.actions);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [userName, setUserName] = useState('');
    // !SECTION: States

    // SECTION: API Queries
    /**
     * This function fetches the user details for the active user profile.
     */
    const fetchUserDetails = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const userProfileRes = await fetch('/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`
                }
            });

            const userProfileData = await userProfileRes.json();
            actions.setUserDetails(userProfileData.data);
        } catch (error: any) {
            logger.error(
                `Failed to fetch user details for the user profile page. Error: ${error.message}`
            );
            toast.error(
                'Failed to fetch user details. Routing to your dashboard.'
            );
            router.push('/dashboard');
        }
    };

    /**
     * This function deletes the user profile and all associated data from the platform.
     */
    const handleDeleteUserProfile = async () => {
        //  try {
        //     const jwtToken = localStorage.getItem('jwtToken');
        //     const response = await fetch('/api/users', {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             Authorization: `Bearer ${jwtToken}`
        //         }
        // } catch (error: any) {
        //     logger.error(
        //         `Failed to fetch user details for the user profile page. Error: ${error.message}`
        //     );
        //     toast.error(
        //         'Failed to fetch user details. Routing to your dashboard.'
        //     );
        //     router.push('/dashboard');
        // }
    };
    // !SECTION API Queries

    // SECTION: Event Handlers
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    useEffect(() => {
        fetchUserDetails();
    }, []);
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <div className="min-h-screen transition-colors duration-300">
            <SidebarProvider>
                <AppSidebar />
                <div className="w-full px-8 py-2">
                    <Header />
                    {!isEmpty(userDetails) && (
                        <div className="mx-80 py-8">
                            <div className="flex flex-col gap-8">
                                <img
                                    src={userDetails.avatarUrl}
                                    alt={userDetails.name}
                                    width={80}
                                    height={80}
                                    className="border-stroke-active-accent-primary mx-auto my-8 rounded-full border-2"
                                />
                                <div className="flex items-center justify-between">
                                    <Text
                                        variant={TextVariant.Body}
                                        color="text-text-secondary"
                                    >
                                        Name
                                    </Text>
                                    <Text
                                        variant={TextVariant.H4}
                                        color="text-text-primary"
                                    >
                                        {userDetails.name}
                                    </Text>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Text
                                        variant={TextVariant.Body}
                                        color="text-text-secondary"
                                    >
                                        Email
                                    </Text>
                                    <Text
                                        variant={TextVariant.H4}
                                        color="text-text-primary"
                                    >
                                        {userDetails.email}
                                    </Text>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Text
                                        variant={TextVariant.Body}
                                        color="text-text-secondary"
                                    >
                                        Created At
                                    </Text>
                                    <Text
                                        variant={TextVariant.H4}
                                        color="text-text-primary"
                                    >
                                        {userDetails.createdAt.toString()}
                                    </Text>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Text
                                        variant={TextVariant.Body}
                                        color="text-text-secondary"
                                    >
                                        Updated At
                                    </Text>
                                    <Text
                                        variant={TextVariant.H4}
                                        color="text-text-primary"
                                    >
                                        {userDetails.updatedAt.toString()}
                                    </Text>
                                </div>{' '}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive">
                                            Delete Profile
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Are you sure you want to delete
                                                this profile?
                                            </DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone.
                                                All your vault entries and
                                                groups associated with this
                                                profile will be permanently
                                                deleted.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="">
                                            <Text>
                                                Please enter your name{' '}
                                                <span className="font-code font-bold">
                                                    {userDetails.name}
                                                </span>{' '}
                                                into the field below to proceed
                                                with deleting your profile.
                                            </Text>
                                            <Input
                                                onChange={(e) =>
                                                    setUserName(e.target.value)
                                                }
                                                id="input-user-name"
                                                className="my-2"
                                            />
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                Cancel
                                            </DialogClose>
                                            <Button
                                                variant="destructive"
                                                disabled={
                                                    userName !==
                                                    userDetails.name
                                                }
                                                onClick={
                                                    handleDeleteUserProfile
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    )}
                </div>
            </SidebarProvider>
        </div>
    );
    // !SECTION: UI
}
