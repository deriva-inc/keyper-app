import { getServerBaseUrl } from '@/lib/api-server';
import { GetUserSaltResponse, HTTP_STATUS_CODE } from '@/lib/types/api';
import { handleErrorOnServerSideAPICalls, logger } from 'get-elementa-ui';
import { NextResponse } from 'next/server';

/* Handle GET request to fetch user's unique salt. */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || req.headers.get('x-email') || '';
    const targetUrl = `${getServerBaseUrl(req)}/users/salt?email=${email}`;
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
