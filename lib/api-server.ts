import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import logger from '@/lib/logger';
import { HTTP_STATUS_CODE } from '@/lib/types/api';

const DEFAULT_SERVER_URL = 'http://localhost:8085';

export const AUTH_COOKIES = {
    ACCESS_TOKEN: 'keyper_access_token',
    REFRESH_TOKEN: 'keyper_refresh_token'
} as const;

const BASE_COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
};

/**
 * Stores access token and optional refresh token in HttpOnly SameSite=Strict cookies.
 * Uses `expiryTime` from the backend to set the refresh token cookie expiration.
 */
export async function setAuthCookies(params: {
    accessToken: string;
    refreshToken?: string;
    expiryTime?: string;
}): Promise<void> {
    const cookieStore = await cookies();
    const parsedExpiry = params.expiryTime
        ? new Date(params.expiryTime)
        : undefined;
    const validExpiry =
        parsedExpiry && !Number.isNaN(parsedExpiry.getTime())
            ? parsedExpiry
            : undefined;

    cookieStore.set(AUTH_COOKIES.ACCESS_TOKEN, params.accessToken, {
        ...BASE_COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24
    });

    if (params.refreshToken) {
        cookieStore.set(AUTH_COOKIES.REFRESH_TOKEN, params.refreshToken, {
            ...BASE_COOKIE_OPTIONS,
            ...(validExpiry
                ? { expires: validExpiry }
                : { maxAge: 60 * 60 * 24 * 7 })
        });
    }
}

/**
 * Clears all Keyper authentication cookies from Next.js cookie store.
 */
export async function clearAuthCookies(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIES.ACCESS_TOKEN);
    cookieStore.delete(AUTH_COOKIES.REFRESH_TOKEN);
}

/**
 * Reads the Bearer Authorization header from the incoming request or falls back
 * to the HttpOnly `keyper_access_token` cookie.
 */
export async function getServerAuthHeader(
    req: Request
): Promise<string | null> {
    const headerAuth = req.headers.get('authorization');
    if (headerAuth && headerAuth.trim() !== '') {
        return headerAuth;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
    return token ? `Bearer ${token}` : null;
}

/**
 * Reads the HttpOnly refresh token from Next.js cookies.
 */
export async function getRefreshTokenFromCookies(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_COOKIES.REFRESH_TOKEN)?.value || null;
}

/**
 * Checks whether a hostname refers to a local loopback or private LAN address.
 */
function isPrivateOrLocalHost(hostname: string): boolean {
    if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '::1' ||
        hostname === '[::1]' ||
        hostname.endsWith('.local')
    ) {
        return true;
    }

    if (
        /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
        /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
        /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname)
    ) {
        return true;
    }

    return false;
}

/**
 * Validates, sanitizes, and normalizes a user-supplied backend server URL.
 * - Allows only http: and https: protocols.
 * - Strips embedded credentials, query strings, and hash fragments.
 * - Rewrites same-host private LAN IP to 127.0.0.1 for local mobile dev access.
 * - Ensures the /api/v1 API prefix is present.
 *
 * @param rawUrl - Raw server URL string.
 * @param reqHost - Optional incoming request hostname (without port).
 * @returns Sanitized API base URL ending with /api/v1.
 */
export function normalizeServerBaseUrl(
    rawUrl: string,
    reqHost?: string
): string {
    const parsed = new URL(rawUrl.trim());

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('Server URL must use http:// or https:// protocol.');
    }

    // Strip credentials, query params, and hash fragments for vault security.
    parsed.username = '';
    parsed.password = '';
    parsed.search = '';
    parsed.hash = '';

    if (
        parsed.protocol === 'http:' &&
        reqHost &&
        parsed.hostname === reqHost &&
        isPrivateOrLocalHost(reqHost) &&
        reqHost !== 'localhost' &&
        reqHost !== '127.0.0.1'
    ) {
        parsed.hostname = '127.0.0.1';
    }

    const cleanPath = parsed.pathname.replace(/\/+$/, '');
    parsed.pathname = cleanPath.endsWith('/api/v1')
        ? cleanPath
        : `${cleanPath}/api/v1`;

    return parsed.toString().replace(/\/+$/, '');
}

/**
 * Resolves the backend server base URL from incoming request headers or falls
 * back to the default local server URL (http://localhost:8085/api/v1).
 *
 * @param req - The incoming Next.js Request.
 * @returns The resolved and sanitized target base URL.
 */
export function getServerBaseUrl(req: Request): string {
    const customUrl = req.headers.get('x-server-url');
    const reqHost = req.headers.get('host')?.split(':')[0];

    if (customUrl && customUrl.trim() !== '') {
        try {
            return normalizeServerBaseUrl(customUrl, reqHost);
        } catch {
            // Fall back to default if header URL is malformed or unsafe.
        }
    }

    return normalizeServerBaseUrl(DEFAULT_SERVER_URL);
}

/**
 * Proxies a GET request to a `/dashboard*` backend endpoint, forwarding
 * the HttpOnly Bearer auth token and optional `X-Profile-Id` header.
 */
export async function proxyDashboardGet(
    req: Request,
    backendSubpath: string
): Promise<NextResponse> {
    const profileId = req.headers.get('x-profile-id')?.trim();
    const targetUrl = `${getServerBaseUrl(req)}/dashboard${backendSubpath}`;
    logger.info(`[GET] ${targetUrl} | Fetching dashboard data.`);

    try {
        const forwardHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            Authorization: (await getServerAuthHeader(req)) || ''
        };
        if (profileId) {
            forwardHeaders['X-Profile-Id'] = profileId;
        }

        const res = await fetch(targetUrl, {
            method: 'GET',
            headers: forwardHeaders
        });

        const data = (await res.json()) as unknown;

        return NextResponse.json(data, {
            status: res.status
        });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            'Failed to fetch dashboard data for the user.',
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[GET] /api/v1/dashboard${backendSubpath}`
        );
    }
}
