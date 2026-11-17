/**
 * This route handler confirms the restore token and retrieves user salts for re-encryption.
 */
import { getServerBaseUrl } from '@/lib/api-server';
import { HTTP_STATUS_CODE } from '@/lib/types/api';
import { handleErrorOnServerSideAPICalls, logger } from 'get-elementa-ui';
import { NextResponse } from 'next/server';

/** Handle reset password confirm request. */
export async function POST(req: Request) {
    const targetUrl = `${getServerBaseUrl(req)}/auth/reset-password/confirm`;
    const body = await req.json();
    logger.info(
        `[POST] | ${targetUrl} | Confirming password reset and retrieving salts.`
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
            'Failed to confirm reset password request.',
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            '[POST] /api/v1/auth/reset-password/confirm'
        );
    }
}
