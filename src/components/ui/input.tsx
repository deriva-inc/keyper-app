import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                'border-stroke-base-primary font-body text-text-primary bg-bg-flat-primary file:bg-bg-flat-secondary h-8 w-full min-w-0 rounded-lg border px-2.5 py-1 text-sm transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:font-medium',
                'focus-visible:border-stroke-active-primary focus-visible:ring-bg-active-fill-primary focus-visible:ring-4',
                'aria-invalid:ring-bg-hover-destructive aria-invalid:border-stroke-destructive aria-invalid:ring-3',
                'disabled:bg-bg-disabled disabled:text-text-disabled disabled:pointer-events-none disabled:cursor-not-allowed',
                'placeholder:text-text-tertiary',
                className
            )}
            {...props}
        />
    );
}

export { Input };
