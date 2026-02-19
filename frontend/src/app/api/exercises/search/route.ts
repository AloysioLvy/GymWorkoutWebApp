import { internalFetch } from '@/lib/internal-fetch';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';

  const res = await internalFetch(
    `${API_URL}/exercises/search?q=${encodeURIComponent(q)}`,
  );

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
