import { proxyDashboardGet } from '@/lib/api-server';

/** Handle GET request to fetch combined dashboard overview. */
export async function GET(req: Request) {
    return proxyDashboardGet(req, '');
}
