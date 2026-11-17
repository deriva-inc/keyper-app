import { proxyDashboardGet } from '@/lib/api-server';

/** Handle GET request to fetch dashboard entry type distribution. */
export async function GET(req: Request) {
    return proxyDashboardGet(req, '/distribution');
}
