import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import { HTTP_STATUS_CODE, ListVaultEntriesResponse } from '@/lib/types/api';
import logger from '@/lib/logger';

/** Handles fetching all the vault entries marked with status as Favorite. */
export async function GET(req: Request) {
    const headers = await req.headers;
    const targetUrl = `${process.env.SERVER_BASE_URL}/entries/favorites`;

    logger.info(
        `[PATCH] | ${targetUrl} | Handling update of favorite status of vault entry`
    );

    try {
        const favoritesEntryRes = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization') || '',
                'X-Profile-Id': headers.get('x-profile-id') || ''
            }
        });

        const data =
            (await favoritesEntryRes.json()) as ListVaultEntriesResponse;

        return NextResponse.json(data, { status: favoritesEntryRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to update favorite status of vault entry on the platform.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[PATCH] /api/v1/entries/favorite`
        );
    }
}
