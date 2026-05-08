import { z } from 'zod';
import { UserSchema } from './model';

// Zod Schemas
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

export { APIResponseSchema, SignUpRequestSchema, SignUpResponseSchema };

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

type APIResponse = z.infer<typeof APIResponseSchema>;
type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
type SignUpResponse = z.infer<typeof SignUpResponseSchema>;

// Exports - TypeScript types
export { HTTP_STATUS_CODE };

export type { APIResponse, SignUpRequest, SignUpResponse };
