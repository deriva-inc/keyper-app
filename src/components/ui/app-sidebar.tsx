'use client';

import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import useUIStore from '@/lib/ui-store';
import { TOP_NAV_LINKS } from '@/lib/utils';
import { Logout } from 'elementa-icons';
import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarImage,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    Text,
    TextVariant,
    useSidebar
} from 'get-elementa-ui';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

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
                            <div className="flex items-center gap-2">
                                <img
                                    src="/icons/logo-small.svg"
                                    alt="keyper"
                                    height="32px"
                                    width="32px"
                                />
                                <Text
                                    className="font-heading text-text-accent-primary"
                                    variant={TextVariant.H3}
                                >
                                    Keyper
                                </Text>
                            </div>
                        )}
                        <SidebarTrigger />
                    </div>
                    {sidebarContext.state === 'expanded' && (
                        <Text>Your own private digital sanctuary</Text>
                    )}
                </SidebarHeader>
                <SidebarMenu>
                    {TOP_NAV_LINKS.map((navLink) => (
                        <SidebarMenuItem key={navLink.id}>
                            <SidebarMenuButton
                                className={`${
                                    currentPage === navLink.id
                                        ? 'bg-bg-base-accent-primary'
                                        : ''
                                } ${
                                    sidebarContext.state === 'expanded'
                                        ? ''
                                        : 'mx-auto'
                                }`}
                            >
                                <Link
                                    href={navLink.href}
                                    className={`flex items-center ${navLink.id !== 'dashboard' && 'gap-2'} ${sidebarContext.state === 'expanded' && navLink.id === 'dashboard' ? 'gap-2' : ''}`}
                                >
                                    {(() => {
                                        if (navLink.icon) {
                                            const IconComponent = navLink.icon;
                                            return (
                                                <IconComponent
                                                    height={24}
                                                    width={24}
                                                    stroke={0}
                                                    className=""
                                                />
                                            );
                                        }
                                        return null;
                                    })()}
                                    {navLink.label}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
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
