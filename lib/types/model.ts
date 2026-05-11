import { z } from 'zod';

// Zod Schemas
const UserSchema = z.object({
    id: z.uuid(),
    email: z.string(),
    authHash: z.string(),
    recoveryKey: z.string(),
    salt: z.string(),
    name: z.string(),
    avatarUrl: z.url(),
    createdAt: z.date(),
    updatedAt: z.date()
});

const ProfileSchema = z.object({
    id: z.uuid(),
    userId: z.uuid(),
    name: z.string(),
    icon: z.url(),
    createdAt: z.date(),
    updatedAt: z.date()
});

const GroupSchema = z.object({
    id: z.uuid(),
    profileId: z.uuid(),
    name: z.string(),
    icon: z.url().optional(),
    createdAt: z.date(),
    updatedAt: z.date()
});

const VaultEntrySchema = z.object({
    id: z.uuid(),
    profileId: z.uuid(),
    groupId: z.uuid().optional(),
    name: z.string(),
    encryptedBlob: z.string(),
    customFields: z.record(z.string(), z.unknown()).optional(),
    isFavorite: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date()
});

const LocalStorageSchema = z.object({
    jwtToken: z.string(),
    loggedIn: z.boolean(),
    serverUrl: z.url(),
    userDetails: UserSchema
});

export {
    UserSchema,
    ProfileSchema,
    GroupSchema,
    VaultEntrySchema,
    LocalStorageSchema
};

// TypeScript Types
enum ENERGY {
    'VAPORWAVE' = 'vaporwave',
    'ELECTRIC_SHOCK' = 'electric-shock',
    'CYBER_MIST' = 'cyber-mist',
    'SUMMER_FRUIT' = 'summer-fruit',
    'BUBBLEGUM_ICE' = 'bubblegum-ice'
}

enum THEME {
    'AMBER' = 'light',
    'GUN_METAL' = 'dark'
}

enum UI_STATE {
    'LOADING',
    'ERROR',
    'SUCCESS',
    'IDLE'
}

type User = z.infer<typeof UserSchema>;
type Profile = z.infer<typeof ProfileSchema>;
type Group = z.infer<typeof GroupSchema>;
type VaultEntry = z.infer<typeof VaultEntrySchema>;
type LocalStorageData = z.infer<typeof LocalStorageSchema>;

// Exports - TypeScript types
export { ENERGY, THEME, UI_STATE };

export type { User, LocalStorageData, Profile, Group, VaultEntry };
