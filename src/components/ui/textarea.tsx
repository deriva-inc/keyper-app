import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                'border-stroke-base-primary font-body bg-bg-flat-primary flex field-sizing-content min-h-16 w-full max-w-4/5 rounded-lg border px-2.5 py-2 text-base transition-colors outline-none md:text-sm',
                'focus-visible:border-stroke-active-accent-primary focus-visible:ring-bg-active-fill-accent-primary focus-visible:ring-3',
                'aria-invalid:ring-bg-hover-destructive aria-invalid:border-stroke-destructive aria-invalid:ring-3',
                'disabled:bg-bg-disabled disabled:text-text-disabled disabled:pointer-events-none disabled:cursor-not-allowed',
                'placeholder:text-text-tertiary',
                className
            )}
            {...props}
        />
    );
}

export { Textarea };
