'use client';

import { Edit } from 'elementa-icons';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDataStore } from '@/lib/data-store';
import logger from '@/lib/logger';
import { Group, GroupType } from '@/lib/types/model';
import { groupCategories, groupProviders, profileIcons } from '@/lib/utils';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/src/components/ui/select';
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

/**
 * This function renders the Update Group Details Sheet which allows users to
 * update an existing group's details.
 *
 * @author Aayush Goyal
 * @created 2026-05-19
 */
export default function UpdateGroupDetailsSheet({
    groupDetails,
    updateGroupDetails
}: {
    groupDetails: Group;
    updateGroupDetails: (group: Group) => void;
}) {
    // SECTION: Constants and Variables
    const profiles = useDataStore((state) => state.profiles);
    const groups = useDataStore((state) => state.groups);
    const dataActions = useDataStore((state) => state.actions);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [editGroupDetails, setEditGroupDetails] = useState({
        name: groupDetails.name,
        description: groupDetails.description || '',
        profileId: groupDetails.profileId,
        icon: groupDetails.icon,
        type: groupDetails.type,
        isArchived: groupDetails.isArchived
    });
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    const handleIconClick = (iconId: string) => {
        setEditGroupDetails((prev) => ({ ...prev, icon: iconId }));
    };

    /**
     * This function handles the creation of a new group by sending a POST request.
     */
    const handleUpdateGroup = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const createGroupRes = await fetch(
                `/api/groups/${groupDetails.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`,
                        'X-Group-Id': groupDetails.id
                    },
                    body: JSON.stringify({
                        name: editGroupDetails.name,
                        description: editGroupDetails.description,
                        profileId: editGroupDetails.profileId,
                        type: editGroupDetails.type,
                        icon: editGroupDetails.icon,
                        isArchived: editGroupDetails.isArchived
                    })
                }
            );

            if (createGroupRes.ok) {
                const groupData = await createGroupRes.json();
                dataActions.setGroups(
                    groups.map((group) =>
                        group.id === groupData.data.id ? groupData.data : group
                    )
                );
                updateGroupDetails(groupData.data);
                toast.success('Group updated successfully!');
                setIsSheetOpen(false);
            } else {
                toast.error('Failed to update group. Please try again.');
            }
        } catch (error: any) {
            toast.error(
                'Something went wrong while updating the group. Please try again.'
            );
            logger.error('Error while updating the group: ', error);
        }
    };
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <Sheet open={isSheetOpen} onOpenChange={(open) => setIsSheetOpen(open)}>
            <SheetTrigger asChild>
                <Button
                    variant="secondary"
                    onClick={() => setIsSheetOpen(true)}
                >
                    <Edit height={24} width={24} />
                    Update
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        <Text
                            variant={TextVariant.H3}
                            className="text-text-accent-primary"
                        >
                            Update Group
                        </Text>
                    </SheetTitle>
                    <SheetDescription>
                        <Text>
                            Update the details of your group to manage all your
                            vault entries in an isolated and contextual
                            environment.
                        </Text>
                    </SheetDescription>
                </SheetHeader>
                <form className="px-4">
                    <Label htmlFor="input-group-name">Group Name</Label>
                    <Input
                        className="mt-2"
                        id="input-group-name"
                        value={editGroupDetails.name}
                        onChange={(e) =>
                            setEditGroupDetails({
                                ...editGroupDetails,
                                name: e.target.value
                            })
                        }
                    />
                    <Label
                        className="mt-6"
                        htmlFor="textarea-group-description"
                    >
                        Group Description
                    </Label>
                    <Textarea
                        className="mt-2"
                        id="textarea-group-description"
                        value={editGroupDetails.description}
                        onChange={(e) =>
                            setEditGroupDetails({
                                ...editGroupDetails,
                                description: e.target.value
                            })
                        }
                    />
                    <div className="flex items-center gap-8">
                        <div>
                            <Label className="mt-6">Group Profile</Label>
                            <Select
                                value={editGroupDetails?.profileId}
                                onValueChange={(value) =>
                                    setEditGroupDetails({
                                        ...editGroupDetails,
                                        profileId: value
                                    })
                                }
                            >
                                <SelectTrigger className="mt-2">
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
                                value={editGroupDetails.type}
                                onValueChange={(value) =>
                                    setEditGroupDetails({
                                        ...editGroupDetails,
                                        type: value as GroupType
                                    })
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
                        {editGroupDetails.type === 'category'
                            ? groupCategories.map((category, index) => (
                                  <motion.div
                                      role="button"
                                      key={index}
                                      className={`hover:bg-bg-base-accent-primary active cursor-pointer rounded-md border p-4 active:scale-95 ${editGroupDetails.icon === category.id ? 'bg-bg-active-accent-primary' : 'bg-bg-active-primary'}`}
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
                                          className={`object-cover ${
                                              groupDetails.icon === category.id
                                                  ? 'text-bg-base-primary'
                                                  : ''
                                          }`}
                                      />
                                  </motion.div>
                              ))
                            : groupProviders.map((provider, index) => (
                                  <motion.div
                                      role="button"
                                      key={index}
                                      className={`hover:bg-bg-base-accent-primary active cursor-pointer rounded-md border p-4 active:scale-95 ${editGroupDetails.icon === provider.id ? 'bg-bg-active-accent-primary' : 'bg-bg-active-primary'}`}
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
                                              groupDetails.icon === provider.id
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
                            checked={editGroupDetails.isArchived}
                            onCheckedChange={(checked) =>
                                setEditGroupDetails({
                                    ...editGroupDetails,
                                    isArchived: checked
                                })
                            }
                        />
                    </div>
                </form>
                <SheetFooter>
                    <Button
                        onClick={() => handleUpdateGroup()}
                        className="w-full"
                    >
                        Update Group
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
