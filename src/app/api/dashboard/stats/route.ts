import { proxyDashboardGet } from '@/lib/api-server';

/** Handle GET request to fetch dashboard core KPIs and popular items. */
export async function GET(req: Request) {
    return proxyDashboardGet(req, '/stats');
}
