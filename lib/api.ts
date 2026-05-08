/**
 * This file contains utility functions for making API calls.
 */
import { NextResponse } from 'next/server';
import logger from '@/lib/logger';

class ClientSideError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ClientSideError';
    }
}

/**
 * This function handles errors that occur during client-side API calls.
 *
 * @param error - The error object caught during the API call.
 * @returns A ClientSideError instance with a descriptive message.
 */
const handleErrorOnClientSideAPICalls = (error: unknown) => {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        errorMessage = JSON.stringify(error); // Try to stringify if it's an object
    }

    return new ClientSideError(errorMessage);
};

/**
 * This function handles errors that occur during server-side API calls.
 *
 * @param error
 * @param errorStatusMessage
 * @param errorStatusCode
 * @param apiRoute
 * @returns
 */
const handleErrorOnServerSideAPICalls = (
    error: unknown,
    errorStatusMessage: string,
    errorStatusCode: number,
    apiRoute: string
) => {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        errorMessage = JSON.stringify(error); // Try to stringify if it's an object
    }

    logger.error(`Error in API route ${apiRoute}: ${errorMessage}`);

    return NextResponse.json(
        { error: errorStatusMessage },
        { status: errorStatusCode }
    );
};

export { ClientSideError };
export { handleErrorOnClientSideAPICalls, handleErrorOnServerSideAPICalls };
