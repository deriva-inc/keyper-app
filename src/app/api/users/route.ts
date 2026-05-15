// Import the server-only argon2 library
import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import logger from '@/lib/logger';
import { GetUserDetailsResponse, HTTP_STATUS_CODE } from '@/lib/types/api';

/* Handle GET request to fetch user's details. */
export async function GET(req: Request) {
    const targetUrl = `${process.env.SERVER_BASE_URL}/users`;
    logger.info(`[GET] ${targetUrl} | Fetching details for the user.`);

    try {
        const userDetailsRes = await fetch(`${targetUrl}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: req.headers.get('Authorization') || ''
            }
        });

        const userDetailsData =
            (await userDetailsRes.json()) as GetUserDetailsResponse;

        return NextResponse.json(userDetailsData, {
            status: userDetailsRes.status
        });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to retrieve user details for the user.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[GET] /api/v1/users`
        );
    }
}

/* Handle DELETE request to delete a user's profile. */
export async function DELETE(req: Request) {
    const targetUrl = `${process.env.SERVER_BASE_URL}/users`;
    logger.info(`[DELETE] ${targetUrl} | Deleting user profile.`);

    try {
        const userDetailsRes = await fetch(`${targetUrl}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: req.headers.get('Authorization') || ''
            }
        });

        const userDetailsData =
            (await userDetailsRes.json()) as GetUserDetailsResponse;

        return NextResponse.json(userDetailsData, {
            status: userDetailsRes.status
        });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to delete user profile.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[DELETE] /api/v1/users`
        );
    }
}
