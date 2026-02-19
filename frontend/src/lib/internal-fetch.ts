/**
 * Fetch wrapper que adiciona automaticamente o header X-Internal-Secret
 * para autenticar as chamadas BFF → Backend.
 */
export function internalFetch(url: string, init: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
      'x-internal-secret': process.env.INTERNAL_API_SECRET ?? '',
    },
  });
}
