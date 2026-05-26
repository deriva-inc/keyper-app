import { z } from 'zod';

// Zod Schemas
const UserSchema = z.object({
    id: z.uuid(),
    email: z.string(),
    authHash: z.string(),
    authSalt: z.string(),
    encryptionHash: z.string(),
    encryptionSalt: z.string(),
    recoveryKey: z.string(),
    name: z.string(),
    avatarUrl: z.url(),
    createdAt: z.date(),
    updatedAt: z.date()
});

const UserDetailsWOSecretsSchema = UserSchema.omit({
    authHash: true,
    authSalt: true,
    encryptionHash: true,
    encryptionSalt: true,
    recoveryKey: true
});

const ProfileSchema = z.object({
    id: z.uuid(),
    userId: z.uuid(),
    name: z.string(),
    description: z.string().optional(),
    icon: z.url(),
    isArchived: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date()
});

const GroupTypeSchema = z.enum(['provider', 'category']);

const GroupSchema = z.object({
    id: z.uuid(),
    profileId: z.uuid(),
    name: z.string(),
    description: z.string().optional(),
    type: GroupTypeSchema,
    icon: z.url().optional(),
    isArchived: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date()
});

const EntryTypeSchema = z.enum([
    'login',
    'credit_card',
    'debit_card',
    'bank_account',
    'upi_id',
    'identity_card',
    'secure_note'
]);

const VaultEntrySchema = z.object({
    id: z.uuid(),
    profileId: z.uuid(),
    groupId: z.uuid().optional(),
    name: z.string(),
    description: z.string().optional(),
    icon: z.url().optional(),
    type: EntryTypeSchema,
    encryptedBlob: z.string(),
    websiteUrl: z.url().optional(),
    email: z.email(),
    userId: z.string().optional(),
    userName: z.string().optional(),
    cardNumber: z.string().optional(),
    expirationDate: z.string().optional(),
    securityCode: z.string().optional(),
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
    UserDetailsWOSecretsSchema,
    ProfileSchema,
    GroupTypeSchema,
    GroupSchema,
    EntryTypeSchema,
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

enum TOP_NAV_LINKS {
    'DASHBOARD',
    'PROFILES',
    'GROUPS',
    'VAULT',
    'SETTINGS'
}

type EntryCustomFieldValueType = 'array' | 'object' | 'primitive';
type User = z.infer<typeof UserSchema>;
type UserDetailsWOSecrets = z.infer<typeof UserDetailsWOSecretsSchema>;
type Profile = z.infer<typeof ProfileSchema>;
type GroupType = z.infer<typeof GroupTypeSchema>;
type Group = z.infer<typeof GroupSchema>;
type EntryType = z.infer<typeof EntryTypeSchema>;
type VaultEntry = z.infer<typeof VaultEntrySchema>;
type LocalStorageData = z.infer<typeof LocalStorageSchema>;

// Exports - TypeScript types
export { ENERGY, THEME, UI_STATE, TOP_NAV_LINKS };

export type {
    EntryCustomFieldValueType,
    User,
    UserDetailsWOSecrets,
    LocalStorageData,
    Profile,
    GroupType,
    Group,
    EntryType,
    VaultEntry
};
