import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import {
    HTTP_STATUS_CODE,
    ListVaultEntriesResponse,
    SingleVaultEntryResponse
} from '@/lib/types/api';
import logger from '@/lib/logger';

/** Handle creating a new profile vault entry. */
export async function POST(req: Request) {
    const targetUrl = `${process.env.SERVER_BASE_URL}/entries`;
    const body = await req.json();
    const headers = await req.headers;

    logger.info(
        `[POST] | ${targetUrl} | Handling create a new profile vault entry.`
    );

    try {
        const createEntryRes = await fetch(`${targetUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization') || '',
                'X-Profile-Id': headers.get('X-Profile-Id') || ''
            },
            body: JSON.stringify(body)
        });

        const data = (await createEntryRes.json()) as SingleVaultEntryResponse;

        return NextResponse.json(data, { status: createEntryRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to create a new profile vault entry on the platform.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[POST] /api/v1/entries`
        );
    }
}

/** Get information for all vault entries under a user profile. */
export async function GET(req: Request) {
    const targetUrl = `${process.env.SERVER_BASE_URL}/entries`;
    const headers = await req.headers;

    logger.info(
        `[GET] | ${targetUrl} | Handling fetching all the user profile vault entries.`
    );

    try {
        const entryRes = await fetch(
            `${targetUrl}?profileId=${headers.get('x-profile-id')}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: headers.get('Authorization') || '',
                    'X-Profile-Id': headers.get('X-Profile-Id') || ''
                }
            }
        );

        const data = (await entryRes.json()) as ListVaultEntriesResponse;

        return NextResponse.json(data, { status: entryRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to fetch profile vault entries on the platform.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[GET] /api/v1/entries`
        );
    }
}
