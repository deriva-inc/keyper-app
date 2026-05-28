'use client';

import { format } from 'date-fns';
import { Import } from 'elementa-icons';
import { EyeIcon, EyeOffIcon, Globe, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { VaultEntry } from '@/lib/types/model';
import { formatKey } from '@/lib/utils';
import VaultEntryDetailsSheet from '@/src/app/vault/VaultEntryDetailsSheet';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { TableCell, TableRow } from '@/src/components/ui/table';
import { Text, TextVariant } from '@/src/components/ui/text';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/src/components/ui/tooltip';
import { cryptoService } from '@/lib/crypto';
import logger from '@/lib/logger';
import { toast } from 'sonner';
import { useDataStore } from '@/lib/data-store';

/**
 * This function renders a single vault entry as a row in the vault entries table on the
 *
 * @author Aayush Goyal
 * @created 2026-05-28
 */
export default function VaultEntryTableRowItem({
    entry,
    groupName,
    groupIconUrl,
    TypeIconComponent
}: {
    entry: VaultEntry;
    groupName?: string;
    groupIconUrl?: string;
    TypeIconComponent?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
    // SECTION: Constants and Variables
    const activeProfile = useDataStore((state) => state.activeProfile);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [revealedPasswords, setRevealedPasswords] = useState<string>('');
    const [isVaultEntryDetailsSheetOpen, setIsVaultEntryDetailsSheetOpen] =
        useState<Map<string, boolean>>(new Map());
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    /**
     * Toggles the password visibility for a given entry.
     * Reveals it for 10 seconds, then hides it automatically.
     */
    const handleTogglePassword = async (entry: VaultEntry): Promise<void> => {
        // If already revealed, hide it immediately.
        if (revealedPasswords !== '') {
            setRevealedPasswords('');
            return;
        }

        try {
            const plainText = await cryptoService.decodeAndDecrypt(
                entry.encryptedBlob,
                await cryptoService.getEncryptionKey()
            );
            setRevealedPasswords(plainText);

            // Auto-hide after 7 seconds.
            setTimeout(() => {
                setRevealedPasswords('');
            }, 7000);
        } catch (err) {
            logger.error('Decryption failed!', err);
            toast.error('Decryption failed. Did you use the wrong Master Key?');
        }
    };

    /**
     * This function toggles the favorite status of the vault entry by making an API call to the server.
     */
    const handleToggleFavorite = async (): Promise<void> => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const toggleFavoriteRes = await fetch(
                `/api/entries/${entry.id}/favorite`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`,
                        'X-Profile-Id': activeProfile?.id || '',
                        'X-Entry-Id': entry.id
                    }
                }
            );

            const toggleFavoriteData = await toggleFavoriteRes.json();

            if (toggleFavoriteRes.ok) {
                entry.isFavorite = toggleFavoriteData.data.isFavorite;
                toast.success(
                    `Entry marked as ${
                        entry.isFavorite ? 'favorite' : 'not favorite'
                    }.`
                );
            } else {
                toast.error(
                    'Failed to update favorite status. Please try again.'
                );
                logger.error(
                    'Failed to toggle favorite status:',
                    toggleFavoriteData.message
                );
            }
        } catch (error: any) {
            logger.error('Failed to toggle favorite status:', error);
            toast.error('Failed to update favorite status. Please try again.');
        }
    };
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <TableRow key={entry.id} className="my-1">
            {/* COL 1: Icon • Name • Type • Email */}
            <TableCell className="py-4 pl-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        {/* Entry icon (favicon / custom icon) */}
                        <div className="bg-bg-active-fill-accent-primary flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
                            {entry.icon ? (
                                <img
                                    src={entry.icon}
                                    alt={entry.name}
                                    height={24}
                                    width={24}
                                />
                            ) : TypeIconComponent ? (
                                <TypeIconComponent
                                    height={20}
                                    width={20}
                                    className="text-text-secondary"
                                />
                            ) : (
                                <span className="text-text-tertiary font-bold uppercase">
                                    {entry.name.substring(0, 2)}
                                </span>
                            )}
                        </div>

                        {/* Name, type badge, email */}
                        <div className="flex min-w-0 flex-col gap-2">
                            <Text
                                variant={TextVariant.Button}
                                className="truncate"
                            >
                                {entry.name}
                            </Text>
                            <Badge
                                variant="secondary"
                                className="bg-bg-active-fill-accent-secondary w-fit"
                            >
                                {TypeIconComponent && (
                                    <TypeIconComponent height={16} width={16} />
                                )}

                                {formatKey(entry.type)}
                            </Badge>
                        </div>
                    </div>
                    <Text>
                        {entry.email && (
                            <Text className="text-text-info truncate">
                                {entry.email}
                            </Text>
                        )}
                    </Text>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <Text className="font-mono" variant={TextVariant.Subtitle1}>
                        {revealedPasswords !== ''
                            ? revealedPasswords
                            : '••••••••'}
                    </Text>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 shrink-0"
                                onClick={() => handleTogglePassword(entry)}
                            >
                                {revealedPasswords !== '' ? (
                                    <EyeOffIcon className="h-4 w-4" />
                                ) : (
                                    <EyeIcon className="h-4 w-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <Text>
                                {revealedPasswords !== ''
                                    ? 'Hide password'
                                    : 'Reveal password'}
                            </Text>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TableCell>

            <TableCell>
                {groupName ? (
                    <div className="flex items-center gap-2">
                        {groupIconUrl && (
                            <Image
                                src={groupIconUrl}
                                alt={groupName}
                                height={18}
                                width={18}
                            />
                        )}
                        <Text className="">
                            {groupName.substring(0, 1).toUpperCase() +
                                groupName.substring(1)}
                        </Text>
                    </div>
                ) : (
                    <Text
                        variant={TextVariant.Button}
                        className="text-text-secondary"
                    >
                        N/A
                    </Text>
                )}
            </TableCell>

            {/* COL 4: Updated At + Website URL */}
            <TableCell>
                <div className="flex flex-col gap-1">
                    <Text className="text-text-secondary">
                        {format(new Date(entry.updatedAt), 'PP')}
                    </Text>
                </div>
            </TableCell>

            {/* COL 5: isFav, isArch indicators + Details + Delete */}
            <TableCell className="pr-4">
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center justify-end gap-1">
                        {/* Favorite indicator */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-md ${
                                        entry.isFavorite
                                            ? 'text-red-500'
                                            : 'text-text-tertiary'
                                    }`}
                                    onClick={() => handleToggleFavorite()}
                                >
                                    <Heart
                                        className={`h-5 w-5 ${entry.isFavorite ? 'fill-red-500' : ''}`}
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <Text>
                                    {entry.isFavorite
                                        ? 'Favorite'
                                        : 'Not a favorite'}
                                </Text>
                            </TooltipContent>
                        </Tooltip>

                        {/* Archived indicator */}
                        {entry.isArchived && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-text-warning flex h-7 w-7 items-center justify-center rounded-md">
                                        <Import className="h-5 w-5" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <Text>Archived</Text>
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {/* Details sheet trigger */}
                        <VaultEntryDetailsSheet
                            vaultEntry={entry}
                            isVaultEntryDetailsSheetOpen={
                                isVaultEntryDetailsSheetOpen.get(entry.id) ||
                                false
                            }
                            setIsVaultEntryDetailsSheetOpen={(
                                open: boolean
                            ) => {
                                setIsVaultEntryDetailsSheetOpen((prev) => {
                                    const next = new Map(prev);
                                    next.set(entry.id, open);
                                    return next;
                                });
                            }}
                        />
                    </div>
                    {entry.websiteUrl && (
                        <Link
                            href={entry.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-info flex items-center gap-1 truncate hover:underline"
                        >
                            <Globe className="h-3 w-3 shrink-0" />
                            {entry.websiteUrl.replace(/^https?:\/\//, '')}
                        </Link>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
    // !SECTION: UI
}
