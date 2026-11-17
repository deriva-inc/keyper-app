/** This file contains Zod schemas and TypeScript types for the auth service. */

import { z } from 'zod';

// SECTION: Zod Schemas
const HealthCheckResponseSchema = z.object({
    status: z.string().optional(),
    message: z.string().optional()
});

const LoginRequestSchema = z.object({
    email: z.email(),
    authHash: z.string()
});

const SignupRequestSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    authHash: z.string(),
    salt: z.string()
});
// !SECTION: Zod Schemas

// SECTION: Export Zod Schemas
export { HealthCheckResponseSchema, LoginRequestSchema, SignupRequestSchema };
// !SECTION: Export Zod Schemas

// SECTION: Types
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type SignupRequest = z.infer<typeof SignupRequestSchema>;
// !SECTION: Types
