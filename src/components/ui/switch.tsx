'use client';

import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

function Switch({
    className,
    size = 'default',
    ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
    size?: 'sm' | 'default';
}) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            data-size={size}
            className={cn(
                'peer group/switch data-checked:bg-text-primary data-unchecked:bg-bg-active-primary relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 data-[size=default]:h-[18.4px] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6',
                'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-3',
                'aria-invalid:border-stroke-destructive aria-invalid:ring-bg-fill-destructive',
                'data-disabled:cursor-not-allowed data-disabled:opacity-50',
                className
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className="data-unchecked:bg-text-primary data-checked:bg-bg-base-primary pointer-events-none block rounded-full ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0"
            />
        </SwitchPrimitive.Root>
    );
}

export { Switch };
