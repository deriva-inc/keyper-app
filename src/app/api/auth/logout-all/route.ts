import {
    clearAuthCookies,
    getServerAuthHeader,
    getServerBaseUrl
} from '@/lib/api-server';
import { HTTP_STATUS_CODE } from '@/lib/types/api';
import { handleErrorOnServerSideAPICalls, logger } from 'get-elementa-ui';
import { NextResponse } from 'next/server';

/** Handle logout-all-devices request and clear HttpOnly auth cookies. */
export async function POST(req: Request) {
    const targetUrl = `${getServerBaseUrl(req)}/auth/logout-all`;
    const authHeader = await getServerAuthHeader(req);
    logger.info(`[POST] | ${targetUrl} | Handling logout from all devices.`);

    try {
        const logoutAllRes = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { Authorization: authHeader } : {})
            }
        });

        const data = await logoutAllRes.json();

        if (logoutAllRes.ok) {
            await clearAuthCookies();
        }

        return NextResponse.json(data, { status: logoutAllRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            'Failed to log out from all devices.',
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            '[POST] /api/v1/auth/logout-all'
        );
    }
}
