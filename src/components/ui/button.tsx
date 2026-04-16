import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "focus-visible:border-ring py-1 cursor-pointer active:scale-95 focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive rounded-[8px] border border-transparent font-body font-bold focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    'bg-bg-active-primary text-text-primary hover:bg-bg-active-hover-primary [a]:hover:bg-primary/80',
                outline:
                    'border-stroke-base-primary bg-bg-base-primary hover:bg-muted aria-expanded:bg-muted text-text-primary',
                secondary:
                    'bg-bg-active-secondary text-text-primary hover:bg-bg-active-hover-secondary aria-expanded:bg-secondary aria-expanded:text-text-primary',
                ghost: 'hover:bg-muted text-text-primary aria-expanded:bg-muted',
                destructive:
                    'bg-bg-fill-destructive hover:bg-bg-hover-destructive focus-visible:ring-destructive/20 text-text-destructive focus-visible:border-destructive/40 border-stroke-destructive',
                link: 'text-text-info underline-offset-4 hover:underline'
            },
            size: {
                default:
                    'h-10 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
                xs: "h-8 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
                sm: "h-9 gap-1 px-3 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
                lg: 'h-11 gap-1.5 px-3 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
                icon: 'size-8',
                'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3",
                'icon-sm': 'size-7',
                'icon-lg': 'size-9'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
);

function Button({
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot.Root : 'button';

    return (
        <button
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
