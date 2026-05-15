import { z } from 'zod';
import {
    GroupSchema,
    ProfileSchema,
    UserDetailsWOSecretsSchema,
    UserSchema
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
    authHash: z.string()
});

const SignUpResponseSchema = APIResponseSchema.extend({
    data: z.object({ user: UserSchema })
});

const LoginResponseSchema = APIResponseSchema.extend({
    data: z.object({
        user: UserDetailsWOSecretsSchema,
        accessToken: z.string()
    })
});

const GetUserDetailsResponseSchema = APIResponseSchema.extend({
    data: UserDetailsWOSecretsSchema
});

const GetUserSaltResponseSchema = APIResponseSchema.extend({
    data: z.object({ salt: z.string() })
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

export {
    JWTPayloadSchema,
    APIResponseSchema,
    SignUpRequestSchema,
    SignUpResponseSchema,
    LoginResponseSchema,
    GetUserDetailsResponseSchema,
    GetUserSaltResponseSchema,
    SingleProfileResponseSchema,
    ListProfileResponseSchema,
    DeleteProfileResponseSchema,
    SingleGroupResponseSchema,
    ListGroupResponseSchema,
    DeleteGroupResponseSchema
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
type GetUserDetailsResponse = z.infer<typeof GetUserDetailsResponseSchema>;
type GetUserSaltResponse = z.infer<typeof GetUserSaltResponseSchema>;
type SingleProfileResponse = z.infer<typeof SingleProfileResponseSchema>;
type ListProfileResponse = z.infer<typeof ListProfileResponseSchema>;
type DeleteProfileResponse = z.infer<typeof DeleteProfileResponseSchema>;
type SingleGroupResponse = z.infer<typeof SingleGroupResponseSchema>;
type ListGroupResponse = z.infer<typeof ListGroupResponseSchema>;
type DeleteGroupResponse = z.infer<typeof DeleteGroupResponseSchema>;

// Exports - TypeScript types
export { HTTP_STATUS_CODE };

export type {
    JWTPayload,
    APIResponse,
    SignUpRequest,
    SignUpResponse,
    LoginResponse,
    GetUserDetailsResponse,
    GetUserSaltResponse,
    SingleProfileResponse,
    ListProfileResponse,
    DeleteProfileResponse,
    SingleGroupResponse,
    ListGroupResponse,
    DeleteGroupResponse
};
