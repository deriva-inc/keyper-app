'use client';

import { useDataStore } from '@/lib/data-store';
import { VaultEntry } from '@/lib/types/model';
import useUIStore from '@/lib/ui-store';
import {
    entryTypeIcons,
    formatKey,
    getEnergyIllustrationPath,
    TOP_NAV_LINKS
} from '@/lib/utils';
import { dashboardApi } from '@/services/dashboard/network';
import type {
    DashboardOverviewData,
    RecentActivityAction
} from '@/services/dashboard/types';
import { fetchFavoriteEntriesFromNetwork } from '@/services/vault/network';
import Header from '@/src/components/blocks/header';
import AppSidebar from '@/src/components/ui/app-sidebar';
import { formatDistanceToNow } from 'date-fns';
import { Add, FavoriteFilled, Friends, Locker, Shapes } from 'elementa-icons';
import {
    Badge,
    Button,
    ClientSideError,
    EmptyState,
    ErrorState,
    LoadingState,
    logger,
    SidebarProvider,
    Skeleton,
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    Text,
    TextVariant,
    UI_STATE_ENUM,
    useElementa
} from 'get-elementa-ui';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import VaultEntryTableRowItem from '../vault/VaultEntryTableRowItem';
import DashboardStatsCard from './DashboardStatsCard';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

/**
 * Resolves a computed CSS variable value from documentElement at runtime.
 */
function getCssToken(variableName: string, fallback: string): string {
    if (typeof window === 'undefined') return fallback;
    const val = getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
    return val || fallback;
}

function getActivityBadgeClass(action: RecentActivityAction): string {
    switch (action) {
        case 'CREATED':
            return 'bg-bg-success text-text-success';
        case 'ARCHIVED':
            return 'bg-bg-warning text-text-warning';
        default:
            return 'bg-bg-info text-text-info';
    }
}

/**
 * This function renders the Dashboard page on the UI.
 *
 * @author Aayush Goyal
 * @modified 2026-11-18
 */
