'use client';

import { Friends, Home1, Locker, Logout, Shapes } from 'elementa-icons';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import useUIStore from '@/lib/ui-store';
import { TOP_NAV_LINKS } from '@/lib/types/model';
import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarImage
} from '@/src/components/ui/avatar';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar
} from '@/src/components/ui/sidebar';
import { Text, TextVariant } from '@/src/components/ui/text';

/**
 * This function renders the {@link AppSidebar} component on the UI.
 */
export default function AppSidebar() {
    // SECTION: Constants
    const router = useRouter();
    const sidebarContext = useSidebar();
    const currentPage = useUIStore((state) => state.currentPage);
    const dataActions = useDataStore((state) => state.actions);
    const userDetails = useDataStore((state) => state.userDetails);
    // !SECTION: Constants

    // SECTION: States
    // !SECTION: States

    // SECTION: API Calls
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
            dataActions.setUserDetails(userProfileData.data);
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
    // !SECTION: API Calls

    // SECTION: Event Handlers
    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.setItem('loggedIn', 'false');
        dataActions.setIsUserLoggedIn(false);
        dataActions.setUserDetails(null);
        router.push('/');
        // TODO: Server Handle Logout Call
    };
    // !SECTION: Event Handlers

    // SECTION: Side-effects
    useEffect(() => {
        fetchUserDetails();
    }, []);
    // !SECTION: Side-effects

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        {sidebarContext.state === 'expanded' && (
                            <Text
                                className="font-heading text-text-accent-primary"
                                variant={TextVariant.H3}
                            >
                                Keyper
                            </Text>
                        )}
                        <SidebarTrigger />
                    </div>
                    {sidebarContext.state === 'expanded' && (
                        <Text>Your own private digital sanctuary</Text>
                    )}
                </SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className={`${
                                currentPage === TOP_NAV_LINKS.DASHBOARD
                                    ? 'bg-bg-base-accent-primary'
                                    : ''
                            } ${
                                sidebarContext.state === 'expanded'
                                    ? ''
                                    : 'mx-auto'
                            }`}
                        >
                            <Link
                                href="/dashboard"
                                className={`flex items-center ${sidebarContext.state === 'expanded' ? 'gap-2' : ''}`}
                            >
                                <Home1 />
                                {sidebarContext.state === 'expanded' && (
                                    <span>Dashboard</span>
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className={`${
                                currentPage === TOP_NAV_LINKS.VAULT
                                    ? 'bg-bg-base-accent-primary'
                                    : ''
                            } ${
                                sidebarContext.state === 'expanded'
                                    ? ''
                                    : 'mx-auto'
                            }`}
                        >
                            <Link
                                href="/vault"
                                className="flex items-center gap-2"
                            >
                                <Locker />
                                Vault
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className={`${
                                currentPage === TOP_NAV_LINKS.PROFILES
                                    ? 'bg-bg-base-accent-primary'
                                    : ''
                            } ${
                                sidebarContext.state === 'expanded'
                                    ? ''
                                    : 'mx-auto'
                            }`}
                        >
                            <Link
                                href="/profiles"
                                className="flex items-center gap-2"
                            >
                                <Friends />
                                Profiles
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className={`${
                                currentPage === TOP_NAV_LINKS.GROUPS
                                    ? 'bg-bg-base-accent-primary'
                                    : ''
                            } ${
                                sidebarContext.state === 'expanded'
                                    ? ''
                                    : 'mx-auto'
                            }`}
                        >
                            <Link
                                href="/groups"
                                className="flex items-center gap-2"
                            >
                                <Shapes />
                                <span>Groups</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {!isEmpty(userDetails) && (
                            <SidebarMenuButton>
                                <Link
                                    href="/user-profile"
                                    className="flex items-center gap-2"
                                >
                                    <Avatar
                                        className={
                                            sidebarContext.state === 'expanded'
                                                ? ''
                                                : '-ml-2'
                                        }
                                    >
                                        <AvatarImage
                                            src={userDetails.avatarUrl}
                                        />
                                        <AvatarFallback>AG</AvatarFallback>
                                        <AvatarFallback>
                                            {userDetails?.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </AvatarFallback>
                                        <AvatarBadge className="bg-bg-success" />
                                    </Avatar>
                                    <Text variant={TextVariant.Body}>
                                        {userDetails.name}
                                    </Text>
                                </Link>
                            </SidebarMenuButton>
                        )}
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => handleLogout()}>
                                <Logout />
                                <span>Sign out</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
