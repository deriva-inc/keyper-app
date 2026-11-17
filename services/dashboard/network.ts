/** This file contains the network functions for the dashboard service. */

import {
    ClientSideError,
    handleErrorOnClientSideAPICalls
} from 'get-elementa-ui';
import { apiFetch } from '@/lib/api-client';
import { DASHBOARD_API_ENDPOINTS } from '@/services/dashboard/constants';
import type {
    DashboardApiResponse,
    DashboardOverviewData,
    DashboardStatsSummary,
    EntryTypeDistributionItem,
    RecentActivityItem,
    SecurityScoreSummary
} from '@/services/dashboard/types';

/**
 * Shared fetcher for dashboard API endpoints with optional profile scoping.
 *
 * @param endpoint - Next.js dashboard API route.
 * @param profileId - Optional active profile ID. Omit for user-wide aggregation.
 * @returns A promise resolving to the typed API response or a ClientSideError.
 */
async function fetchDashboardEndpoint<T>(
    endpoint: string,
    profileId?: string
): Promise<DashboardApiResponse<T> | ClientSideError> {
    try {
        const headers: Record<string, string> = {};
        if (profileId) {
            headers['X-Profile-Id'] = profileId;
        }

        const response = await apiFetch(endpoint, {
            method: 'GET',
            headers
        });

        const data = (await response.json()) as DashboardApiResponse<T>;
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch dashboard data.');
        }
        return data;
    } catch (error: unknown) {
        return handleErrorOnClientSideAPICalls(error);
    }
}

export const dashboardApi = {
    getOverview: (profileId?: string) =>
        fetchDashboardEndpoint<DashboardOverviewData>(
            DASHBOARD_API_ENDPOINTS.OVERVIEW,
            profileId
        ),
    getStats: (profileId?: string) =>
        fetchDashboardEndpoint<DashboardStatsSummary>(
            DASHBOARD_API_ENDPOINTS.STATS,
            profileId
        ),
    getSecurityScore: (profileId?: string) =>
        fetchDashboardEndpoint<SecurityScoreSummary>(
            DASHBOARD_API_ENDPOINTS.SECURITY_SCORE,
            profileId
        ),
    getDistribution: (profileId?: string) =>
        fetchDashboardEndpoint<EntryTypeDistributionItem[]>(
            DASHBOARD_API_ENDPOINTS.DISTRIBUTION,
            profileId
        ),
    getActivity: (profileId?: string) =>
        fetchDashboardEndpoint<RecentActivityItem[]>(
            DASHBOARD_API_ENDPOINTS.ACTIVITY,
            profileId
        )
};

export const fetchDashboardStatsFromNetwork = dashboardApi.getOverview;
