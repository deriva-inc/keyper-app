import { getServerBaseUrl } from '@/lib/api-server';
import { HTTP_STATUS_CODE, SignUpResponse } from '@/lib/types/api';
import { handleErrorOnServerSideAPICalls, logger } from 'get-elementa-ui';
import { NextResponse } from 'next/server';

/** Handle user signup request. */
export async function POST(req: Request) {
    const targetUrl = `${getServerBaseUrl(req)}/auth/signup`;
    const body = await req.json();
    logger.info(`[POST] | ${targetUrl} | Handling user signup request.`);

    try {
        const signUpRes = await fetch(`${targetUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = (await signUpRes.json()) as SignUpResponse;

        if (signUpRes.ok) {
            return NextResponse.json(data, { status: signUpRes.status });
        }
        return NextResponse.json(
            {
                message: data.message,
                error: data.error
            },
            { status: signUpRes.status }
        );
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to sign-up user on the platform.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[POST] /api/v1/auth/signup`
        );
    }
}
