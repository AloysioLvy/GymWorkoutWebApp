import { withAuth } from '@workos-inc/authkit-nextjs';
import { internalFetch } from '@/lib/internal-fetch';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { user } = await withAuth();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = await params;

  // Impede que um usuário acesse os treinos de outro (IDOR)
  if (user.id !== userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const res = await internalFetch(`${API_URL}/workout/user/${userId}`, {
    cache: 'no-store',
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
