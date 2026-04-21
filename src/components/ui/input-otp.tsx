'use client';

import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';

import { cn } from '@/lib/utils';

const InputOTPDisabledContext = React.createContext({
    isDisabled: false
});

function InputOTP({
    className,
    containerClassName,
    disabled,
    ...props
}: React.ComponentProps<typeof OTPInput> & {
    containerClassName?: string;
}) {
    return (
        <InputOTPDisabledContext.Provider value={{ isDisabled: !!disabled }}>
            <OTPInput
                data-slot="input-otp"
                containerClassName={cn(
                    'cn-input-otp flex items-center',
                    containerClassName
                )}
                spellCheck={false}
                disabled={disabled}
                className={cn('disabled:cursor-not-allowed', className)}
                {...props}
            />
        </InputOTPDisabledContext.Provider>
    );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="input-otp-group"
            className={cn(
                'flex items-center rounded-lg',
                'has-aria-invalid:border-stroke-destructive has-aria-invalid:ring-bg-fill-destructive has-aria-invalid:ring-3',
                className
            )}
            {...props}
        />
    );
}

function InputOTPSlot({
    index,
    className,
    ...props
}: React.ComponentProps<'div'> & {
    index: number;
}) {
    const inputOTPContext = React.useContext(OTPInputContext);
    const { isDisabled } = React.useContext(InputOTPDisabledContext);
    const { char, hasFakeCaret, isActive } =
        inputOTPContext?.slots[index] ?? {};

    return (
        <div
            data-slot="input-otp-slot"
            data-active={isActive}
            className={cn(
                'border-stroke-active-primary font-body text-text-primary data-[active=true]:border-ring data-[active=true]:ring-ring/50 bg-bg-modal-primary relative flex size-8 items-center justify-center border-y border-r text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg data-[active=true]:z-10 data-[active=true]:ring-3',
                'aria-invalid:border-stroke-destructive data-[active=true]:aria-invalid:border-stroke-destructive data-[active=true]:aria-invalid:ring-bg-fill-destructive',
                isDisabled &&
                    'bg-bg-disabled border-stroke-disabled text-text-disabled',
                className
            )}
            {...props}
        >
            {char}
            {hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
                </div>
            )}
        </div>
    );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="input-otp-separator"
            className="bg-text-primary mx-1 flex h-1.5 w-1.5 items-center rounded-full [&_svg:not([class*='size-'])]:size-4"
            role="separator"
            {...props}
        />
    );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
