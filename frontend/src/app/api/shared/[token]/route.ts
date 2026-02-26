import { internalFetch } from '@/lib/internal-fetch';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const res = await internalFetch(`${API_URL}/workout/shared/${token}`, {
    cache: 'no-store',
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
