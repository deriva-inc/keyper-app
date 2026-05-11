// Import the server-only argon2 library
import { NextResponse } from 'next/server';
import { handleErrorOnServerSideAPICalls } from '@/lib/api';
import logger from '@/lib/logger';
import { GetUserSaltResponse, HTTP_STATUS_CODE } from '@/lib/types/api';

/* Handle GET request to fetch user's unique salt. */
export async function GET(req: Request) {
    const email = req.headers.get('x-email') as string;
    const targetUrl = `${process.env.SERVER_BASE_URL}/users/salt`;
    logger.info(`[GET] ${targetUrl} | Fetching salt for the user: ${email}`);

    try {
        const k8sClusters = await fetch(`${targetUrl}?email=${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = (await k8sClusters.json()) as GetUserSaltResponse;

        return NextResponse.json(data, { status: k8sClusters.status });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            `Failed to retrieve salt for the user: ${email}.`,
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            `[GET] /api/v1/users/salt?email=${email}`
        );
    }
}
