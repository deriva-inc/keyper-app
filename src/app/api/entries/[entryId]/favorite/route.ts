import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import { SingleVaultEntryResponse, HTTP_STATUS_CODE } from '@/lib/types/api';
import logger from '@/lib/logger';

/** Update the favorite status of a vault entry for a specific entry ID. */
export async function PATCH(req: Request) {
    const headers = await req.headers;
    const entryId = headers.get('x-entry-id');
    const targetUrl = `${process.env.SERVER_BASE_URL}/entries/${entryId}/favorite`;

    logger.info(
        `[PATCH] | ${targetUrl} | Handling update of favorite status of vault entry: ${entryId}`
    );

    try {
        const toggleFavoriteRes = await fetch(targetUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization') || '',
                'X-Profile-Id': headers.get('x-profile-id') || ''
            }
        });

        const data =
            (await toggleFavoriteRes.json()) as SingleVaultEntryResponse;

        return NextResponse.json(data, { status: toggleFavoriteRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to update favorite status of vault entry on the platform.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[PATCH] /api/v1/entries/${entryId}/favorite`
        );
    }
}
