import { NextResponse } from 'next/server';
import { HTTP_STATUS_CODE, LoginResponse } from '@/lib/types/api';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import logger from '@/lib/logger';

/** Handle user login request. */
export async function POST(req: Request) {
    const targetUrl = `${process.env.SERVER_BASE_URL}/auth/login`;
    const body = await req.json();
    logger.info(`[POST] | ${targetUrl} | Handling user login request.`);

    try {
        const loginRes = await fetch(`${targetUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = (await loginRes.json()) as LoginResponse;

        return NextResponse.json(data, { status: loginRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to log in user on the platform.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[POST] /api/v1/auth/login`
        );
    }
}
