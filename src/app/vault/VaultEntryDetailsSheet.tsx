'use client';

import { format } from 'date-fns';
import { Copy, FavoriteFilled, FavoriteOutline, Import } from 'elementa-icons';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { cryptoService } from '@/lib/crypto';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import { VaultEntry } from '@/lib/types/model';
import { Button } from '@/src/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/src/components/ui/sheet';
import { Text, TextVariant } from '@/src/components/ui/text';
import DeleteVaultEntryDialog from './DeleteVaultEntryDialog';
import {
    copyToClipboard,
    entryTypeIcons,
    formatKey,
    groupCategories,
    groupProviders,
    profileIcons
} from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/src/components/ui/tooltip';
import { CustomFieldsRenderer } from '@/src/app/vault/CustomFieldRenderer';
import UpdateVaultEntrySheet from '@/src/app/vault/UpdateVaultEntrySheet';

/**
 * This function renders the Vault Entry Details sheet.
 *
 * @author Aayush Goyal
 * @created 2026-05-27
 */
export default function VaultEntryDetailsSheet({
    vaultEntry,
    isVaultEntryDetailsSheetOpen,
    setIsVaultEntryDetailsSheetOpen
}: {
    vaultEntry: VaultEntry;
    isVaultEntryDetailsSheetOpen: boolean;
    setIsVaultEntryDetailsSheetOpen: (open: boolean) => void;
}) {
    // SECTION: Constants and Variables
    const activeProfile = useDataStore((state) => state.activeProfile);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [password, setPassword] = useState('');
    const [isUpdateVaultEntrySheetOpen, setIsUpdateVaultEntrySheetOpen] =
        useState(false);
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    /**
     * This function demonstrates how to fetch an encrypted entry from the Go backend and decrypt it on the fly in the frontend.
     *
     * @param entryId - The ID of the entry to view
     */
    const handleViewPassword = async (encryptedBlob: string): Promise<void> => {
        try {
            const plainText = await cryptoService.decodeAndDecrypt(
                encryptedBlob,
                await cryptoService.getEncryptionKey()
            );

            // Set and clear the password after 5 seconds.
            setPassword(plainText);
            setTimeout(() => {
                setPassword('');
            }, 5000);
        } catch (err) {
            console.error(
                'Decryption failed! Did you use the wrong Master Key?',
                err
            );
        }
    };

    /**
     * This function toggles the favorite status of the vault entry by making an API call to the server.
     */
    const handleToggleFavorite = async (): Promise<void> => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const toggleFavoriteRes = await fetch(
                `/api/entries/${vaultEntry.id}/favorite`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`,
                        'X-Profile-Id': activeProfile?.id || '',
                        'X-Entry-Id': vaultEntry.id
                    }
                }
            );

            const toggleFavoriteData = await toggleFavoriteRes.json();

            if (toggleFavoriteRes.ok) {
                vaultEntry.isFavorite = toggleFavoriteData.data.isFavorite;
                toast.success(
                    `Entry marked as ${
                        vaultEntry.isFavorite ? 'favorite' : 'not favorite'
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
        <Sheet
            open={isVaultEntryDetailsSheetOpen}
            onOpenChange={setIsVaultEntryDetailsSheetOpen}
        >
            <SheetTrigger asChild>
                <Button>Details</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="border-b shadow-md">
                    <div className="flex items-center gap-2">
                        <img
                            src={vaultEntry.icon || ''}
                            alt={vaultEntry.name}
                            height={32}
                            width={32}
                        />
                        <SheetTitle>{vaultEntry.name}</SheetTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite()}
                        >
                            {vaultEntry.isFavorite ? (
                                <FavoriteFilled />
                            ) : (
                                <FavoriteOutline />
                            )}
                        </Button>
                        {vaultEntry.isArchived && <Import />}
                    </div>
                    <SheetDescription>
                        {vaultEntry.description}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-1 flex-col gap-10 overflow-y-auto px-4">
                    {/* A */}
                    <div className="flex items-center justify-between">
                        <div>
                            <Text
                                variant={TextVariant.H4}
                                color="text-text-accent-primary"
                            >
                                Website
                            </Text>
                            <Link
                                href={vaultEntry.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-info font-body text-md font-medium underline"
                            >
                                {vaultEntry.websiteUrl}
                            </Link>
                        </div>
                        {(() => {
                            const iconObj = entryTypeIcons.find(
                                (icon) => icon.type === vaultEntry.type
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
                                            <Text>
                                                {formatKey(vaultEntry.type)}
                                            </Text>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            }
                            return null;
                        })()}
                    </div>
                    {/* Password / PIN */}
                    <div className="flex flex-col gap-2">
                        <Text
                            variant={TextVariant.H4}
                            color="text-text-accent-primary"
                        >
                            Password / PIN
                        </Text>
                        <div className="bg-bg-active-primary flex items-center justify-between rounded-md px-4 py-3">
                            <Text variant={TextVariant.Button}>
                                {password || '••••••••'}
                            </Text>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    handleViewPassword(vaultEntry.encryptedBlob)
                                }
                            >
                                <Eye />
                            </Button>
                        </div>
                    </div>
                    <IdentityDetailsSection
                        email={vaultEntry.email}
                        userId={vaultEntry.userId}
                        username={vaultEntry.userName}
                    />
                    <ParentInfoSection
                        profileId={vaultEntry.profileId}
                        groupId={vaultEntry.groupId}
                    />
                    {(vaultEntry.type === 'credit_card' ||
                        vaultEntry.type === 'debit_card') && (
                        <CardDetailsSection
                            cardNumber={vaultEntry.cardNumber}
                            expirationDate={vaultEntry.expirationDate}
                            securityCode={vaultEntry.securityCode}
                        />
                    )}
                    <CustomFieldsRenderer
                        customFields={vaultEntry.customFields}
                    />
                    <MetadataSection
                        createdAt={vaultEntry.createdAt}
                        updatedAt={vaultEntry.updatedAt}
                    />
                </div>
                <SheetFooter>
                    <DeleteVaultEntryDialog
                        vaultEntry={vaultEntry}
                        setIsVaultEntryDetailsSheetOpen={
                            setIsVaultEntryDetailsSheetOpen
                        }
                    />
                    <UpdateVaultEntrySheet
                        vaultEntry={vaultEntry}
                        isUpdateVaultEntrySheetOpen={
                            isUpdateVaultEntrySheetOpen
                        }
                        setIsUpdateVaultEntrySheetOpen={
                            setIsUpdateVaultEntrySheetOpen
                        }
                    />
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
    // !SECTION: UI
}

/**
 * This function renders the Identity Details section for entries.
 */
const IdentityDetailsSection = ({
    email,
    userId,
    username
}: {
    email: string;
    userId: string;
    username: string;
}) => {
    return (
        <div className="flex flex-col gap-2">
            <Text variant={TextVariant.H4} color="text-text-accent-primary">
                Identity Details
            </Text>
            <div className="bg-bg-active-fill-accent-secondary flex flex-col gap-1 rounded-md p-4 shadow-sm">
                <Text variant={TextVariant.H6}>Email</Text>
                <div className="flex items-center justify-between">
                    <Text variant={TextVariant.Button}>{email}</Text>
                    <Button
                        onClick={() => copyToClipboard(email)}
                        variant="ghost"
                        size="sm"
                    >
                        <Copy />
                    </Button>
                </div>
            </div>
            {userId && (
                <div className="bg-bg-active-fill-accent-secondary flex flex-col gap-1 rounded-md p-4 shadow-sm">
                    <Text variant={TextVariant.H6}>User Id</Text>
                    <div className="flex items-center justify-between">
                        <Text variant={TextVariant.Button}>{userId}</Text>
                        <Button
                            onClick={() => copyToClipboard(userId)}
                            variant="ghost"
                            size="sm"
                        >
                            <Copy />
                        </Button>
                    </div>
                </div>
            )}
            {username && (
                <div className="bg-bg-active-fill-accent-secondary flex flex-col gap-1 rounded-md p-4 shadow-sm">
                    <Text variant={TextVariant.H6}>Username</Text>
                    <div className="flex items-center justify-between">
                        <Text variant={TextVariant.Button}>{username}</Text>
                        <Button
                            onClick={() => copyToClipboard(username)}
                            variant="ghost"
                            size="sm"
                        >
                            <Copy />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * This function renders the parent information section of the vault entry.
 */
const ParentInfoSection = ({
    profileId,
    groupId
}: {
    profileId: string;
    groupId?: string | null;
}) => {
    const groups = useDataStore((state) => state.groups);
    const profiles = useDataStore((state) => state.profiles);

    return (
        <div className="grid grid-cols-2 gap-y-2">
            <Text
                variant={TextVariant.H4}
                className="col-span-2"
                color="text-text-accent-primary"
            >
                Parent Information
            </Text>
            {/* Profile ID */}
            <div className="flex flex-col gap-2">
                <Text variant={TextVariant.H6}>Profile</Text>
                <div className="flex items-center gap-1">
                    {(() => {
                        const entryProfile = profiles.find(
                            (profile) => profile.id === profileId
                        );
                        const iconObj = profileIcons.find(
                            (iconId) => iconId.id === entryProfile?.icon
                        );
                        if (iconObj && iconObj.icon) {
                            const IconComponent = iconObj.icon;
                            return (
                                <IconComponent
                                    height={20}
                                    width={20}
                                    stroke={0}
                                    className="text-text-primary"
                                />
                            );
                        }
                        return null;
                    })()}
                    <Text variant={TextVariant.Button}>
                        {
                            profiles.find((profile) => profile.id === profileId)
                                ?.name
                        }
                    </Text>
                </div>
            </div>
            {/* Group ID */}
            <div className="flex flex-col gap-2">
                <Text variant={TextVariant.H6}>Group</Text>
                <div className="flex items-center gap-1">
                    {(() => {
                        const entryGroup = groups.find(
                            (group) => group.id === groupId
                        );
                        return (
                            entryGroup && (
                                <Image
                                    src={
                                        entryGroup.type === 'category'
                                            ? groupCategories.find(
                                                  (category) =>
                                                      category.id ===
                                                      entryGroup.icon
                                              )?.icon
                                            : groupProviders.find(
                                                  (provider) =>
                                                      provider.id ===
                                                      entryGroup.icon
                                              )?.icon
                                    }
                                    alt={entryGroup?.name ?? 'N/A'}
                                    height={24}
                                    width={24}
                                />
                            )
                        );
                    })()}
                    <Text variant={TextVariant.Button}>
                        {groups.find((group) => group.id === groupId)?.name ??
                            'N/A'}
                    </Text>
                </div>
            </div>
        </div>
    );
};

/**
 * This function renders the Card Details section for credit/debit card entries.
 */
const CardDetailsSection = ({
    cardNumber,
    expirationDate,
    securityCode
}: {
    cardNumber: string;
    expirationDate: string;
    securityCode: string;
}) => {
    const [securityCodeVisible, setSecurityCodeVisible] = useState(false);

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <Text
                className="col-span-2"
                variant={TextVariant.H4}
                color="text-text-accent-primary"
            >
                Card Details
            </Text>
            <div className="bg-bg-active-primary col-span-2 flex flex-col gap-1 rounded-md px-4 py-3">
                <div className="flex items-center justify-between">
                    <Text
                        variant={TextVariant.Body}
                        color="text-text-secondary"
                    >
                        Card Number
                    </Text>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(cardNumber)}
                    >
                        <Copy />
                    </Button>
                </div>
                <Text variant={TextVariant.Button}>{cardNumber}</Text>
            </div>
            <div className="bg-bg-active-primary flex flex-col gap-1 rounded-md px-4 py-3">
                <Text variant={TextVariant.Body} color="text-text-secondary">
                    Expiration Date
                </Text>
                <Text variant={TextVariant.Button}>{expirationDate}</Text>
            </div>
            <div className="bg-bg-active-primary flex flex-col gap-1 rounded-md px-4 py-3">
                <Text variant={TextVariant.Body} color="text-text-secondary">
                    Security Code
                </Text>
                <div className="flex items-center justify-between">
                    <Text variant={TextVariant.Button}>
                        {securityCodeVisible ? securityCode : '•••'}
                    </Text>
                    <Eye
                        onClick={() =>
                            setSecurityCodeVisible(!securityCodeVisible)
                        }
                    />
                </div>
            </div>
        </div>
    );
};

const MetadataSection = ({
    createdAt,
    updatedAt
}: {
    createdAt: Date;
    updatedAt: Date;
}) => {
    return (
        <div className="flex flex-col gap-2">
            <Text variant={TextVariant.H4} color="text-text-accent-primary">
                System Information
            </Text>
            <div className="my-2 flex items-center justify-between">
                <Text variant={TextVariant.Body}>Created At:</Text>
                <Text variant={TextVariant.Button}>
                    {format(createdAt, 'PPpp')}
                </Text>
            </div>
            <div className="flex items-center justify-between">
                <Text variant={TextVariant.Body}>Updated At:</Text>
                <Text variant={TextVariant.Button}>
                    {format(updatedAt, 'PPpp')}
                </Text>
            </div>
        </div>
    );
};
