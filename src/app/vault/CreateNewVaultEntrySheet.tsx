'use client';

import { Add } from 'elementa-icons';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import { EntryType } from '@/lib/types/model';
import {
    formatKey,
    groupCategories,
    groupProviders,
    profileIcons
} from '@/lib/utils';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
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
import { Text, TextVariant } from '@/src/components/ui/text';
import { Textarea } from '@/src/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/src/components/ui/select';
import { Switch } from '@/src/components/ui/switch';
import { cryptoService } from '@/lib/crypto';

/**
 * This function renders the Create New Vault Entry Sheet which allows users to
 * create a new vault entry.
 *
 * @author Aayush Goyal
 * @created 2026-05-27
 */
export default function CreateNewVaultEntrySheet({
    isCreateNewVaultEntrySheetOpen,
    setIsCreateNewVaultEntrySheetOpen,
    showTrigger = true
}: {
    isCreateNewVaultEntrySheetOpen: boolean;
    setIsCreateNewVaultEntrySheetOpen: (open: boolean) => void;
    showTrigger?: boolean;
}) {
    // SECTION: Constants and Variables
    const activeProfile = useDataStore((state) => state.activeProfile);
    const profiles = useDataStore((state) => state.profiles);
    const groups = useDataStore((state) => state.groups);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [entryType, setEntryType] = useState<EntryType>('login');
    const [isArchived, setIsArchived] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string>('');
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    /**
     * This function handles the creation of a new vault entry by sending a POST request.
     */
    const handleCreateVaultEntry = async () => {
        try {
            const entryName = (
                document.getElementById('input-entry-name') as HTMLInputElement
            ).value;
            const entryDescription = (
                document.getElementById(
                    'textarea-entry-description'
                ) as HTMLTextAreaElement
            ).value;
            const iconUrl = (
                document.getElementById('input-entry-icon') as HTMLInputElement
            ).value;

            const encryptedBlob = await cryptoService.encryptAndEncode(
                (
                    document.getElementById(
                        'textarea-entry-eblob'
                    ) as HTMLTextAreaElement
                ).value,
                await cryptoService.getEncryptionKey()
            );
            const websiteUrl = (
                document.getElementById(
                    'input-entry-website-url'
                ) as HTMLInputElement
            ).value;
            const email = (
                document.getElementById('input-entry-email') as HTMLInputElement
            ).value;
            const userId = (
                document.getElementById(
                    'input-entry-user-id'
                ) as HTMLInputElement
            ).value;
            const userName = (
                document.getElementById(
                    'input-entry-user-name'
                ) as HTMLInputElement
            ).value;
            let cardNumber, expirationDate, securityCode;
            if (entryType === 'credit_card' || entryType === 'debit_card') {
                cardNumber = (
                    document.getElementById(
                        'input-entry-card-number'
                    ) as HTMLInputElement
                ).value;
                expirationDate = (
                    document.getElementById(
                        'input-entry-expiration-date'
                    ) as HTMLInputElement
                ).value;
                securityCode = (
                    document.getElementById(
                        'input-entry-security-code'
                    ) as HTMLInputElement
                ).value;
            }
            const customFieldsJSON = JSON.parse(
                (
                    document.getElementById(
                        'input-entry-custom-fields'
                    ) as HTMLInputElement
                ).value || '{}'
            );

            const jwtToken = localStorage.getItem('jwtToken');
            const createVaultEntryRes = await fetch('/api/entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                    'X-Profile-Id': activeProfile?.id || ''
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
                    cardNumber: cardNumber || '',
                    expirationDate: expirationDate || '',
                    securityCode: securityCode || '',
                    customFields: customFieldsJSON,
                    isFavorite,
                    isArchived
                })
            });

            const vaultEntryData = await createVaultEntryRes.json();
            if (createVaultEntryRes.ok) {
                toast.success('Vault entry created successfully!');
                setIsCreateNewVaultEntrySheetOpen(false);
            } else {
                toast.error('Failed to create vault entry. Please try again.');
                logger.error(
                    'Failed to create vault entry. Server responded with status: ',
                    vaultEntryData.error
                );
            }
        } catch (error: any) {
            toast.error(
                'Something went wrong while creating the vault entry. Please try again.'
            );
            logger.error('Error while creating a new vault entry: ', error);
        }
    };
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <Sheet
            open={isCreateNewVaultEntrySheetOpen}
            onOpenChange={setIsCreateNewVaultEntrySheetOpen}
        >
            {showTrigger && (
                <SheetTrigger asChild>
                    <Button>
                        <Add />
                        Add
                    </Button>
                </SheetTrigger>
            )}
            <SheetContent className="">
                <SheetHeader>
                    <SheetTitle>
                        <Text
                            variant={TextVariant.H3}
                            className="text-text-accent-primary"
                        >
                            Create New Vault Entry
                        </Text>
                    </SheetTitle>
                    <SheetDescription>
                        <Text>
                            Create a new group to manage all your vault entries
                            in an isolated and contextual environment.
                        </Text>
                    </SheetDescription>
                </SheetHeader>
                <form className="flex-1 overflow-y-auto px-4">
                    <Label htmlFor="input-entry-name">Vault Entry Name</Label>
                    <Input className="mt-2" id="input-entry-name" />
                    <Label
                        className="mt-6"
                        htmlFor="textarea-entry-description"
                    >
                        Vault Entry Description
                    </Label>
                    <Textarea
                        className="mt-2"
                        id="textarea-entry-description"
                    />
                    <div className="flex items-center gap-8">
                        <div>
                            <Label className="mt-6">Profile</Label>
                            <Select value={activeProfile?.id}>
                                <SelectTrigger disabled className="mt-2">
                                    <SelectValue placeholder="Select Profile" />
                                </SelectTrigger>
                                <SelectContent>
                                    {profiles.map((profile) => (
                                        <SelectItem
                                            key={profile.id}
                                            value={profile.id}
                                            className="my-2 flex items-center gap-2 px-2 py-1"
                                        >
                                            {(() => {
                                                const iconObj =
                                                    profileIcons.find(
                                                        (icon) =>
                                                            icon.id ===
                                                            profile.icon
                                                    );
                                                if (iconObj && iconObj.icon) {
                                                    const IconComponent =
                                                        iconObj.icon;
                                                    return (
                                                        <IconComponent
                                                            height={20}
                                                            width={20}
                                                            stroke={0}
                                                            className="text-text-primary mr-2"
                                                        />
                                                    );
                                                }
                                                return null;
                                            })()}
                                            <Text>{profile.name}</Text>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
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
                                            <Image
                                                src={
                                                    group.type === 'category'
                                                        ? groupCategories.find(
                                                              (category) =>
                                                                  category.id ===
                                                                  group.icon
                                                          )?.icon
                                                        : groupProviders.find(
                                                              (provider) =>
                                                                  provider.id ===
                                                                  group.icon
                                                          )?.icon
                                                }
                                                alt={group.name}
                                                height={16}
                                                width={16}
                                            />
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
                    <div>
                        <Label className="mt-6">Vault Entry Icon</Label>
                        <Input className="mt-2" id="input-entry-icon" />
                    </div>
                    {/* Encrypted Blob */}
                    <div>
                        <Label className="mt-6" htmlFor="input-entry-eblob">
                            Encrypted Blob
                        </Label>
                        <Textarea className="mt-2" id="textarea-entry-eblob" />
                    </div>
                    {/* Email */}
                    <div>
                        <Label className="mt-6">Email</Label>
                        <Input className="mt-2" id="input-entry-email" />
                    </div>
                    {/* User ID */}
                    <div>
                        <Label className="mt-6">User ID</Label>
                        <Input className="mt-2" id="input-entry-user-id" />
                    </div>
                    {/* User Name */}
                    <div>
                        <Label className="mt-6">User Name</Label>
                        <Input className="mt-2" id="input-entry-user-name" />
                    </div>
                    {/* Website URL */}
                    <div>
                        <Label className="mt-6">Website URL</Label>
                        <Input className="mt-2" id="input-entry-website-url" />
                    </div>
                    {(entryType === 'credit_card' ||
                        entryType === 'debit_card') && (
                        <div>
                            {/* Card Number */}
                            <div>
                                <Label className="mt-6">Card Number</Label>
                                <Input
                                    className="mt-2"
                                    id="input-entry-card-number"
                                />
                            </div>
                            {/* Expiration Date */}
                            <div>
                                <Label className="mt-6">Expiration Date</Label>
                                <Input
                                    className="mt-2"
                                    id="input-entry-expiration-date"
                                />
                            </div>
                            {/* Security Code */}
                            <div>
                                <Label className="mt-6">Security Code</Label>
                                <Input
                                    className="mt-2"
                                    id="input-entry-security-code"
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <Label
                            className="mt-6"
                            htmlFor="input-entry-custom-fields"
                        >
                            Custom Fields
                        </Label>
                        <Textarea
                            className="mt-2"
                            id="input-entry-custom-fields"
                        />
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                        <Label className="">Favorite?</Label>
                        <Switch
                            checked={isFavorite}
                            onCheckedChange={setIsFavorite}
                        />
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                        <Label className="">Archived?</Label>
                        <Switch
                            checked={isArchived}
                            onCheckedChange={setIsArchived}
                        />
                    </div>
                </form>
                <SheetFooter>
                    <Button
                        onClick={() => handleCreateVaultEntry()}
                        className="w-full"
                    >
                        Create Vault Entry
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
