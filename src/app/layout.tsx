'use client';

// import Footer from '@/src/components/app/footer';
// import Header from '@/src/components/app/header';
import { ReactLenis } from 'lenis/react';
import './globals.css';
import { useEffect } from 'react';
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
    // !SECTION: Constants

    // SECTION: States
    // !SECTION: States

    // SECTION: Side Effects
    useEffect(() => {
        const theme = localStorage.getItem('theme') as THEME | null;
        if (theme === THEME.GUN_METAL) {
            actions.setTheme(THEME.GUN_METAL);
            document.documentElement.classList.toggle('dark', true);
        }
    }, []);
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <html
            lang="en"
            data-energy="vaporwave"
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
