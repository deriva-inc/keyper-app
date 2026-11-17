import { proxyDashboardGet } from '@/lib/api-server';

/** Handle GET request to fetch dashboard recent activity feed. */
export async function GET(req: Request) {
    return proxyDashboardGet(req, '/activity');
}
