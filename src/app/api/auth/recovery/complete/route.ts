/**
 * This route handler finalizes account recovery by storing new auth and encryption keys.
 */
import { getServerBaseUrl } from '@/lib/api-server';
import { HTTP_STATUS_CODE } from '@/lib/types/api';
import { handleErrorOnServerSideAPICalls, logger } from 'get-elementa-ui';
import { NextResponse } from 'next/server';

/** Handle recovery complete request. */
export async function POST(req: Request) {
    const targetUrl = `${getServerBaseUrl(req)}/auth/recovery/complete`;
    const body = await req.json();
    logger.info(`[POST] | ${targetUrl} | Finalizing account recovery.`);

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
            'Failed to complete account recovery.',
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            '[POST] /api/v1/auth/recovery/complete'
        );
    }
}
