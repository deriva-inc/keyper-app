'use client';

import { Add } from 'elementa-icons';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import { GroupType } from '@/lib/types/model';
import { groupCategories, groupProviders, profileIcons } from '@/lib/utils';
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
import { Switch } from '@/src/components/ui/switch';
import { Text, TextVariant } from '@/src/components/ui/text';
import { Textarea } from '@/src/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/src/components/ui/select';

/**
 * This function renders the Create New Group Sheet which allows users to
 * create a new group.
 *
 * @author Aayush Goyal
 * @created 2026-05-13
 */
export default function CreateNewGroupSheet({
    isCreateNewGroupSheetOpen,
    setIsCreateNewGroupSheetOpen,
    showTrigger = true
}: {
    isCreateNewGroupSheetOpen: boolean;
    setIsCreateNewGroupSheetOpen: (open: boolean) => void;
    showTrigger?: boolean;
}) {
    // SECTION: Constants and Variables
    const activeProfile = useDataStore((state) => state.activeProfile);
    const profiles = useDataStore((state) => state.profiles);
    const groups = useDataStore((state) => state.groups);
    const dataActions = useDataStore((state) => state.actions);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [activeIcon, setActiveIcon] = useState<string>('google');
    const [groupType, setGroupType] = useState<GroupType>('provider');
    const [isArchived, setIsArchived] = useState<boolean>(false);
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    const handleIconClick = (iconId: string) => {
        setActiveIcon(iconId);
    };

    /**
     * This function handles the creation of a new group by sending a POST request.
     */
    const handleCreateGroup = async () => {
        try {
            const groupName = (
                document.getElementById('input-group-name') as HTMLInputElement
            ).value;
            const groupDescription = (
                document.getElementById(
                    'textarea-group-description'
                ) as HTMLTextAreaElement
            ).value;

            const jwtToken = localStorage.getItem('jwtToken');
            const createGroupRes = await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    name: groupName,
                    description: groupDescription,
                    profileId: activeProfile?.id,
                    type: groupType,
                    icon: activeIcon,
                    isArchived
                })
            });

            if (createGroupRes.ok) {
                const groupData = await createGroupRes.json();
                dataActions.setGroups([...groups, groupData.data]);
                toast.success('Group created successfully!');
                setIsCreateNewGroupSheetOpen(false);
            } else {
                toast.error('Failed to create group. Please try again.');
            }
        } catch (error: any) {
            toast.error(
                'Something went wrong while creating the group. Please try again.'
            );
            logger.error('Error while creating a new group: ', error);
        }
    };
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <Sheet
            open={isCreateNewGroupSheetOpen}
            onOpenChange={setIsCreateNewGroupSheetOpen}
        >
            {showTrigger && (
                <SheetTrigger asChild>
                    <motion.div
                        className="bg-bg-flat-primary flex min-h-64 w-80 cursor-pointer flex-col items-center justify-center gap-4 rounded-md border px-6 py-8 shadow-md active:scale-95"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="border-text-primary w-fit rounded-full border border-dashed p-4">
                            <Add
                                className="text-text-primary"
                                height={24}
                                width={24}
                            />
                        </div>
                        <Text variant={TextVariant.H3}>Create Group</Text>
                        <Text className="text-center">
                            Set up a new isolated vault for your specific needs.
                        </Text>
                    </motion.div>
                </SheetTrigger>
            )}
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        <Text
                            variant={TextVariant.H3}
                            className="text-text-accent-primary"
                        >
                            Create New Group
                        </Text>
                    </SheetTitle>
                    <SheetDescription>
                        <Text>
                            Create a new group to manage all your vault entries
                            in an isolated and contextual environment.
                        </Text>
                    </SheetDescription>
                </SheetHeader>
                <form className="px-4">
                    <Label htmlFor="input-group-name">Group Name</Label>
                    <Input className="mt-2" id="input-group-name" />
                    <Label
                        className="mt-6"
                        htmlFor="textarea-group-description"
                    >
                        Group Description
                    </Label>
                    <Textarea
                        className="mt-2"
                        id="textarea-group-description"
                    />
                    <div className="flex items-center gap-8">
                        <div>
                            <Label className="mt-6">Group Profile</Label>
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
                            <Label className="mt-6">Group Type</Label>
                            <Select
                                value={groupType}
                                onValueChange={(value) =>
                                    setGroupType(value as GroupType)
                                }
                            >
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['provider', 'category'].map((type) => (
                                        <SelectItem
                                            key={type}
                                            value={type}
                                            className="my-2 flex items-center gap-2 px-2 py-1"
                                        >
                                            <Text>
                                                {type
                                                    .substring(0, 1)
                                                    .toUpperCase() +
                                                    type.substring(1)}
                                            </Text>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Label className="mt-6">Group Icon</Label>
                    <div className="mt-2 grid grid-cols-4 items-start justify-items-center gap-4">
                        {groupType === 'category'
                            ? groupCategories.map((category, index) => (
                                  <motion.div
                                      role="button"
                                      key={index}
                                      className={`hover:bg-bg-base-accent-primary active cursor-pointer rounded-md border p-4 active:scale-95 ${activeIcon === category.id ? 'bg-bg-active-accent-primary' : 'bg-bg-active-primary'}`}
                                      initial={{ scale: 1 }}
                                      whileHover={{ scale: 1.05 }}
                                      onClick={() =>
                                          handleIconClick(category.id)
                                      }
                                  >
                                      <Image
                                          src={category.icon}
                                          alt={category.name}
                                          height={32}
                                          width={32}
                                          className={
                                              activeIcon === category.id
                                                  ? 'text-bg-base-primary'
                                                  : ''
                                          }
                                      />
                                  </motion.div>
                              ))
                            : groupProviders.map((provider, index) => (
                                  <motion.div
                                      role="button"
                                      key={index}
                                      className={`hover:bg-bg-base-accent-primary active cursor-pointer rounded-md border p-4 active:scale-95 ${activeIcon === provider.id ? 'bg-bg-active-accent-primary' : 'bg-bg-active-primary'}`}
                                      initial={{ scale: 1 }}
                                      whileHover={{ scale: 1.05 }}
                                      onClick={() =>
                                          handleIconClick(provider.id)
                                      }
                                  >
                                      <Image
                                          src={provider.icon}
                                          alt={provider.name}
                                          height={32}
                                          width={32}
                                          className={
                                              activeIcon === provider.id
                                                  ? 'text-bg-base-primary'
                                                  : ''
                                          }
                                      />
                                  </motion.div>
                              ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                        <Label className="">Archived?</Label>
                        <Switch
                            checked={isArchived}
                            onCheckedChange={(checked) =>
                                setIsArchived(checked)
                            }
                        />
                    </div>
                </form>
                <SheetFooter>
                    <Button
                        onClick={() => handleCreateGroup()}
                        className="w-full"
                    >
                        Create Group
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
