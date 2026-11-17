import {
    clearAuthCookies,
    getRefreshTokenFromCookies,
    getServerBaseUrl,
    setAuthCookies
} from '@/lib/api-server';
import { HTTP_STATUS_CODE, RefreshTokenResponse } from '@/lib/types/api';
import { handleErrorOnServerSideAPICalls, logger } from 'get-elementa-ui';
import { NextResponse } from 'next/server';

/** Handle refresh token rotation request using HttpOnly cookies. */
export async function POST(req: Request) {
    const targetUrl = `${getServerBaseUrl(req)}/auth/refresh`;
    const body = (await req.json().catch(() => ({}))) as {
        refreshToken?: string;
    };
    const refreshToken =
        (await getRefreshTokenFromCookies()) || body.refreshToken || '';

    if (!refreshToken) {
        await clearAuthCookies();
        return NextResponse.json(
            { error: 'No refresh token available.' },
            { status: HTTP_STATUS_CODE.UNAUTHORIZED }
        );
    }

    logger.info(`[POST] | ${targetUrl} | Refreshing access token.`);

    try {
        const refreshRes = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });

        const data = (await refreshRes.json()) as RefreshTokenResponse;

        if (refreshRes.ok && data?.data?.accessToken) {
            await setAuthCookies({
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
                expiryTime: data.data.expiryTime
            });

            return NextResponse.json(
                {
                    ...data,
                    data: {
                        expiryTime: data.data.expiryTime
                    }
                },
                { status: refreshRes.status }
            );
        }

        await clearAuthCookies();
        return NextResponse.json(data, { status: refreshRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            'Failed to refresh access token.',
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            '[POST] /api/v1/auth/refresh'
        );
    }
}
