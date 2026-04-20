'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Toggle as TogglePrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

const toggleVariants = cva(
    "group/toggle inline-flex cursor-pointer text-text-primary font-body aria-checked:text-bg-base-primary aria-pressed:text-bg-base-primary items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-bg-active-primary hover:text-bg-base-primary focus-visible:border-stroke-active-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-stroke-destructive aria-invalid:ring-bg-fill-destructive aria-invalid:text-text-destructive disabled:border-stroke-disabled disabled:text-text-disabled aria-checked:bg-bg-active-secondary aria-pressed:bg-bg-active-secondary data-[state=on]:bg-bg-active-secondary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default: 'bg-transparent',
                outline: 'border border-stroke-active-primary bg-transparent'
            },
            size: {
                default:
                    'h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
                sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
                lg: 'h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
);

function Toggle({
    className,
    variant = 'default',
    size = 'default',
    ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>) {
    return (
        <TogglePrimitive.Root
            data-slot="toggle"
            className={cn(toggleVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Toggle, toggleVariants };
