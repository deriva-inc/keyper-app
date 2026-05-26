import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import { HTTP_STATUS_CODE, CountResponse } from '@/lib/types/api';
import logger from '@/lib/logger';

/** Handle GET requests to retrieve the count of entries for a specific group. */
export async function GET(req: Request) {
    const groupId = req.headers.get('x-group-id') as string;
    const headers = await req.headers;

    const targetUrl = `${process.env.SERVER_BASE_URL}/groups/${groupId}/entries/count`;
    logger.info(
        `[GET] ${targetUrl} | Fetching entries count for group: ${groupId}`
    );

    try {
        const groupEntriesCountRes = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization')
            }
        });

        const data = (await groupEntriesCountRes.json()) as CountResponse;

        return NextResponse.json(data, { status: groupEntriesCountRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to retrieve entries count for group ${groupId}.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[GET] /api/groups/${groupId}/entries/count`
        );
    }
}
