'use client';

import * as React from 'react';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

function DropdownMenu({
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
    return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
    return (
        <DropdownMenuPrimitive.Portal
            data-slot="dropdown-menu-portal"
            {...props}
        />
    );
}

function DropdownMenuTrigger({
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
    return (
        <DropdownMenuPrimitive.Trigger
            data-slot="dropdown-menu-trigger"
            {...props}
        />
    );
}

function DropdownMenuContent({
    className,
    align = 'start',
    sideOffset = 4,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
    return (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
                data-slot="dropdown-menu-content"
                sideOffset={sideOffset}
                align={align}
                className={cn(
                    'bg-bg-modal-primary font-body text-text-primary ring-stroke-modal-primary data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg p-1 shadow-md ring-1 duration-100 data-[state=closed]:overflow-hidden',
                    className
                )}
                {...props}
            />
        </DropdownMenuPrimitive.Portal>
    );
}

function DropdownMenuGroup({
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
    return (
        <DropdownMenuPrimitive.Group
            data-slot="dropdown-menu-group"
            {...props}
        />
    );
}

function DropdownMenuItem({
    className,
    inset,
    variant = 'default',
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: 'default' | 'destructive';
}) {
    return (
        <DropdownMenuPrimitive.Item
            data-slot="dropdown-menu-item"
            data-inset={inset}
            data-variant={variant}
            className={cn(
                "group/dropdown-menu-item not-data-[variant=destructive]:focus:**:text-text-primary relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                'cursor-pointer',
                'focus:bg-bg-active-primary focus:text-text-primary',
                'data-[variant=destructive]:text-text-destructive data-[variant=destructive]:focus:bg-bg-fill-destructive data-[variant=destructive]:focus:text-text-destructive data-[variant=destructive]:*:[svg]:text-text-destructive',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                className
            )}
            {...props}
        />
    );
}

function DropdownMenuCheckboxItem({
    className,
    children,
    checked,
    inset,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
    inset?: boolean;
}) {
    return (
        <DropdownMenuPrimitive.CheckboxItem
            data-slot="dropdown-menu-checkbox-item"
            data-inset={inset}
            className={cn(
                "relative flex cursor-pointer items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                'focus:bg-bg-active-primary focus:text-text-primary focus:**:text-text-primary',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                className
            )}
            checked={checked}
            {...props}
        >
            <span
                className="pointer-events-none absolute right-2 flex items-center justify-center"
                data-slot="dropdown-menu-checkbox-item-indicator"
            >
                <DropdownMenuPrimitive.ItemIndicator>
                    <CheckIcon />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.CheckboxItem>
    );
}

function DropdownMenuRadioGroup({
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
    return (
        <DropdownMenuPrimitive.RadioGroup
            data-slot="dropdown-menu-radio-group"
            {...props}
        />
    );
}

function DropdownMenuRadioItem({
    className,
    children,
    inset,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
    inset?: boolean;
}) {
    return (
        <DropdownMenuPrimitive.RadioItem
            data-slot="dropdown-menu-radio-item"
            data-inset={inset}
            className={cn(
                "relative flex cursor-pointer items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                'focus:bg-bg-active-primary focus:text-text-primary focus:**:text-text-primary',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                className
            )}
            {...props}
        >
            <span
                className="pointer-events-none absolute right-2 flex items-center justify-center"
                data-slot="dropdown-menu-radio-item-indicator"
            >
                <DropdownMenuPrimitive.ItemIndicator>
                    <CheckIcon />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.RadioItem>
    );
}

function DropdownMenuLabel({
    className,
    inset,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
}) {
    return (
        <DropdownMenuPrimitive.Label
            data-slot="dropdown-menu-label"
            data-inset={inset}
            className={cn(
                'text-text-primary font-heading px-1.5 py-1 text-xs font-medium data-inset:pl-7',
                className
            )}
            {...props}
        />
    );
}

function DropdownMenuSeparator({
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
    return (
        <DropdownMenuPrimitive.Separator
            data-slot="dropdown-menu-separator"
            className={cn(
                'bg-stroke-active-primary -mx-1 my-1 h-px',
                className
            )}
            {...props}
        />
    );
}

function DropdownMenuShortcut({
    className,
    ...props
}: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="dropdown-menu-shortcut"
            className={cn(
                'text-text-secondary group-focus/dropdown-menu-item:text-text-primary ml-auto text-xs tracking-widest',
                className
            )}
            {...props}
        />
    );
}

function DropdownMenuSub({
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
    return (
        <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
    );
}

function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
}) {
    return (
        <DropdownMenuPrimitive.SubTrigger
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset}
            className={cn(
                "not-data-[variant=destructive]:focus:**:text-text-primary data-open:bg-bg-active-primary data-open:text-text-primary flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                'focus:bg-bg-active-primary focus:text-text-primary',
                'cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
            <ChevronRightIcon className="cn-rtl-flip ml-auto" />
        </DropdownMenuPrimitive.SubTrigger>
    );
}

function DropdownMenuSubContent({
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
    return (
        <DropdownMenuPrimitive.SubContent
            data-slot="dropdown-menu-sub-content"
            className={cn(
                'bg-bg-modal-secondary font-body text-text-primary ring-stroke-modal-secondary data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-50 min-w-24 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-lg p-1 shadow-lg ring-1 duration-100',
                className
            )}
            {...props}
        />
    );
}

export {
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
};
