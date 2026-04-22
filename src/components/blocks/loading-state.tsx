'use client';

import sampleAnimData from '../../../public/anim/sample-anim.json';
import Lottie from 'react-lottie';
import { cn } from '@/lib/utils';
import { Text, TextVariant } from '@/src/components/ui/text';

/**
 * This function renders a loading state component.
 *
 * @author Aayush Goyal
 * @created 2026-04-22
 */
export default function LoadingState({
    text,
    animData = sampleAnimData,
    className
}: {
    text?: string;
    animData?: any;
    className?: string;
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
            <Text variant={TextVariant.H3}>
                {text || 'Loading your data...'}
            </Text>
        </div>
    );
    // !SECTION: UI
}
