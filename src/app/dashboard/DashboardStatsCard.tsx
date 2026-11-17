'use client';

import { Text, TextVariant } from 'get-elementa-ui';
import { motion } from 'motion/react';
import React from 'react';

/**
 * This function renders a single KPI metric card on the Dashboard page.
 *
 * @author Aayush Goyal
 * @created 2026-11-18
 */
export default function DashboardStatsCard({
    statHeading,
    statIcon,
    statValue,
    statSubtext,
    cardClassName = ''
}: {
    statHeading: string;
    statIcon: React.ReactNode;
    statValue: string;
    statSubtext?: string;
    cardClassName?: string;
}) {
    // SECTION: UI
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 12 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { type: 'spring', stiffness: 280, damping: 24 }
                }
            }}
            whileHover={{ y: -2, transition: { duration: 0.18 } }}
            className={`bg-bg-raised-primary flex flex-col justify-between gap-4 rounded-2xl p-5 shadow-md transition-shadow hover:shadow-lg ${cardClassName}`}
        >
            <div className="flex items-center gap-3">
                {statIcon && (
                    <div className="bg-bg-raised-secondary text-text-accent-secondary flex size-10 shrink-0 items-center justify-center rounded-lg shadow-md">
                        {statIcon}
                    </div>
                )}
                <Text
                    variant={TextVariant.Caption}
                    className="text-text-tertiary truncate font-semibold tracking-wider uppercase"
                >
                    {statHeading}
                </Text>
            </div>

            <div className="flex flex-col gap-0.5">
                <Text
                    variant={TextVariant.H2}
                    className="text-text-primary font-mono font-bold tracking-tight tabular-nums"
                >
                    {statValue}
                </Text>
                {statSubtext && (
                    <Text
                        variant={TextVariant.Caption}
                        className="text-text-tertiary truncate"
                    >
                        {statSubtext}
                    </Text>
                )}
            </div>
        </motion.div>
    );
    // !SECTION: UI
}
