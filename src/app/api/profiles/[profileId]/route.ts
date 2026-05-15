import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import {
    DeleteProfileResponse,
    SingleProfileResponse,
    HTTP_STATUS_CODE
} from '@/lib/types/api';
import logger from '@/lib/logger';

/** Handle [PATCH] /api/v1/profile/:profileId for updating a profile. */
export async function PATCH(req: Request) {
    const headers = await req.headers;
    const profileId = headers.get('x-profile-id') as string;
    const targetUrl = `${process.env.SERVER_BASE_URL}/profiles/${profileId}`;
    const body = await req.json();

    logger.info(`[PATCH] | ${targetUrl} | Handling profile update request.`);

    try {
        const updateProfileRes = await fetch(`${targetUrl}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization') || ''
            },
            body: JSON.stringify(body)
        });

        const updateProfileData =
            (await updateProfileRes.json()) as SingleProfileResponse;

        return NextResponse.json(updateProfileData, {
            status: updateProfileRes.status
        });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to update profile on the platform.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[PATCH] /api/profiles/${profileId}`
        );
    }
}

/** Get information for a specific user profile. */
export async function GET(req: Request) {
    const profileId = req.headers.get('x-profile-id') as string;
    const headers = await req.headers;

    const targetUrl = `${process.env.SERVER_BASE_URL}/profiles/${profileId}`;
    logger.info(
        `[GET] ${targetUrl} | Fetching profile details for profile: ${profileId}`
    );

    try {
        const profileDetailsRes = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: headers.get('Authorization')
            }
        });

        const data = (await profileDetailsRes.json()) as SingleProfileResponse;

        return NextResponse.json(data, { status: profileDetailsRes.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to retrieve profile details for profile ${profileId}.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[GET] /api/profiles/${profileId}`
        );
    }
}

/** Delete a specific user profile. */
export async function DELETE(req: Request) {
    const profileId = req.headers.get('x-profile-id') as string;
    const headers = await req.headers;

    const targetUrl = `${process.env.SERVER_BASE_URL}/profiles/${profileId}`;
    logger.info(`[DELETE] ${targetUrl} | Deleting profile ${profileId}`);

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
            `Failed to delete profile ${profileId}.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[DELETE] /api/profiles/${profileId}`
        );
    }
}
