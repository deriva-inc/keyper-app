import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import {
    HTTP_STATUS_CODE,
    ListProfileResponse,
    SingleProfileResponse
} from '@/lib/types/api';
import logger from '@/lib/logger';

/** Handle creating a new user profile. */
export async function POST(req: Request) {
    const targetUrl = `${process.env.SERVER_BASE_URL}/profiles`;
    const body = await req.json();
    const headers = await req.headers;

    logger.info(`[POST] | ${targetUrl} | Handling create a new profile.`);
    console.log(headers.get('Authorization'));

    try {
        const createProfileRes = await fetch(`${targetUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization') || ''
            },
            body: JSON.stringify(body)
        });

        const data = (await createProfileRes.json()) as SingleProfileResponse;

        return NextResponse.json(data, { status: createProfileRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to create a new profile on the platform.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[POST] /api/v1/profiles`
        );
    }
}

/** Get information for a specific profile. */
export async function GET(req: Request) {
    const targetUrl = `${process.env.SERVER_BASE_URL}/profiles`;
    const headers = await req.headers;

    logger.info(
        `[GET] | ${targetUrl} | Handling fetching all the user profiles.`
    );

    try {
        const profileRes = await fetch(`${targetUrl}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization') || ''
            }
        });

        const data = (await profileRes.json()) as ListProfileResponse;

        return NextResponse.json(data, { status: profileRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to fetch user profiles on the platform.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[GET] /api/v1/profiles`
        );
    }
}
