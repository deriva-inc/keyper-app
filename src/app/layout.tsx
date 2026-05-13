'use client';

// import Footer from '@/src/components/app/footer';
// import Header from '@/src/components/app/header';
import { jwtDecode } from 'jwt-decode';
import { ReactLenis } from 'lenis/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import './globals.css';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import { JWTPayload } from '@/lib/types/api';
import { protectedRoutes } from '@/lib/utils';
import { THEME } from '@/lib/types/model';
import useUIStore from '@/lib/ui-store';
import { Toaster } from '@/src/components/ui/sonner';
import { TooltipProvider } from '@/src/components/ui/tooltip';

/**
 * This function is the root layout of the app.
 */
export default function RootLayout(props: { children: React.ReactNode }) {
    // SECTION: Constants
    const actions = useUIStore((state) => state.actions);
    const dataActions = useDataStore((state) => state.actions);
    const pathname = usePathname();
    const router = useRouter();
    // !SECTION: Constants

    // SECTION: States
    // !SECTION: States

    // SECTION: API Calls
    /**
     * This function handles the user logout process by clearing the relevant
     * data from localStorage, updating the data store, and redirecting the
     * user to the login page.
     */
    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.setItem('loggedIn', 'false');
        dataActions.setIsUserLoggedIn(false);
        dataActions.setUserDetails(null);
        router.push('/');
        // TODO: Server Handle Logout Call
    };
    // !SECTION: API Calls

    // SECTION: Functions
    /**
     * This function verifies the user's login status by checking the validity
     * of the JWT token stored in localStorage. If the token is invalid or
     * expired, it triggers the logout process.
     */
    const verifyLoginStatus = () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                dataActions.setIsUserLoggedIn(false);
                localStorage.setItem('loggedIn', 'false');
                handleLogout();
                return;
            } else {
                const decodedToken = jwtDecode<JWTPayload>(jwtToken);
                const currentTime = Date.now() / 1000;

                // Overriding the existing login status in localStorage based on the token's validity.
                if (decodedToken.exp > currentTime) {
                    dataActions.setIsUserLoggedIn(true);
                    localStorage.setItem('loggedIn', 'true');
                } else {
                    dataActions.setIsUserLoggedIn(false);
                    localStorage.setItem('loggedIn', 'false');
                    handleLogout();
                }
            }
        } catch (error) {
            logger.error('Failed to decode token:', error);
            dataActions.setIsUserLoggedIn(false);
            localStorage.setItem('loggedIn', 'false');
            handleLogout();
            return false;
        }
    };
    // !SECTION: Functions

    // SECTION: Side Effects
    useEffect(() => {
        const theme = localStorage.getItem('theme') as THEME | null;
        if (theme === THEME.GUN_METAL) {
            actions.setTheme(THEME.GUN_METAL);
            document.documentElement.classList.toggle('dark', true);
        }
    }, []);

    useEffect(() => {
        protectedRoutes.includes(`/${pathname.split('/')[1]}`) &&
            verifyLoginStatus();
    }, [pathname]);
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <html
            lang="en"
            data-energy="bubblegum-ice"
            className="bg-bg-base-primary antialiased"
        >
            <head>
                <meta property="og:image" content="/img/og.png" />
                <meta property="og:type" content="website" />
                <meta
                    property="og:title"
                    content="elementa.dev - When fun met icons!"
                />
                <meta
                    property="og:description"
                    content="Free and open-source premium web icons in SVG, PNG, and JSX format!"
                />
                <link rel="shortcut icon" href="/logo-small.svg" />
            </head>
            <body>
                <ReactLenis
                    root
                    options={{
                        lerp: 0.1,
                        duration: 1.5,
                        smoothWheel: true,
                        syncTouch: true
                    }}
                >
                    {/* <Header /> */}
                    {/* <RQProviders> */}
                    <Toaster />
                    <TooltipProvider>{props.children}</TooltipProvider>
                    {/* </RQProviders> */}
                    {/* <Footer /> */}
                </ReactLenis>
            </body>
        </html>
    );
    //! SECTION
}
