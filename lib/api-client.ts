import { useDataStore } from '@/lib/data-store';
import { toast } from 'sonner';

export const DEFAULT_SERVER_URL = 'http://localhost:8085';

/**
 * Validates and sanitizes a client-configured server URL before storing it.
 *
 * @param rawUrl - User-entered server URL.
 * @returns Normalized URL string without credentials, query, or trailing slash.
 */
export function sanitizeClientServerUrl(rawUrl: string): string {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('Server URL must start with http:// or https://');
    }
    parsed.username = '';
    parsed.password = '';
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString().replace(/\/+$/, '');
}

let inFlightRefresh: Promise<boolean> | null = null;

const AUTH_SKIP_REFRESH_PATHS = [
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/refresh',
    '/api/auth/logout',
    '/api/auth/recovery',
    '/api/auth/reset-password'
];

/**
 * Purges client-side session state, encryption keys, and cached user state
 * from localStorage and the Zustand data store.
 */
export function clearAuthStorage(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('encryptionKey');
        localStorage.removeItem('userDetails');
        localStorage.removeItem('isLoggedIn');
        localStorage.setItem('loggedIn', 'false');
    }

    const dataActions = useDataStore.getState().actions;
    dataActions.setIsUserLoggedIn(false);
    dataActions.setUserDetails(null);
    dataActions.setActiveProfile(null);
}

/**
 * Attempts to rotate the HttpOnly refresh token cookie and obtain a fresh
 * HttpOnly access token cookie via `/api/auth/refresh`.
 * Deduplicates concurrent refresh calls so only one request is sent at a time.
 *
 * @returns True if refresh succeeded, false otherwise.
 */
export async function refreshAccessToken(): Promise<boolean> {
    if (typeof window === 'undefined') {
        return false;
    }

    if (inFlightRefresh) {
        return inFlightRefresh;
    }

    inFlightRefresh = (async () => {
        try {
            const serverUrl = localStorage.getItem('serverUrl');
            const headers = new Headers({
                'Content-Type': 'application/json'
            });
            if (serverUrl) {
                headers.set('x-server-url', serverUrl);
            }

            const res = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers,
                credentials: 'same-origin'
            });

            if (!res.ok) {
                return false;
            }

            localStorage.setItem('loggedIn', 'true');
            useDataStore.getState().actions.setIsUserLoggedIn(true);

            return true;
        } catch {
            return false;
        } finally {
            inFlightRefresh = null;
        }
    })();

    return inFlightRefresh;
}

/**
 * Custom fetch wrapper for client-side API requests that automatically attaches
 * the dynamic server URL from localStorage, sends same-origin HttpOnly auth
 * cookies, and silently refreshes expired tokens on 401 responses.
 *
 * @param input - Request URL or RequestInfo.
 * @param init - Request options.
 * @returns Fetch Promise response.
 */
export async function apiFetch(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    const headers = new Headers(init?.headers);

    if (typeof window !== 'undefined') {
        const serverUrl = localStorage.getItem('serverUrl');
        if (serverUrl && !headers.has('x-server-url')) {
            headers.set('x-server-url', serverUrl);
        }
    }

    if (!headers.has('Content-Type') && !(init?.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(input, {
        ...init,
        headers,
        credentials: 'same-origin'
    });

    const requestUrl = typeof input === 'string' ? input : input.toString();
    const shouldAttemptRefresh =
        typeof window !== 'undefined' &&
        response.status === 401 &&
        !AUTH_SKIP_REFRESH_PATHS.some((path) => requestUrl.startsWith(path));

    if (shouldAttemptRefresh) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
            return fetch(input, {
                ...init,
                headers,
                credentials: 'same-origin'
            });
        }

        clearAuthStorage();
        toast.error('Your session has expired. Please sign in again.');
        if (window.location.pathname !== '/') {
            window.location.href = '/';
        }
    }

    return response;
}
