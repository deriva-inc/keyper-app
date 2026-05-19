import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import { HTTP_STATUS_CODE, ListVaultEntriesResponse } from '@/lib/types/api';
import logger from '@/lib/logger';

/** Handle GET for fetching vault entries count for a specific user profile. */
export async function GET(req: Request) {
    const profileId = req.headers.get('x-profile-id') as string;
    const headers = await req.headers;

    const targetUrl = `${process.env.SERVER_BASE_URL}/profiles/${profileId}/entries/`;
    logger.info(
        `[GET] ${targetUrl} | Fetching vault entries for profile: ${profileId}`
    );

    try {
        const profileDetailsRes = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization')
            }
        });

        const data =
            (await profileDetailsRes.json()) as ListVaultEntriesResponse;

        return NextResponse.json(data, { status: profileDetailsRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to retrieve vault entries for profile ${profileId}.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[GET] /api/profiles/${profileId}/entries`
        );
    }
}
