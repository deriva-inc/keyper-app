import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import {
    HTTP_STATUS_CODE,
    ListGroupResponse,
    SingleGroupResponse
} from '@/lib/types/api';
import logger from '@/lib/logger';

/** Handle creating a new profile group. */
export async function POST(req: Request) {
    const targetUrl = `${process.env.SERVER_BASE_URL}/groups`;
    const body = await req.json();
    const headers = await req.headers;

    logger.info(`[POST] | ${targetUrl} | Handling create a new profile group.`);
    console.log(headers.get('Authorization'));

    try {
        const createGroupRes = await fetch(`${targetUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization') || ''
            },
            body: JSON.stringify(body)
        });

        const data = (await createGroupRes.json()) as SingleGroupResponse;

        return NextResponse.json(data, { status: createGroupRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to create a new profile group on the platform.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[POST] /api/v1/groups`
        );
    }
}

/** Get information for all groups under a user profile. */
export async function GET(req: Request) {
    const targetUrl = `${process.env.SERVER_BASE_URL}/groups`;
    const headers = await req.headers;

    logger.info(
        `[GET] | ${targetUrl} | Handling fetching all the user profile groups.`
    );

    try {
        const groupRes = await fetch(
            `${targetUrl}?profileId=${headers.get('x-profile-id')}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: headers.get('Authorization') || ''
                }
            }
        );

        const data = (await groupRes.json()) as ListGroupResponse;

        return NextResponse.json(data, { status: groupRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to fetch profile groups on the platform.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[GET] /api/v1/groups`
        );
    }
}
