'use client';

import * as React from 'react';
import { Slider as SliderPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

function Slider({
    className,
    defaultValue,
    value,
    min = 0,
    max = 100,
    ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
    const _values = React.useMemo(
        () =>
            Array.isArray(value)
                ? value
                : Array.isArray(defaultValue)
                  ? defaultValue
                  : [min, max],
        [value, defaultValue, min, max]
    );

    return (
        <SliderPrimitive.Root
            data-slot="slider"
            defaultValue={defaultValue}
            value={value}
            min={min}
            max={max}
            className={cn(
                'relative flex w-full touch-none items-center rounded-lg select-none data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col',
                'data-disabled:bg-bg-disabled data-disabled:cursor-not-allowed',
                className
            )}
            {...props}
        >
            <SliderPrimitive.Track
                data-slot="slider-track"
                className="bg-bg-active-primary border-stroke-active-primary relative grow overflow-hidden rounded-full data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
            >
                <SliderPrimitive.Range
                    data-slot="slider-range"
                    className="bg-text-primary data-disabled:bg-text-disabled absolute select-none data-horizontal:h-full data-vertical:w-full"
                />
            </SliderPrimitive.Track>
            {Array.from({ length: _values.length }, (_, index) => (
                <SliderPrimitive.Thumb
                    data-slot="slider-thumb"
                    key={index}
                    className={cn(
                        'border-stroke-base-primary ring-text-primary bg-bg-active-secondary relative block size-3 shrink-0 rounded-full border transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3',
                        'disabled:bg-bg-active-fill-accent-secondary disabled:pointer-events-none'
                    )}
                />
            ))}
        </SliderPrimitive.Root>
    );
}

export { Slider };
