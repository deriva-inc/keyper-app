'use client';

import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';
import { Check } from 'elementa-icons';

function Checkbox({
    className,
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                'peer border-stroke-flat-primary relative flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2',
                'data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground',
                'focus-visible:border-stroke-active-secondary focus-visible:ring-bg-active-fill-accent-primary focus-visible:ring-3',
                'aria-invalid:border-stroke-destructive aria-invalid:ring-bg-fill-destructive aria-invalid:aria-checked:border-stroke-destructive aria-invalid:ring-3',
                'disabled:bg-bg-disabled disabled:border-stroke-disabled disabled:cursor-not-allowed',
                'cursor-pointer',
                className
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
            >
                <Check className="p-px" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { Checkbox };
