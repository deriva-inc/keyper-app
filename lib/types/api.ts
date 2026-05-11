import { z } from 'zod';
import { UserSchema } from '@/lib/types/model';

// Zod Schemas
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
        user: UserSchema.omit({
            authHash: true,
            recoveryKey: true,
            salt: true
        }),
        accessToken: z.string()
    })
});

const GetUserSaltResponseSchema = APIResponseSchema.extend({
    data: z.object({ salt: z.string() })
});

export {
    JWTPayloadSchema,
    APIResponseSchema,
    SignUpRequestSchema,
    SignUpResponseSchema,
    LoginResponseSchema,
    GetUserSaltResponseSchema
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
type GetUserSaltResponse = z.infer<typeof GetUserSaltResponseSchema>;

// Exports - TypeScript types
export { HTTP_STATUS_CODE };

export type {
    JWTPayload,
    APIResponse,
    SignUpRequest,
    SignUpResponse,
    LoginResponse,
    GetUserSaltResponse
};
