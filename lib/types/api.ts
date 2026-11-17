import { z } from 'zod';
import {
    GroupSchema,
    ProfileSchema,
    UserDetailsWOSecretsSchema,
    UserSchema,
    VaultEntrySchema
} from '@/lib/types/model';

// SECTION: Zod Schemas
const JWTPayloadSchema = z.object({
    user_id: z.string(),
    iss: z.string(),
    exp: z.number(),
    iat: z.number()
});

const APIResponseSchema = z.object({
    message: z.string(),
    data: z.unknown().optional(),
    error: z.unknown().optional()
});

const SignUpRequestSchema = z.object({
    email: z.email(),
    name: z.string(),
    authKey: z.string()
});

const SignUpResponseSchema = APIResponseSchema.extend({
    data: z.object({ user: UserSchema })
});

const LoginResponseSchema = APIResponseSchema.extend({
    data: z.object({
        user: UserDetailsWOSecretsSchema,
        accessToken: z.string(),
        refreshToken: z.string().optional(),
        expiryTime: z.string().optional()
    })
});

const RefreshTokenResponseSchema = APIResponseSchema.extend({
    data: z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
        expiryTime: z.string()
    })
});

const GetUserDetailsResponseSchema = APIResponseSchema.extend({
    data: UserDetailsWOSecretsSchema
});

const GetUserSaltResponseSchema = APIResponseSchema.extend({
    data: z.object({
        authSalt: z.string().optional(),
        encryptionSalt: z.string().optional(),
        recoverySalt: z.string().optional()
    })
});

const RecoverySetupResponseSchema = APIResponseSchema.extend({
    data: z.object({
        userId: z.string(),
        email: z.string()
    })
});

const RecoveryInitiateResponseSchema = APIResponseSchema.extend({
    data: z.object({
        restoreJwt: z.string(),
        expiresIn: z.number().optional()
    })
});

const ResetPasswordInitiateResponseSchema = APIResponseSchema.extend({
    data: z.object({
        userId: z.string(),
        email: z.string()
    })
});

const ResetPasswordConfirmResponseSchema = APIResponseSchema.extend({
    data: z.object({
        userId: z.string(),
        email: z.string(),
        authSalt: z.string(),
        encryptionSalt: z.string()
    })
});

const RecoveryCompleteResponseSchema = APIResponseSchema.extend({
    data: z.object({
        userId: z.string(),
        email: z.string(),
        accessToken: z.string()
    })
});

// SECTION: Profile Service
const SingleProfileResponseSchema = APIResponseSchema.extend({
    data: ProfileSchema
});

const ListProfileResponseSchema = APIResponseSchema.extend({
    data: z.array(ProfileSchema)
});

const DeleteProfileResponseSchema = APIResponseSchema.extend({
    data: z.boolean()
});
// !SECTION: Profile Service

// SECTION: Group Service
const SingleGroupResponseSchema = APIResponseSchema.extend({
    data: GroupSchema
});

const ListGroupResponseSchema = APIResponseSchema.extend({
    data: z.array(GroupSchema)
});

const DeleteGroupResponseSchema = APIResponseSchema.extend({
    data: z.boolean()
});
// !SECTION: Group Service

// SECTION: Vault Entry Service
const SingleVaultEntryResponseSchema = APIResponseSchema.extend({
    data: VaultEntrySchema
});

const ListVaultEntriesResponseSchema = APIResponseSchema.extend({
    data: z.array(VaultEntrySchema)
});

const DeleteVaultEntryResponseSchema = APIResponseSchema.extend({
    data: z.boolean()
});
// !SECTION: Vault Entry Service

// SECTION: Stats Service
const DashboardStatsResponseSchema = APIResponseSchema.extend({
    data: z.object({
        totalProfiles: z.number(),
        totalGroups: z.number(),
        totalVaultEntries: z.number(),
        popularProfile: ProfileSchema,
        popularGroup: GroupSchema
    })
});
// !SECTION: Stats Service

