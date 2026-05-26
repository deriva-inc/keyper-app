import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import {
    HTTP_STATUS_CODE,
    ListGroupResponse,
    SingleGroupResponse
} from '@/lib/types/api';
import logger from '@/lib/logger';

/** Delete a vault entry for a specific entry ID under a user profile. */
export async function DELETE(req: Request) {
    const headers = await req.headers;
    const entryId = headers.get('x-entry-id');
    const targetUrl = `${process.env.SERVER_BASE_URL}/entries/${entryId}`;

    logger.info(
        `[DELETE] | ${targetUrl} | Handling deletion of a vault entry.`
    );

    try {
        const deleteEntryRes = await fetch(`${targetUrl}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization') || '',
                'X-Profile-Id': headers.get('x-profile-id') || ''
            }
        });

        const data = (await deleteEntryRes.json()) as ListGroupResponse;

        return NextResponse.json(data, { status: deleteEntryRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to delete vault entry on the platform.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[DELETE] /api/v1/entries/${entryId}`
        );
    }
}
