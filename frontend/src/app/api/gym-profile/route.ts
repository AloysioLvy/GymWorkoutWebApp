import { withAuth } from '@workos-inc/authkit-nextjs';
import { internalFetch } from '@/lib/internal-fetch';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export async function POST(request: Request) {
  const { user } = await withAuth();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Garante que o userId do perfil é sempre o do usuário logado
  const res = await internalFetch(`${API_URL}/gym-profile`, {
    method: 'POST',
    body: JSON.stringify({ ...body, userId: user.id }),
  });

  const data = await res.json().catch(() => null);
  return Response.json(data, { status: res.status });
}
