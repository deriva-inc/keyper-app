// Import the server-only argon2 library
import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import logger from '@/lib/logger';
import { GetUserSaltResponse, HTTP_STATUS_CODE } from '@/lib/types/api';

/* Handle GET request to fetch user's unique salt. */
export async function GET(req: Request) {
    const email = req.headers.get('x-email') as string;
    const targetUrl = `${process.env.SERVER_BASE_URL}/users/salt?email=${email}`;
    logger.info(`[GET] ${targetUrl} | Fetching salt for the user: ${email}`);

    try {
        const userSaltsRes = await fetch(`${targetUrl}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const userSaltsData =
            (await userSaltsRes.json()) as GetUserSaltResponse;

        return NextResponse.json(userSaltsData, {
            status: userSaltsRes.status
        });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to retrieve salt for the user: ${email}.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[GET] /api/v1/users/salt?email=${email}`
        );
    }
}
