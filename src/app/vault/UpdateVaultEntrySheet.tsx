'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { formatKey } from '@/lib/utils';
import { cryptoService } from '@/lib/crypto';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import { EntryType, VaultEntry } from '@/lib/types/model';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/src/components/ui/select';
import { Text, TextVariant } from '@/src/components/ui/text';
import { Textarea } from '@/src/components/ui/textarea';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/src/components/ui/sheet';

/**
 * This function renders the Update Vault Entry Sheet, which allows users to update the details of an existing vault entry.
 *
 * @author Aayush Goyal
 * @created 2026-05-27
 */
export default function UpdateVaultEntrySheet({
    vaultEntry,
    isUpdateVaultEntrySheetOpen,
    setIsUpdateVaultEntrySheetOpen
}: {
    vaultEntry: VaultEntry;
    isUpdateVaultEntrySheetOpen: boolean;
    setIsUpdateVaultEntrySheetOpen: (open: boolean) => void;
}) {
    // SECTION: Constants and Variables
    const activeProfile = useDataStore((state) => state.activeProfile);
    const groups = useDataStore((state) => state.groups);
    // !SECTION: Constants and Variables

    // SECTION: States
    // All states are pre-populated with the existing vault entry's data.
    const [entryType, setEntryType] = useState<EntryType>(vaultEntry.type);
    const [selectedGroupId, setSelectedGroupId] = useState<string>(
        vaultEntry.groupId || ''
    );
    const [isFavorite, setIsFavorite] = useState<boolean>(
        vaultEntry.isFavorite
    );
    const [isArchived, setIsArchived] = useState<boolean>(
        vaultEntry.isArchived
    );
    const [password, setPassword] = useState<string>('');
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    const decryptAndSetPassword = async () => {
        const decryptedPassword = await cryptoService.decodeAndDecrypt(
            vaultEntry.encryptedBlob,
            await cryptoService.getEncryptionKey()
        );
        setPassword(decryptedPassword);
    };

    /**
     * Handles updating the vault entry by reading the form fields,
     * re-encrypting the blob, and sending a PATCH request to the backend.
     */
    const handleUpdateVaultEntry = async () => {
        try {
            const entryName = (
                document.getElementById(
                    'input-update-entry-name'
                ) as HTMLInputElement
            ).value;
            const entryDescription = (
                document.getElementById(
                    'textarea-update-entry-description'
                ) as HTMLTextAreaElement
            ).value;
            const iconUrl = (
                document.getElementById(
                    'input-update-entry-icon'
                ) as HTMLInputElement
            ).value;

            // Re-encrypt the blob with the user's encryption key.
            const encryptedBlob = await cryptoService.encryptAndEncode(
                (
                    document.getElementById(
                        'textarea-update-entry-eblob'
                    ) as HTMLTextAreaElement
                ).value,
                await cryptoService.getEncryptionKey()
            );

            const websiteUrl = (
                document.getElementById(
                    'input-update-entry-website-url'
                ) as HTMLInputElement
            ).value;
            const email = (
                document.getElementById(
                    'input-update-entry-email'
                ) as HTMLInputElement
            ).value;
            const userId = (
                document.getElementById(
                    'input-update-entry-user-id'
                ) as HTMLInputElement
            ).value;
            const userName = (
                document.getElementById(
                    'input-update-entry-user-name'
                ) as HTMLInputElement
            ).value;

            // Only read card fields if the type is credit or debit card.
            let cardNumber, expirationDate, securityCode;
            if (entryType === 'credit_card' || entryType === 'debit_card') {
                cardNumber = (
                    document.getElementById(
                        'input-update-entry-card-number'
                    ) as HTMLInputElement
                ).value;
                expirationDate = (
                    document.getElementById(
                        'input-update-entry-expiration-date'
                    ) as HTMLInputElement
                ).value;
                securityCode = (
                    document.getElementById(
                        'input-update-entry-security-code'
                    ) as HTMLInputElement
                ).value;
            }

            const customFields = (
                document.getElementById(
                    'input-update-entry-custom-fields'
                ) as HTMLTextAreaElement
            ).value;

            const jwtToken = localStorage.getItem('jwtToken');

            const updateEntryRes = await fetch(
                `/api/entries/${vaultEntry.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`,
                        'X-Profile-Id': activeProfile?.id || '',
                        // Pass the entryId as a header for the Next.js route handler.
                        'x-entry-id': vaultEntry.id
                    },
                    body: JSON.stringify({
                        name: entryName,
                        description: entryDescription,
                        groupId: selectedGroupId,
                        type: entryType,
                        icon: iconUrl,
                        encryptedBlob,
                        websiteUrl,
                        email,
                        userId,
                        userName,
                        cardNumber: cardNumber || null,
                        expirationDate: expirationDate || null,
                        securityCode: securityCode || null,
                        // Only send customFields if it's valid JSON; otherwise omit it.
                        customFields: customFields
                            ? JSON.parse(customFields)
                            : null,
                        isFavorite,
                        isArchived
                    })
                }
            );

            const vaultEntryData = await updateEntryRes.json();

            if (updateEntryRes.ok) {
                toast.success('Vault entry updated successfully.');
                setIsUpdateVaultEntrySheetOpen(false);
            } else {
                toast.error(
                    vaultEntryData.error ||
                        'Failed to update vault entry. Please try again.'
                );
                logger.error(
                    'Error updating vault entry: ',
                    vaultEntryData.error
                );
            }
        } catch (error: any) {
            toast.error(
                'Something went wrong while updating the vault entry. Please try again.'
            );
            logger.error('Error while updating a vault entry: ', error);
        }
    };
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // Sync the state values whenever the vaultEntry prop changes.
    // This ensures the form is always populated with the latest data when re-opened.
    useEffect(() => {
        decryptAndSetPassword();
        setEntryType(vaultEntry.type);
        setSelectedGroupId(vaultEntry.groupId || '');
        setIsFavorite(vaultEntry.isFavorite);
        setIsArchived(vaultEntry.isArchived);
    }, [vaultEntry]);
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <Sheet
            open={isUpdateVaultEntrySheetOpen}
            onOpenChange={setIsUpdateVaultEntrySheetOpen}
        >
            <SheetTrigger asChild>
                <Button variant="default">Update Details</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        <Text
                            variant={TextVariant.H3}
                            className="text-text-accent-primary"
                        >
                            Update Vault Entry
                        </Text>
                    </SheetTitle>
                    <SheetDescription>
                        <Text>
                            Update the details of your vault entry below.
                        </Text>
                    </SheetDescription>
                </SheetHeader>
                <form className="flex-1 overflow-y-auto px-4">
                    {/* Entry Name */}
                    <Label htmlFor="input-update-entry-name">
                        Vault Entry Name
                    </Label>
                    <Input
                        className="mt-2"
                        id="input-update-entry-name"
                        defaultValue={vaultEntry.name}
                    />

                    {/* Entry Description */}
                    <Label
                        className="mt-6"
                        htmlFor="textarea-update-entry-description"
                    >
                        Vault Entry Description
                    </Label>
                    <Textarea
                        className="mt-2"
                        id="textarea-update-entry-description"
                        defaultValue={vaultEntry.description || ''}
                    />

                    {/* Profile & Group selectors */}
                    <div className="flex items-center gap-8">
                        {/* Profile is read-only — entries cannot be moved between profiles. */}
                        <div>
                            <Label className="mt-6">Profile</Label>
                            <Select value={activeProfile?.id}>
                                <SelectTrigger disabled className="mt-2">
                                    <SelectValue
                                        placeholder={activeProfile?.name}
                                    />
                                </SelectTrigger>
                            </Select>
                        </div>
                        <div>
                            <Label className="mt-6">Group</Label>
                            <Select
                                value={selectedGroupId}
                                onValueChange={(value) =>
                                    setSelectedGroupId(value)
                                }
                            >
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select Entry Group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {groups.map((group) => (
                                        <SelectItem
                                            key={group.id}
                                            value={group.id}
                                            className="my-2 flex items-center gap-2 px-2 py-1"
                                        >
                                            <Text>
                                                {group.name
                                                    .substring(0, 1)
                                                    .toUpperCase() +
                                                    group.name.substring(1)}
                                            </Text>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Entry Type */}
                    <div>
                        <Label className="mt-6">Entry Type</Label>
                        <Select
                            value={entryType}
                            onValueChange={(value) =>
                                setEntryType(value as EntryType)
                            }
                        >
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select Entry Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                    'login',
                                    'credit_card',
                                    'debit_card',
                                    'bank_account',
                                    'upi_id',
                                    'identity_card',
                                    'secure_note'
                                ].map((type) => (
                                    <SelectItem
                                        key={type}
                                        value={type}
                                        className="my-2 flex items-center gap-2 px-2 py-1"
                                    >
                                        <Text>{formatKey(type)}</Text>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Icon */}
                    <div>
                        <Label className="mt-6">Vault Entry Icon</Label>
                        <Input
                            className="mt-2"
                            id="input-update-entry-icon"
                            defaultValue={vaultEntry.icon || ''}
                        />
                    </div>

                    {/* Encrypted Blob */}
                    <div>
                        <Label
                            className="mt-6"
                            htmlFor="textarea-update-entry-eblob"
                        >
                            Encrypted Blob
                        </Label>
                        <Textarea
                            className="mt-2"
                            id="textarea-update-entry-eblob"
                            defaultValue={password || ''}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <Label className="mt-6">Email</Label>
                        <Input
                            className="mt-2"
                            id="input-update-entry-email"
                            defaultValue={vaultEntry.email || ''}
                        />
                    </div>

                    {/* User ID */}
                    <div>
                        <Label className="mt-6">User ID</Label>
                        <Input
                            className="mt-2"
                            id="input-update-entry-user-id"
                            defaultValue={vaultEntry.userId || ''}
                        />
                    </div>

                    {/* User Name */}
                    <div>
                        <Label className="mt-6">User Name</Label>
                        <Input
                            className="mt-2"
                            id="input-update-entry-user-name"
                            defaultValue={vaultEntry.userName || ''}
                        />
                    </div>

                    {/* Website URL */}
                    <div>
                        <Label className="mt-6">Website URL</Label>
                        <Input
                            className="mt-2"
                            id="input-update-entry-website-url"
                            defaultValue={vaultEntry.websiteUrl || ''}
                        />
                    </div>

                    {/* Card fields — only shown for credit/debit card types */}
                    {(entryType === 'credit_card' ||
                        entryType === 'debit_card') && (
                        <div>
                            <div>
                                <Label className="mt-6">Card Number</Label>
                                <Input
                                    className="mt-2"
                                    id="input-update-entry-card-number"
                                    defaultValue={vaultEntry.cardNumber || ''}
                                />
                            </div>
                            <div>
                                <Label className="mt-6">Expiration Date</Label>
                                <Input
                                    className="mt-2"
                                    id="input-update-entry-expiration-date"
                                    defaultValue={
                                        vaultEntry.expirationDate || ''
                                    }
                                />
                            </div>
                            <div>
                                <Label className="mt-6">Security Code</Label>
                                <Input
                                    className="mt-2"
                                    id="input-update-entry-security-code"
                                    defaultValue={vaultEntry.securityCode || ''}
                                />
                            </div>
                        </div>
                    )}

                    {/* Custom Fields */}
                    <div>
                        <Label
                            className="mt-6"
                            htmlFor="input-update-entry-custom-fields"
                        >
                            Custom Fields
                        </Label>
                        <Textarea
                            className="mt-2"
                            id="input-update-entry-custom-fields"
                            // Pretty-print the existing JSON for easy editing.
                            defaultValue={
                                vaultEntry.customFields
                                    ? JSON.stringify(
                                          vaultEntry.customFields,
                                          null,
                                          2
                                      )
                                    : ''
                            }
                        />
                    </div>

                    {/* Favorite toggle */}
                    <div className="mt-6 flex items-center justify-between">
                        <Label>Favorite?</Label>
                        <Switch
                            checked={isFavorite}
                            onCheckedChange={setIsFavorite}
                        />
                    </div>

                    {/* Archived toggle */}
                    <div className="mt-6 flex items-center justify-between">
                        <Label>Archived?</Label>
                        <Switch
                            checked={isArchived}
                            onCheckedChange={setIsArchived}
                        />
                    </div>
                </form>
                <SheetFooter>
                    <Button
                        onClick={() => handleUpdateVaultEntry()}
                        className="w-full"
                    >
                        Update Vault Entry
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" className="w-full">
                            Cancel
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
    // !SECTION: UI
}