export default function DashboardPage() {
    // SECTION: Constants and Variables
    const actions = useUIStore((state) => state.actions);
    const activeProfile = useDataStore((state) => state.activeProfile);
    const profiles = useDataStore((state) => state.profiles);
    const userDetails = useDataStore((state) => state.userDetails);
    const { energy, theme } = useElementa();
    const router = useRouter();
    // !SECTION: Constants and Variables

    // SECTION: States
    const [uiState, setUIState] = useState<UI_STATE_ENUM>(
        UI_STATE_ENUM.LOADING
    );
    const [statsData, setStatsData] = useState<DashboardOverviewData | null>(
        null
    );
    const [favoriteEntries, setFavoriteEntries] = useState<VaultEntry[]>([]);
    const [isProfileWidgetsLoading, setIsProfileWidgetsLoading] =
        useState<boolean>(false);
    const hasLoadedInitialRef = useRef<boolean>(false);
    // !SECTION: States

    // SECTION: API Queries
    const loadDashboardData = async () => {
        setUIState(UI_STATE_ENUM.LOADING);
        try {
            const profileId = activeProfile?.id || '';
            const [statsRes, favoritesRes] = await Promise.all([
                dashboardApi.getOverview(profileId || undefined),
                profileId
                    ? fetchFavoriteEntriesFromNetwork(profileId)
                    : Promise.resolve({ data: [] as VaultEntry[] })
            ]);

            if (statsRes instanceof ClientSideError) {
                logger.error(
                    'Failed to load dashboard stats:',
                    statsRes.message
                );
                setUIState(UI_STATE_ENUM.ERROR);
                return;
            }

            setStatsData(statsRes.data);
            hasLoadedInitialRef.current = true;

            if (!(favoritesRes instanceof ClientSideError)) {
                setFavoriteEntries(favoritesRes.data || []);
            } else {
                setFavoriteEntries([]);
            }

            setUIState(UI_STATE_ENUM.IDLE);
        } catch (error) {
            logger.error('Failed to load dashboard data:', error);
            setUIState(UI_STATE_ENUM.ERROR);
        }
    };

    const loadProfileScopedWidgets = async (profileId?: string) => {
        setIsProfileWidgetsLoading(true);
        try {
            const [distRes, scoreRes, activityRes] = await Promise.all([
                dashboardApi.getDistribution(profileId),
                dashboardApi.getSecurityScore(profileId),
                dashboardApi.getActivity(profileId)
            ]);

            setStatsData((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    entryTypeDistribution:
                        distRes instanceof ClientSideError
                            ? prev.entryTypeDistribution
                            : distRes.data,
                    securityScore:
                        scoreRes instanceof ClientSideError
                            ? prev.securityScore
                            : scoreRes.data,
                    recentActivity:
                        activityRes instanceof ClientSideError
                            ? prev.recentActivity
                            : activityRes.data
                };
            });
        } catch (error) {
            logger.error('Failed to refresh profile-scoped widgets:', error);
        } finally {
            setIsProfileWidgetsLoading(false);
        }
    };
    // !SECTION: API Queries

    // SECTION: Side-effects
    useEffect(() => {
        actions.setCurrentPage(
            TOP_NAV_LINKS.find((link) => link.id === 'dashboard')?.id || ''
        );
    }, []);

    useEffect(() => {
        if (!hasLoadedInitialRef.current) {
            loadDashboardData();
        } else {
            loadProfileScopedWidgets(activeProfile?.id || undefined);
        }
    }, [activeProfile?.id]);
    // !SECTION: Side-effects

    // SECTION: Computed Metrics
    const effectiveTotalEntries = statsData?.totalEntries ?? 0;
    const effectiveTotalGroups = statsData?.totalGroups ?? 0;
    const effectiveTotalProfiles = statsData?.totalProfiles ?? 0;
    const effectiveTotalFavorites = statsData?.totalFavorites ?? 0;
    const securityScore = statsData?.securityScore ?? {
        overallScore: 100,
        entriesWithUrlCount: 0,
        entriesGroupedCount: 0,
        archivedEntriesCount: 0,
        staleEntriesCount: 0
    };
    const entryTypeDistribution = statsData?.entryTypeDistribution ?? [];
    const recentActivity = statsData?.recentActivity ?? [];
    const popularProfile = statsData?.popularProfile ?? null;
    const popularGroup = statsData?.popularGroup ?? null;
    const scopedTotalEntries = activeProfile
        ? entryTypeDistribution.reduce((sum, item) => sum + item.count, 0)
        : effectiveTotalEntries;

    const isDataEmpty =
        effectiveTotalEntries === 0 &&
        effectiveTotalGroups === 0 &&
        effectiveTotalProfiles === 0 &&
        effectiveTotalFavorites === 0 &&
        favoriteEntries.length === 0;

    const vaultHealthScore = securityScore.overallScore;

    const entryTypeChartOption = useMemo(() => {
        const primaryColor = getCssToken(
            '--bg-active-accent-primary',
            '#C1582F'
        );
        const secondaryColor = getCssToken(
            '--bg-active-accent-secondary',
            '#70A073'
        );
        const textTertiary = getCssToken('--text-tertiary', '#6B7280');
        const strokePrimary = getCssToken('--stroke-base-primary', '#E5E7EB');

        const categories = entryTypeDistribution.map((item) =>
            formatKey(item.type)
        );
        const values = entryTypeDistribution.map((item) => item.count);

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            grid: {
                left: 12,
                right: 12,
                top: 20,
                bottom: 8,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: categories.length > 0 ? categories : ['No Entries'],
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: textTertiary, fontSize: 11 }
            },
            yAxis: {
                type: 'value',
                minInterval: 1,
                splitLine: {
                    lineStyle: {
                        color: strokePrimary,
                        type: 'dashed',
                        opacity: 0.35
                    }
                },
                axisLabel: { color: textTertiary, fontSize: 11 }
            },
            series: [
                {
                    name: 'Entries',
                    type: 'bar',
                    barMaxWidth: 36,
                    data: values.length > 0 ? values : [0],
                    itemStyle: {
                        borderRadius: [8, 8, 2, 2],
                        color: (params: { dataIndex: number }) =>
                            params.dataIndex % 2 === 0
                                ? primaryColor
                                : secondaryColor
                    }
                }
            ]
        };
    }, [entryTypeDistribution, energy, theme]);

    const healthGaugeOption = useMemo(() => {
        const primaryColor = getCssToken(
            '--bg-active-accent-primary',
            '#C1582F'
        );
        const trackColor = getCssToken('--bg-raised-secondary', '#E5E7EB');
        const textPrimary = getCssToken('--text-primary', '#111827');

        return {
            series: [
                {
                    type: 'gauge',
                    startAngle: 90,
                    endAngle: -270,
                    radius: '88%',
                    pointer: { show: false },
                    progress: {
                        show: true,
                        overlap: false,
                        roundCap: true,
                        clip: false,
                        itemStyle: { color: primaryColor }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 12,
                            color: [[1, trackColor]]
                        }
                    },
                    splitLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: { show: false },
                    data: [{ value: vaultHealthScore }],
                    detail: {
                        width: 60,
                        height: 24,
                        fontSize: 26,
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: textPrimary,
                        offsetCenter: [0, '0%'],
                        formatter: '{value}%'
                    }
                }
            ]
        };
    }, [vaultHealthScore, energy, theme]);

    const displayEntries = favoriteEntries.slice(0, 5);
    // !SECTION: Computed Metrics

    // SECTION: UI
    const firstName = userDetails?.name?.split(' ')[0] || 'there';

    return (
        <div className="bg-bg-base-primary min-h-screen transition-colors duration-300">
            <SidebarProvider>
                <AppSidebar />
                <div className="w-full pb-8">
                    <Header />
                    <div className="mx-auto max-w-360 px-4 sm:px-8">
                        {uiState === UI_STATE_ENUM.LOADING ? (
                            <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center py-6">
                                <LoadingState
                                    text="Loading your sanctuary..."
                                    illustration={getEnergyIllustrationPath(
                                        'loading-state',
                                        energy
                                    )}
                                />
                            </div>
                        ) : uiState === UI_STATE_ENUM.ERROR ? (
                            <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center py-6">
                                <ErrorState
                                    heading="Unable to Load Dashboard"
                                    text="An error occurred while loading your vault statistics and favorites."
                                    primaryButtonOptions={{
                                        text: 'Retry',
                                        onClick: () => loadDashboardData()
                                    }}
                                    illustration={getEnergyIllustrationPath(
                                        'error-state',
                                        energy
                                    )}
                                />
                            </div>
                        ) : isDataEmpty ? (
                            <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center py-6">
                                <EmptyState
                                    heading="Welcome to Your Vault"
                                    text="Your sanctuary is clean and empty. Create profiles, groups, and store your encrypted credentials to get started."
                                    illustration={getEnergyIllustrationPath(
                                        'empty-state',
                                        energy
                                    )}
                                    primaryButtonOptions={{
                                        text: 'Go to Vault',
                                        onClick: () => router.push('/vault')
                                    }}
                                    secondaryButtonOptions={{
                                        text: 'Manage Profiles',
                                        onClick: () => router.push('/profiles')
                                    }}
                                />
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-6 pt-6"
                            >
                                {/* Greeting & Quick Action Header */}
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <Text
                                            variant={TextVariant.H2}
                                            className="font-heading text-text-primary font-bold"
                                        >
                                            Hi {firstName},
                                        </Text>
                                    </div>
                                    <Button
                                        onClick={() => router.push('/vault')}
                                        className="gap-2 self-start sm:self-center"
                                    >
                                        <Add className="size-4" />
                                        Open Vault
                                    </Button>
                                </div>

                                {/* Top 4 KPI Metric Cards (70-20-10 balanced) */}
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.06
                                            }
                                        }
                                    }}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-2 gap-4 lg:grid-cols-4"
                                >
                                    <DashboardStatsCard
                                        statHeading="Total Entries"
                                        statIcon={<Locker className="size-5" />}
                                        statValue={String(
                                            effectiveTotalEntries
                                        )}
                                        statSubtext="AES-256-GCM encrypted"
                                    />
                                    <DashboardStatsCard
                                        statHeading="Profiles"
                                        statIcon={
                                            <Friends className="size-5" />
                                        }
                                        statValue={String(
                                            effectiveTotalProfiles
                                        )}
                                        statSubtext="Isolated compartments"
                                    />
                                    <DashboardStatsCard
                                        statHeading="Groups"
                                        statIcon={<Shapes className="size-5" />}
                                        statValue={String(effectiveTotalGroups)}
                                        statSubtext="Active collections"
                                    />
                                    <DashboardStatsCard
                                        statHeading="Favorites"
                                        statIcon={
                                            <FavoriteFilled className="size-5" />
                                        }
                                        statValue={String(
                                            effectiveTotalFavorites
                                        )}
                                        statSubtext="Quick-access items"
                                    />
                                </motion.div>

                                {/* 12-Column Asymmetric Bento Grid (Inspired by image.png & image-1.png) */}
                                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                                    {/* Left 8 Columns: Vault Distribution Chart + Recent/Starred Entries */}
                                    <div className="flex flex-col gap-6 xl:col-span-8">
                                        {/* Entry Composition Chart */}
                                        <section className="bg-bg-raised-primary rounded-2xl p-6 shadow-md">
                                            <div className="mb-4 flex items-center justify-between gap-2">
                                                <div>
                                                    <Text
                                                        variant={TextVariant.H4}
                                                        className="font-heading text-text-primary font-semibold"
                                                    >
                                                        Vault Composition
                                                    </Text>
                                                    <Text
                                                        variant={
                                                            TextVariant.Caption
                                                        }
                                                        className="text-text-tertiary"
                                                    >
                                                        Distribution of
                                                        credentials by entry
                                                        type
                                                    </Text>
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-bg-raised-secondary text-text-secondary"
                                                >
                                                    {scopedTotalEntries} total
                                                </Badge>
                                            </div>
                                            {isProfileWidgetsLoading ? (
                                                <Skeleton className="h-56 w-full rounded-xl" />
                                            ) : entryTypeDistribution.length ===
                                              0 ? (
                                                <div className="flex h-44 items-center justify-center">
                                                    <Text
                                                        variant={
                                                            TextVariant.Caption
                                                        }
                                                        className="text-text-tertiary"
                                                    >
                                                        No entries recorded yet.
                                                    </Text>
                                                </div>
                                            ) : (
                                                <div className="h-56 w-full">
                                                    <ReactECharts
                                                        option={
                                                            entryTypeChartOption
                                                        }
                                                        style={{
                                                            height: '100%',
                                                            width: '100%'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </section>

                                        {/* Popular Profile & Popular Group Cards */}
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <section className="bg-bg-raised-primary flex items-center justify-between rounded-2xl p-5 shadow-md">
                                                <div className="min-w-0">
                                                    <Text
                                                        variant={
                                                            TextVariant.Caption
                                                        }
                                                        className="text-text-tertiary"
                                                    >
                                                        Popular Profile
                                                    </Text>
                                                    <Text
                                                        variant={TextVariant.H5}
                                                        className="font-heading text-text-primary mt-1 truncate font-semibold"
                                                    >
                                                        {popularProfile?.name ||
                                                            'No profile yet'}
                                                    </Text>
                                                </div>
                                                <div className="bg-bg-raised-secondary text-text-accent-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                                                    <Friends className="size-5" />
                                                </div>
                                            </section>
                                            <section className="bg-bg-raised-primary flex items-center justify-between rounded-2xl p-5 shadow-md">
                                                <div className="min-w-0">
                                                    <Text
                                                        variant={
                                                            TextVariant.Caption
                                                        }
                                                        className="text-text-tertiary"
                                                    >
                                                        Popular Group
                                                    </Text>
                                                    <Text
                                                        variant={TextVariant.H5}
                                                        className="font-heading text-text-primary mt-1 truncate font-semibold"
                                                    >
                                                        {popularGroup?.name ||
                                                            'No group yet'}
                                                    </Text>
                                                </div>
                                                <div className="bg-bg-raised-secondary text-text-accent-secondary flex size-10 shrink-0 items-center justify-center rounded-xl">
                                                    <Shapes className="size-5" />
                                                </div>
                                            </section>
                                        </div>

                                        {/* Starred Vault Entries Table */}
                                        <section className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <Text
                                                    variant={TextVariant.H4}
                                                    className="font-heading text-text-primary font-semibold"
                                                >
                                                    Starred Vault Entries
                                                </Text>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.push(
                                                            '/favorites'
                                                        )
                                                    }
                                                >
                                                    View All
                                                </Button>
                                            </div>
                                            <div className="bg-bg-raised-primary overflow-hidden rounded-2xl shadow-md">
                                                {displayEntries.length === 0 ? (
                                                    <div className="p-6 text-center">
                                                        <Text
                                                            variant={
                                                                TextVariant.Caption
                                                            }
                                                            className="text-text-tertiary"
                                                        >
                                                            No starred entries
                                                            yet.
                                                        </Text>
                                                    </div>
                                                ) : (
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="pl-4 sm:pl-6">
                                                                    Entry
                                                                </TableHead>
                                                                <TableHead className="hidden sm:table-cell">
                                                                    Password
                                                                </TableHead>
                                                                <TableHead className="hidden md:table-cell">
                                                                    Profile
                                                                </TableHead>
                                                                <TableHead className="hidden lg:table-cell">
                                                                    Updated
                                                                </TableHead>
                                                                <TableHead className="pr-4 text-right sm:pr-6">
                                                                    Details
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {displayEntries.map(
                                                                (
                                                                    entry,
                                                                    idx
                                                                ) => {
                                                                    const typeIconObj =
                                                                        entryTypeIcons.find(
                                                                            (
                                                                                i
                                                                            ) =>
                                                                                i.type ===
                                                                                entry.type
                                                                        );
                                                                    const TypeIconComponent =
                                                                        typeIconObj?.icon;
                                                                    const prof =
                                                                        profiles.find(
                                                                            (
                                                                                p
                                                                            ) =>
                                                                                p.id ===
                                                                                entry.profileId
                                                                        );

                                                                    return (
                                                                        <VaultEntryTableRowItem
                                                                            key={
                                                                                entry.id
                                                                            }
                                                                            entry={
                                                                                entry
                                                                            }
                                                                            index={
                                                                                idx
                                                                            }
                                                                            profileDetails={
                                                                                prof
                                                                                    ? {
                                                                                          icon: prof.icon,
                                                                                          name: prof.name
                                                                                      }
                                                                                    : undefined
                                                                            }
                                                                            TypeIconComponent={
                                                                                TypeIconComponent
                                                                            }
                                                                        />
                                                                    );
                                                                }
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                )}
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right 4 Columns: Security Score Gauge + Recent Activity Timeline */}
                                    <div className="flex flex-col gap-6 xl:col-span-4">
                                        {/* Vault Hygiene Score Card */}
                                        <section className="bg-bg-raised-primary flex flex-col items-center rounded-2xl p-6 text-center shadow-md">
                                            <div className="mb-2 flex w-full items-center justify-between">
                                                <Text
                                                    variant={TextVariant.H4}
                                                    className="font-heading text-text-primary font-semibold"
                                                >
                                                    Vault Hygiene
                                                </Text>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-bg-active-fill-accent-primary text-text-accent-primary"
                                                >
                                                    AES-256
                                                </Badge>
                                            </div>
                                            <div className="h-44 w-44">
                                                {isProfileWidgetsLoading ? (
                                                    <Skeleton className="size-44 rounded-full" />
                                                ) : (
                                                    <ReactECharts
                                                        option={
                                                            healthGaugeOption
                                                        }
                                                        style={{
                                                            height: '100%',
                                                            width: '100%'
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <Text
                                                variant={TextVariant.Caption}
                                                className="text-text-tertiary mt-1 max-w-xs"
                                            >
                                                {scopedTotalEntries === 0
                                                    ? 'Add your first encrypted entry to begin tracking vault hygiene.'
                                                    : 'Organization score based on URL binding, grouping, archive status, and freshness.'}
                                            </Text>
                                            <div className="mt-4 grid w-full grid-cols-2 gap-2">
                                                <div className="bg-bg-raised-secondary rounded-xl p-3 text-left">
                                                    <Text
                                                        variant={
                                                            TextVariant.Caption
                                                        }
                                                        className="text-text-tertiary"
                                                    >
                                                        Grouped
                                                    </Text>
                                                    <Text
                                                        variant={TextVariant.H5}
                                                        className="text-text-primary font-mono font-bold"
                                                    >
                                                        {
                                                            securityScore.entriesGroupedCount
                                                        }
                                                        /{scopedTotalEntries}
                                                    </Text>
                                                </div>
                                                <div className="bg-bg-raised-secondary rounded-xl p-3 text-left">
                                                    <Text
                                                        variant={
                                                            TextVariant.Caption
                                                        }
                                                        className="text-text-tertiary"
                                                    >
                                                        URL Linked
                                                    </Text>
                                                    <Text
                                                        variant={TextVariant.H5}
                                                        className="text-text-primary font-mono font-bold"
                                                    >
                                                        {
                                                            securityScore.entriesWithUrlCount
                                                        }
                                                        /{scopedTotalEntries}
                                                    </Text>
                                                </div>
                                                <div className="bg-bg-raised-secondary rounded-xl p-3 text-left">
                                                    <Text
                                                        variant={
                                                            TextVariant.Caption
                                                        }
                                                        className="text-text-tertiary"
                                                    >
                                                        Archived
                                                    </Text>
                                                    <Text
                                                        variant={TextVariant.H5}
                                                        className="text-text-primary font-mono font-bold"
                                                    >
                                                        {
                                                            securityScore.archivedEntriesCount
                                                        }
                                                    </Text>
                                                </div>
                                                <div className="bg-bg-raised-secondary rounded-xl p-3 text-left">
                                                    <Text
                                                        variant={
                                                            TextVariant.Caption
                                                        }
                                                        className="text-text-tertiary"
                                                    >
                                                        Stale (&gt;90d)
                                                    </Text>
                                                    <Text
                                                        variant={TextVariant.H5}
                                                        className="text-text-primary font-mono font-bold"
                                                    >
                                                        {
                                                            securityScore.staleEntriesCount
                                                        }
                                                    </Text>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Recent Activity Timeline */}
                                        <section className="bg-bg-raised-primary flex flex-col gap-4 rounded-2xl p-6 shadow-md">
                                            <div className="flex items-center justify-between">
                                                <Text
                                                    variant={TextVariant.H4}
                                                    className="font-heading text-text-primary font-semibold"
                                                >
                                                    Recent Activity
                                                </Text>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.push('/vault')
                                                    }
                                                >
                                                    See all
                                                </Button>
                                            </div>

                                            {isProfileWidgetsLoading ? (
                                                <div className="flex flex-col gap-3">
                                                    <Skeleton className="h-14 w-full rounded-xl" />
                                                    <Skeleton className="h-14 w-full rounded-xl" />
                                                    <Skeleton className="h-14 w-full rounded-xl" />
                                                </div>
                                            ) : recentActivity.length === 0 ? (
                                                <Text
                                                    variant={
                                                        TextVariant.Caption
                                                    }
                                                    className="text-text-tertiary py-4 text-center"
                                                >
                                                    No recent activity recorded
                                                    yet.
                                                </Text>
                                            ) : (
                                                <div className="flex flex-col gap-3">
                                                    {recentActivity.map(
                                                        (item) => (
                                                            <div
                                                                key={`${item.entryId}-${item.timestamp}`}
                                                                className="bg-bg-raised-secondary flex items-center justify-between gap-3 rounded-xl p-3 transition-transform hover:translate-x-0.5"
                                                            >
                                                                <div className="min-w-0">
                                                                    <Text
                                                                        variant={
                                                                            TextVariant.Button
                                                                        }
                                                                        className="text-text-primary block truncate"
                                                                    >
                                                                        {
                                                                            item.entryName
                                                                        }
                                                                    </Text>
                                                                    <div className="mt-1 flex items-center gap-2">
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className={`px-1.5 py-0 text-[10px] font-semibold ${getActivityBadgeClass(item.action)}`}
                                                                        >
                                                                            {
                                                                                item.action
                                                                            }
                                                                        </Badge>
                                                                        <Text
                                                                            variant={
                                                                                TextVariant.Caption
                                                                            }
                                                                            className="text-text-tertiary truncate"
                                                                        >
                                                                            {formatKey(
                                                                                item.entryType
                                                                            )}
                                                                        </Text>
                                                                    </div>
                                                                </div>
                                                                <Text
                                                                    variant={
                                                                        TextVariant.Caption
                                                                    }
                                                                    className="text-text-tertiary shrink-0 font-mono"
                                                                >
                                                                    {formatDistanceToNow(
                                                                        new Date(
                                                                            item.timestamp
                                                                        ),
                                                                        {
                                                                            addSuffix: true
                                                                        }
                                                                    )}
                                                                </Text>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </section>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </SidebarProvider>
        </div>
    );
}
