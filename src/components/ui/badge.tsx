import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex w-fit shrink-0 select-none font-body cursor-default items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-stroke-active-secondary focus-visible:ring-[3px] focus-visible:ring-stroke-active-secondary aria-invalid:border-destructive aria-invalid:ring-stroke-destructive [&>svg]:pointer-events-none [&>svg]:size-3',
    {
        variants: {
            variant: {
                default:
                    'bg-bg-active-secondary text-text-primary [a&]:hover:bg-bg-active-primary',
                secondary:
                    'bg-bg-active-secondary/60 text-text-primary [a&]:hover:bg-bg-active-primary/60',
                destructive:
                    'bg-bg-fill-destructive text-text-destructive focus-visible:ring-stroke-destructive [a&]:hover:bg-destructive/90',
                warning:
                    'bg-bg-fill-warning text-text-warning focus-visible:ring-stroke-warning [a&]:hover:bg-warning/90',
                info: 'bg-bg-fill-info text-text-info focus-visible:ring-stroke-info [a&]:hover:bg-info/90',
                success:
                    'bg-bg-fill-success text-text-success focus-visible:ring-stroke-success [a&]:hover:bg-success/90',
                outline:
                    'border-stroke-active-secondary text-text-primary [a&]:hover:bg-bg-active-primary [a&]:hover:text-text-secondary',
                ghost: '[a&]:hover:bg-bg-active-primary [a&]:hover:text-text-secondary',
                link: 'text-text-primary underline-offset-4 [a&]:hover:underline'
            },
            size: {
                default: 'text-xs',
                lg: 'text-sm'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
);

function Badge({
    className,
    variant = 'default',
    asChild = false,
    ...props
}: React.ComponentProps<'span'> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot.Root : 'span';

    return (
        <Comp
            data-slot="badge"
            data-variant={variant}
            data-size={props.size}
            className={cn(
                badgeVariants({ variant, size: props.size }),
                className
            )}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
