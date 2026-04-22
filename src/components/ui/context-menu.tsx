'use client';

import * as React from 'react';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

function ContextMenu({
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
    return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuPortal({
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
    return (
        <ContextMenuPrimitive.Portal
            data-slot="context-menu-portal"
            {...props}
        />
    );
}

function ContextMenuTrigger({
    className,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
    return (
        <ContextMenuPrimitive.Trigger
            data-slot="context-menu-trigger"
            className={cn('select-none', className)}
            {...props}
        />
    );
}

function ContextMenuContent({
    className,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
}) {
    return (
        <ContextMenuPrimitive.Portal>
            <ContextMenuPrimitive.Content
                data-slot="context-menu-content"
                className={cn(
                    'bg-bg-modal-primary font-body text-text-primary ring-stroke-modal-primary data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-50 max-h-(--radix-context-menu-content-available-height) min-w-36 origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg p-1 shadow-md ring-1 duration-100',
                    className
                )}
                {...props}
            />
        </ContextMenuPrimitive.Portal>
    );
}

function ContextMenuGroup({
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
    return (
        <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
    );
}

function ContextMenuItem({
    className,
    inset,
    variant = 'default',
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: 'default' | 'destructive';
}) {
    return (
        <ContextMenuPrimitive.Item
            data-slot="context-menu-item"
            data-inset={inset}
            data-variant={variant}
            className={cn(
                "group/context-menu-item focus:*:[svg]:text-accent-foreground relative flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                'focus:bg-bg-active-accent-primary focus:text-text-primary',
                'data-[variant=destructive]:text-text-destructive data-[variant=destructive]:focus:bg-bg-fill-destructive data-[variant=destructive]:focus:text-text-destructive data-[variant=destructive]:*:[svg]:text-text-destructive',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                className
            )}
            {...props}
        />
    );
}

function ContextMenuCheckboxItem({
    className,
    children,
    checked,
    inset,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> & {
    inset?: boolean;
}) {
    return (
        <ContextMenuPrimitive.CheckboxItem
            data-slot="context-menu-checkbox-item"
            data-inset={inset}
            className={cn(
                "relative flex cursor-pointer items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                'focus:bg-bg-active-accent-primary focus:text-text-primary',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                className
            )}
            checked={checked}
            {...props}
        >
            <span className="pointer-events-none absolute right-2">
                <ContextMenuPrimitive.ItemIndicator>
                    <CheckIcon />
                </ContextMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </ContextMenuPrimitive.CheckboxItem>
    );
}

function ContextMenuRadioGroup({
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
    return (
        <ContextMenuPrimitive.RadioGroup
            data-slot="context-menu-radio-group"
            {...props}
        />
    );
}

function ContextMenuRadioItem({
    className,
    children,
    inset,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem> & {
    inset?: boolean;
}) {
    return (
        <ContextMenuPrimitive.RadioItem
            data-slot="context-menu-radio-item"
            data-inset={inset}
            className={cn(
                "relative flex cursor-pointer items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                'focus:bg-bg-active-primary focus:text-text-primary',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                className
            )}
            {...props}
        >
            <span className="pointer-events-none absolute right-2">
                <ContextMenuPrimitive.ItemIndicator>
                    <CheckIcon />
                </ContextMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </ContextMenuPrimitive.RadioItem>
    );
}

function ContextMenuLabel({
    className,
    inset,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
}) {
    return (
        <ContextMenuPrimitive.Label
            data-slot="context-menu-label"
            data-inset={inset}
            className={cn(
                'text-text-primary font-heading px-1.5 py-1 text-xs font-medium data-inset:pl-7',
                className
            )}
            {...props}
        />
    );
}

function ContextMenuSeparator({
    className,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
    return (
        <ContextMenuPrimitive.Separator
            data-slot="context-menu-separator"
            className={cn(
                'bg-stroke-active-primary -mx-1 my-1 h-px',
                className
            )}
            {...props}
        />
    );
}

function ContextMenuShortcut({
    className,
    ...props
}: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="context-menu-shortcut"
            className={cn(
                'text-text-secondary group-focus/context-menu-item:text-text-primary ml-auto text-xs tracking-widest',
                className
            )}
            {...props}
        />
    );
}

function ContextMenuSub({
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
    return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
}) {
    return (
        <ContextMenuPrimitive.SubTrigger
            data-slot="context-menu-sub-trigger"
            data-inset={inset}
            className={cn(
                "data-open:bg-bg-active-primary data-open:text-text-primary flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                'focus:bg-bg-active-primary focus:text-text-primary',
                className
            )}
            {...props}
        >
            {children}
            <ChevronRightIcon className="cn-rtl-flip ml-auto" />
        </ContextMenuPrimitive.SubTrigger>
    );
}

function ContextMenuSubContent({
    className,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
    return (
        <ContextMenuPrimitive.SubContent
            data-slot="context-menu-sub-content"
            className={cn(
                'bg-bg-modal-secondary font-body text-text-primary data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-50 min-w-32 origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-lg border p-1 shadow-lg duration-100',
                className
            )}
            {...props}
        />
    );
}

export {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuCheckboxItem,
    ContextMenuRadioItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuGroup,
    ContextMenuPortal,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuRadioGroup
};
