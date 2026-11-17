/** This file contains types for the dashboard service. */

// SECTION: Types
export interface PopularItemSummary {
    id: string;
    name: string;
    icon?: string | null;
}

export interface SecurityScoreSummary {
    overallScore: number;
    entriesWithUrlCount: number;
    entriesGroupedCount: number;
    archivedEntriesCount: number;
    staleEntriesCount: number;
}

export interface EntryTypeDistributionItem {
    type: string;
    count: number;
}

export type RecentActivityAction = 'CREATED' | 'UPDATED' | 'ARCHIVED';

export interface RecentActivityItem {
    entryId: string;
    entryName: string;
    entryType: string;
    action: RecentActivityAction;
    timestamp: string;
}

export interface DashboardStatsSummary {
    totalProfiles: number;
    totalGroups: number;
    totalEntries: number;
    totalFavorites: number;
    popularProfile: PopularItemSummary | null;
    popularGroup: PopularItemSummary | null;
}

export interface DashboardOverviewData extends DashboardStatsSummary {
    securityScore: SecurityScoreSummary;
    entryTypeDistribution: EntryTypeDistributionItem[];
    recentActivity: RecentActivityItem[];
}

export type DashboardStatsData = DashboardOverviewData;

export interface DashboardApiResponse<T> {
    message?: string;
    data: T;
    error?: string;
}

export type DashboardStatsResponse =
    DashboardApiResponse<DashboardOverviewData>;
// !SECTION: Types
