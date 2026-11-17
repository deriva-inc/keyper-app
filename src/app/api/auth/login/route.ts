import { getServerBaseUrl, setAuthCookies } from '@/lib/api-server';
import { HTTP_STATUS_CODE, LoginResponse } from '@/lib/types/api';
import { handleErrorOnServerSideAPICalls, logger } from 'get-elementa-ui';
import { NextResponse } from 'next/server';

/** Handle user login request and persist auth tokens in HttpOnly SameSite=Strict cookies. */
export async function POST(req: Request) {
    const targetUrl = `${getServerBaseUrl(req)}/auth/login`;
    const body = await req.json();
    logger.info(`[POST] | ${targetUrl} | Handling user login request.`);

    try {
        const userAgent = req.headers.get('user-agent') || '';
        const loginRes = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(userAgent ? { 'User-Agent': userAgent } : {})
            },
            body: JSON.stringify(body)
        });

        const data = (await loginRes.json()) as LoginResponse;

        if (loginRes.ok && data?.data?.accessToken) {
            await setAuthCookies({
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
                expiryTime: data.data.expiryTime
            });

            return NextResponse.json(
                {
                    ...data,
                    data: {
                        user: data.data.user,
                        expiryTime: data.data.expiryTime
                    }
                },
                { status: loginRes.status }
            );
        }

        return NextResponse.json(data, { status: loginRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            'Failed to log in user on the platform.',
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            '[POST] /api/v1/auth/login'
        );
    }
}
