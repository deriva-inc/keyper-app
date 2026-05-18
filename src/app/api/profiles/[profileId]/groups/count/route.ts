import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import { CountResponse, HTTP_STATUS_CODE } from '@/lib/types/api';
import logger from '@/lib/logger';

/** Handle GET for fetching groups count for a specific user profile. */
export async function GET(req: Request) {
    const profileId = req.headers.get('x-profile-id') as string;
    const headers = await req.headers;

    const targetUrl = `${process.env.SERVER_BASE_URL}/profiles/${profileId}/groups/count`;
    logger.info(
        `[GET] ${targetUrl} | Fetching groups count for profile: ${profileId}`
    );

    try {
        const profileDetailsRes = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization')
            }
        });

        const data = (await profileDetailsRes.json()) as CountResponse;

        return NextResponse.json(data, { status: profileDetailsRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to retrieve groups count for profile ${profileId}.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[GET] /api/profiles/${profileId}/groups/count`
        );
    }
}
