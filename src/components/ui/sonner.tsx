'use client';

import useUIStore from '@/lib/ui-store';
import { Info, TickCloud } from 'elementa-icons';
import { Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
    const theme = useUIStore((state) => state.theme);

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group data-"
            icons={{
                success: <TickCloud className="size-4" />,
                info: <Info className="size-4" />,
                warning: <TriangleAlertIcon className="size-4" />,
                error: <OctagonXIcon className="size-4" />,
                loading: <Loader2Icon className="size-4 animate-spin" />
            }}
            style={
                {
                    '--normal-bg': 'var(--bg-modal-primary)',
                    '--normal-text': 'var(--text-primary)',
                    '--normal-border': 'var(--border)',
                    '--border-radius': 'var(--radius)'
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    toast: 'cn-toast',
                    error: 'bg-bg-fill-destructive! text-text-destructive!',
                    info: 'bg-bg-fill-info! text-text-info!',
                    success: 'bg-bg-fill-success! text-text-success!',
                    warning: 'bg-bg-fill-warning! text-text-warning!'
                }
            }}
            {...props}
        />
    );
};

export { Toaster };
