import { NextResponse } from 'next/server';
import { HTTP_STATUS_CODE, SignUpResponse } from '@/lib/types/api';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import logger from '@/lib/logger';

/** Handle user signup request. */
export async function POST(req: Request) {
    const targetUrl = `${process.env.SERVER_BASE_URL}/auth/signup`;
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
        } else {
            return NextResponse.json(
                {
                    message: data.message,
                    error: data.error
                },
                { status: signUpRes.status }
            );
        }
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to sign-up user on the platform.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[POST] /api/v1/auth/signup`
        );
    }
}
