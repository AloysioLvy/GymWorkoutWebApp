import { withAuth } from '@workos-inc/authkit-nextjs';
import { internalFetch } from '@/lib/internal-fetch';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export async function POST(_request: Request) {
  const { user } = await withAuth();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Usa o userId do token de sessão — nunca confia no body do cliente
  const res = await internalFetch(`${API_URL}/workout/generate`, {
    method: 'POST',
    body: JSON.stringify({ userId: user.id }),
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