const CountResponseSchema = APIResponseSchema.extend({
    data: z.number()
});

export {
    APIResponseSchema,
    CountResponseSchema,
    DeleteGroupResponseSchema,
    DeleteProfileResponseSchema,
    DeleteVaultEntryResponseSchema,
    GetUserDetailsResponseSchema,
    GetUserSaltResponseSchema,
    JWTPayloadSchema,
    ListGroupResponseSchema,
    ListProfileResponseSchema,
    ListVaultEntriesResponseSchema,
    LoginResponseSchema,
    RefreshTokenResponseSchema,
    SignUpRequestSchema,
    SignUpResponseSchema,
    SingleGroupResponseSchema,
    SingleProfileResponseSchema,
    SingleVaultEntryResponseSchema
};

// TypeScript Types
enum HTTP_STATUS_CODE {
    SUCCESS = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_ERROR = 500,
    SERVICE_UNAVAILABLE = 503
}

type JWTPayload = z.infer<typeof JWTPayloadSchema>;
type APIResponse = z.infer<typeof APIResponseSchema>;
type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
type SignUpResponse = z.infer<typeof SignUpResponseSchema>;
type LoginResponse = z.infer<typeof LoginResponseSchema>;
type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
type GetUserDetailsResponse = z.infer<typeof GetUserDetailsResponseSchema>;
type GetUserSaltResponse = z.infer<typeof GetUserSaltResponseSchema>;
type RecoverySetupResponse = z.infer<typeof RecoverySetupResponseSchema>;
type RecoveryInitiateResponse = z.infer<typeof RecoveryInitiateResponseSchema>;
type ResetPasswordInitiateResponse = z.infer<
    typeof ResetPasswordInitiateResponseSchema
>;
type ResetPasswordConfirmResponse = z.infer<
    typeof ResetPasswordConfirmResponseSchema
>;
type RecoveryCompleteResponse = z.infer<typeof RecoveryCompleteResponseSchema>;
type SingleProfileResponse = z.infer<typeof SingleProfileResponseSchema>;
type ListProfileResponse = z.infer<typeof ListProfileResponseSchema>;
type DeleteProfileResponse = z.infer<typeof DeleteProfileResponseSchema>;
type SingleGroupResponse = z.infer<typeof SingleGroupResponseSchema>;
type ListGroupResponse = z.infer<typeof ListGroupResponseSchema>;
type DeleteGroupResponse = z.infer<typeof DeleteGroupResponseSchema>;
type SingleVaultEntryResponse = z.infer<typeof SingleVaultEntryResponseSchema>;
type ListVaultEntriesResponse = z.infer<typeof ListVaultEntriesResponseSchema>;
type DeleteVaultEntryResponse = z.infer<typeof DeleteVaultEntryResponseSchema>;
type CountResponse = z.infer<typeof CountResponseSchema>;
type DashboardStatsResponse = z.infer<typeof DashboardStatsResponseSchema>;

// Exports - TypeScript types
export { DashboardStatsResponseSchema, HTTP_STATUS_CODE };

export type {
    APIResponse,
    CountResponse,
    DashboardStatsResponse,
    DeleteGroupResponse,
    DeleteProfileResponse,
    DeleteVaultEntryResponse,
    GetUserDetailsResponse,
    GetUserSaltResponse,
    JWTPayload,
    ListGroupResponse,
    ListProfileResponse,
    ListVaultEntriesResponse,
    LoginResponse,
    RefreshTokenResponse,
    RecoveryCompleteResponse,
    RecoveryInitiateResponse,
    RecoverySetupResponse,
    ResetPasswordConfirmResponse,
    ResetPasswordInitiateResponse,
    SignUpRequest,
    SignUpResponse,
    SingleGroupResponse,
    SingleProfileResponse,
    SingleVaultEntryResponse
};
