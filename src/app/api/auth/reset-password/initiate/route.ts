/**
 * This route handler validates the restore JWT token before showing the reset password screen.
 */
import { getServerBaseUrl } from '@/lib/api-server';
import { HTTP_STATUS_CODE } from '@/lib/types/api';
import { handleErrorOnServerSideAPICalls, logger } from 'get-elementa-ui';
import { NextResponse } from 'next/server';

/** Handle reset password initiation / token validation. */
export async function POST(req: Request) {
    const targetUrl = `${getServerBaseUrl(req)}/auth/reset-password/initiate`;
    const body = await req.json();
    logger.info(
        `[POST] | ${targetUrl} | Validating restore token for password reset.`
    );

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            'Failed to validate restore token.',
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            '[POST] /api/v1/auth/reset-password/initiate'
        );
    }
}
