import {
    clearAuthCookies,
    getRefreshTokenFromCookies,
    getServerAuthHeader,
    getServerBaseUrl
} from '@/lib/api-server';
import { HTTP_STATUS_CODE } from '@/lib/types/api';
import { handleErrorOnServerSideAPICalls, logger } from 'get-elementa-ui';
import { NextResponse } from 'next/server';

/** Handle current-device logout request and clear HttpOnly auth cookies. */
export async function POST(req: Request) {
    const targetUrl = `${getServerBaseUrl(req)}/auth/logout`;
    const authHeader = await getServerAuthHeader(req);
    const body = (await req.json().catch(() => ({}))) as {
        refreshToken?: string;
    };
    const refreshToken =
        (await getRefreshTokenFromCookies()) || body.refreshToken || '';
    logger.info(`[POST] | ${targetUrl} | Handling user logout request.`);

    try {
        const logoutRes = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { Authorization: authHeader } : {})
            },
            body: JSON.stringify({ refreshToken })
        });

        const data = await logoutRes.json();

        return NextResponse.json(data, { status: logoutRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            'Failed to log out user.',
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            '[POST] /api/v1/auth/logout'
        );
    } finally {
        await clearAuthCookies();
    }
}
