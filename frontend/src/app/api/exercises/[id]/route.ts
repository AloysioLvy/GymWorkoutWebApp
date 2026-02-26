import { internalFetch } from '@/lib/internal-fetch';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await internalFetch(`${API_URL}/exercises/${id}`);
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
