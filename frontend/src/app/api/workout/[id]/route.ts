import { withAuth } from '@workos-inc/authkit-nextjs';
import { internalFetch } from '@/lib/internal-fetch';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user } = await withAuth();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const res = await internalFetch(`${API_URL}/workout/${id}`, {
    cache: 'no-store',
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
