/** This file contains the network functions for the auth service. */

import { toast } from 'sonner';
import {
    ClientSideError,
    handleErrorOnClientSideAPICalls
} from 'get-elementa-ui';
import { apiFetch, clearAuthStorage } from '@/lib/api-client';
import { AUTH_API_ENDPOINTS } from '@/services/auth/constants';
import type { HealthCheckResponse } from '@/services/auth/types';

/**
 * Checks connectivity against the configured backend server's health endpoint.
 *
 * @param overrideServerUrl - Optional custom server URL to test before saving.
 * @returns A promise resolving to the health check response or a ClientSideError.
 */
export const checkHealthFromNetwork = async (
    overrideServerUrl?: string
): Promise<
    { statusCode: number; data: HealthCheckResponse } | ClientSideError
> => {
    try {
        const headers: Record<string, string> = {};
        if (overrideServerUrl) {
            headers['x-server-url'] = overrideServerUrl;
        }

        const response = await apiFetch(AUTH_API_ENDPOINTS.HEALTH, {
            method: 'GET',
            headers
        });

        let data: HealthCheckResponse = {};
        try {
            data = (await response.json()) as HealthCheckResponse;
        } catch {
            data = { status: response.ok ? 'ok' : 'error' };
        }

        return { statusCode: response.status, data };
    } catch (error: unknown) {
        return handleErrorOnClientSideAPICalls(error);
    }
};

/**
 * Logs out the current device on the backend (best-effort), clears HttpOnly
 * auth cookies, purges local state, and redirects to the login screen.
 *
 * @param onRedirect - Optional callback to navigate to '/' (e.g. router.push).
 */
export const logoutCurrentDevice = async (
    onRedirect?: (path: string) => void
): Promise<void> => {
    try {
        await apiFetch(AUTH_API_ENDPOINTS.LOGOUT, {
            method: 'POST',
            body: JSON.stringify({})
        });
    } catch {
        // Always purge local state even if backend logout fails or is offline.
    } finally {
        clearAuthStorage();
        if (onRedirect) {
            onRedirect('/');
        } else if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    }
};

/**
 * Logs out from all active devices, clears HttpOnly auth cookies, purges
 * local state, and redirects to the login screen.
 *
 * @param onRedirect - Optional callback to navigate to '/' (e.g. router.push).
 * @returns True if logout-all succeeded, false otherwise.
 */
export const logoutAllDevices = async (
    onRedirect?: (path: string) => void
): Promise<boolean> => {
    const res = await apiFetch(AUTH_API_ENDPOINTS.LOGOUT_ALL, {
        method: 'POST'
    });

    if (!res.ok) {
        return false;
    }

    clearAuthStorage();
    toast.success('Successfully signed out of all devices.');
    if (onRedirect) {
        onRedirect('/');
    } else if (typeof window !== 'undefined') {
        window.location.href = '/';
    }
    return true;
};
