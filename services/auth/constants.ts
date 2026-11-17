/** This file contains constants for the auth service. */

// SECTION: Constants
export const AUTH_API_ENDPOINTS = {
    HEALTH: '/api/health',
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    LOGOUT_ALL: '/api/auth/logout-all',
    USER_SALT: '/api/users/salt',
    RECOVERY_INITIATE: '/api/auth/recovery/initiate',
    RECOVERY_SETUP: '/api/auth/recovery/setup',
    RECOVERY_COMPLETE: '/api/auth/recovery/complete',
    RESET_PASSWORD_INITIATE: '/api/auth/reset-password/initiate',
    RESET_PASSWORD_CONFIRM: '/api/auth/reset-password/confirm'
} as const;
// !SECTION: Constants
