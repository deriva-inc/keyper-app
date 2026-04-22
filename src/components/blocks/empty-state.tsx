'use client';

import sampleAnimData from '../../../public/anim/sample-anim.json';
import Lottie from 'react-lottie';
import { cn } from '@/lib/utils';
import { Button } from '@/src/components/ui/button';
import { Text, TextVariant } from '@/src/components/ui/text';

/**
 * This function renders an empty state component.
 *
 * @author Aayush Goyal
 * @created 2026-04-22
 */
export default function EmptyState({
    heading,
    text,
    animData = sampleAnimData,
    className,
    primaryButtonOptions,
    secondaryButtonOptions
}: {
    heading?: string;
    text?: string;
    animData?: any;
    className?: string;
    primaryButtonOptions?: {
        text: string;
        onClick: () => void;
    };
    secondaryButtonOptions?: {
        text: string;
        onClick: () => void;
    };
}) {
    // SECTION: Constants and Variables
    const sampleAnimLottieOptions = {
        loop: true,
        autoplay: true,
        animationData: animData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    // !SECTION: Constants and Variables

    // SECTION: States
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <div
            className={cn(
                'flex h-fit w-full flex-col items-center justify-center gap-4',
                className
            )}
        >
            <div className="m-auto max-h-80 max-w-80">
                <Lottie options={sampleAnimLottieOptions} />
            </div>
            <div className="mt-8 flex flex-col items-center gap-2 text-center">
                <Text variant={TextVariant.H3}>
                    {heading || 'Woah! That looks like a black hole!'}
                </Text>
                <Text variant={TextVariant.Body}>
                    {text || 'There is no data available at the moment.'}
                </Text>
            </div>
            <div className="mt-4 flex items-center gap-4">
                {secondaryButtonOptions && (
                    <Button
                        onClick={secondaryButtonOptions.onClick}
                        variant="outline"
                    >
                        {secondaryButtonOptions.text || 'Go to Home'}
                    </Button>
                )}
                {primaryButtonOptions && (
                    <Button onClick={primaryButtonOptions.onClick}>
                        {primaryButtonOptions.text || 'Create Something'}
                    </Button>
                )}
            </div>
        </div>
    );
    // !SECTION: UI
}
