import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import {
    DeleteProfileResponse,
    HTTP_STATUS_CODE,
    SingleGroupResponse
} from '@/lib/types/api';
import logger from '@/lib/logger';

/** Get information for a specific K8s cluster for a specific project. */
/** Handle user login request. */
export async function PATCH(req: Request) {
    const headers = await req.headers;
    const groupId = headers.get('x-group-id') as string;
    const targetUrl = `${process.env.SERVER_BASE_URL}/groups/${groupId}`;
    const body = await req.json();

    logger.info(
        `[PATCH] | ${targetUrl} | Updating group details for group: ${groupId}`
    );

    try {
        const updateGroupRes = await fetch(`${targetUrl}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization') as string
            },
            body: JSON.stringify(body)
        });

        const updateGroupData =
            (await updateGroupRes.json()) as SingleGroupResponse;

        return NextResponse.json(updateGroupData, {
            status: updateGroupRes.status
        });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to update group details for group ${groupId}.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[PATCH] /api/v1/groups/${groupId}`
        );
    }
}

/** Get information for a specific user profile. */
export async function GET(req: Request) {
    const headers = await req.headers;
    const groupId = headers.get('x-group-id') as string;

    const targetUrl = `${process.env.SERVER_BASE_URL}/groups/${groupId}`;
    logger.info(
        `[GET] ${targetUrl} | Fetching group details for group: ${groupId}`
    );

    try {
        const profileDetailsRes = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization')
            }
        });

        const data = (await profileDetailsRes.json()) as SingleGroupResponse;

        return NextResponse.json(data, { status: profileDetailsRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to retrieve group details for group ${groupId}.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[GET] /api/groups/${groupId}`
        );
    }
}

/** Delete a specific user profile. */
export async function DELETE(req: Request) {
    const groupId = req.headers.get('x-group-id') as string;
    const headers = await req.headers;

    const targetUrl = `${process.env.SERVER_BASE_URL}/groups/${groupId}`;
    logger.info(`[DELETE] ${targetUrl} | Deleting group ${groupId}`);

    try {
        const k8sClusters = await fetch(targetUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization')
            }
        });

        const data = (await k8sClusters.json()) as DeleteProfileResponse;

        return NextResponse.json(data, { status: k8sClusters.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to delete group ${groupId}.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[DELETE] /api/groups/${groupId}`
        );
    }
}
