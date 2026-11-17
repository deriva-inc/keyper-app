import { proxyDashboardGet } from '@/lib/api-server';

/** Handle GET request to fetch dashboard Zero-Knowledge security score telemetry. */
export async function GET(req: Request) {
    return proxyDashboardGet(req, '/security-score');
}
