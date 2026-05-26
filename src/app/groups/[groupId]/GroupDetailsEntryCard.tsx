'use client';

import { format } from 'date-fns';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Text, TextVariant } from '@/src/components/ui/text';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/src/components/ui/tooltip';
import { cryptoService } from '@/lib/crypto';
import { VaultEntry } from '@/lib/types/model';
import { copyToClipboard, entryTypeIcons, formatKey } from '@/lib/utils';
import VaultEntryDetailsSheet from '@/src/app/vault/VaultEntryDetailsSheet';
import { Separator } from '@/src/components/ui/separator';
import { Globe, Mail, User } from 'lucide-react';
import { Calendar } from 'elementa-icons';

/**
 * This function renders the Entry details card on the Group Details page.
 *
 * @author Aayush Goyal
 * @created 2026-05-26
 */
export default function GroupDetailsEntryCard({
    groupEntry,
    index
}: {
    groupEntry: VaultEntry;
    index: number;
}) {
    // SECTION: Constants and Variables
    // !SECTION: Constants and Variables

    // SECTION: States
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    /**
     * This function handles the logic for copying the decrypted password of a vault entry to the clipboard.
     *
     * @param encryptedBlob - The encrypted blob of the vault entry.
     */
    const handleCopyPassword = async (encryptedBlob: string): Promise<void> => {
        try {
            const plainText = await cryptoService.decodeAndDecrypt(
                encryptedBlob,
                await cryptoService.getEncryptionKey()
            );

            copyToClipboard(plainText);
        } catch (err) {
            console.error(
                'Decryption failed! Did you use the wrong Master Key?',
                err
            );
        }
    };
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <motion.div
            className="bg-bg-flat-secondary w-full rounded-md p-4 shadow-sm"
            role="button"
            initial={{ scale: 1, y: 20, opacity: 0 }}
            animate={{
                scale: 1,
                y: 0,
                opacity: 1,
                transition: { duration: 0.3, delay: index * 0.1 }
            }}
            whileHover={{ scale: 1.05 }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img
                        src={groupEntry.icon}
                        alt={groupEntry.name}
                        height={32}
                        width={32}
                    />
                    <div>
                        <Text variant={TextVariant.Button}>
                            {groupEntry.name}
                        </Text>
                        <Text className="line-clamp-2">
                            {groupEntry.description}
                        </Text>
                    </div>
                </div>
                {(() => {
                    const iconObj = entryTypeIcons.find(
                        (icon) => icon.type === groupEntry.type
                    );
                    if (iconObj && iconObj.icon) {
                        const IconComponent = iconObj.icon;
                        return (
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="bg-bg-base-accent-secondary rounded-md p-2">
                                        <IconComponent
                                            height={20}
                                            width={20}
                                            stroke={0}
                                            className="text-text-primary"
                                        />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <Text>{formatKey(groupEntry.type)}</Text>
                                </TooltipContent>
                            </Tooltip>
                        );
                    }
                    return null;
                })()}
            </div>
            <Separator className="bg-bg-active-secondary my-4" />
            <div className="my-4 flex flex-col gap-4">
                <div className="flex items-center gap-1">
                    <Globe className="text-text-secondary" />
                    <Text color="text-text-secondary">Website: </Text>
                    <Link
                        href={groupEntry.websiteUrl}
                        className="font-body text-text-info text-sm font-medium underline"
                    >
                        {groupEntry.websiteUrl}
                    </Link>
                </div>
                <div className="flex items-center gap-1">
                    <Mail className="text-text-secondary" />
                    <Text color="text-text-secondary">Email: </Text>
                    <Link
                        href={groupEntry.email}
                        className="font-body text-text-info text-sm font-medium underline"
                    >
                        {groupEntry.email}
                    </Link>
                </div>
                {(groupEntry.userId || groupEntry.userName) && (
                    <div className="flex items-center gap-1">
                        <User className="text-text-secondary" />
                        <Text color="text-text-secondary">
                            User ID/Username:{' '}
                        </Text>
                        <Text className="font-medium">
                            {groupEntry.userId ?? groupEntry.userName ?? 'N/A'}
                        </Text>
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <Calendar className="text-text-secondary" />
                    <Text color="text-text-secondary">Updated At:</Text>
                    <Text className="font-medium">
                        {format(groupEntry.updatedAt.toString(), 'PPP')}
                    </Text>
                </div>
            </div>
            <div className="grid w-full grid-cols-2 items-center gap-2">
                <Button
                    variant="secondary"
                    onClick={() => handleCopyPassword(groupEntry.encryptedBlob)}
                >
                    Copy Password
                </Button>
                <VaultEntryDetailsSheet vaultEntry={groupEntry} />
            </div>
        </motion.div>
    );
    // !SECTION: UI
}
