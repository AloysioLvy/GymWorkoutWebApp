import { internalFetch } from './internal-fetch';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export async function createUser(
  id: string,
  email: string,
  firstName: string,
  lastName: string,
): Promise<void> {
  const res = await internalFetch(`${API_URL}/users`, {
    method: 'POST',
    body: JSON.stringify({ id, email, firstName, lastName }),
  });

  if (!res.ok && res.status !== 409) {
    throw new Error(`Failed to create user: ${res.status}`);
  }
}

export async function checkGymProfile(userId: string): Promise<boolean> {
  try {
    const res = await internalFetch(`${API_URL}/gym-profile/${userId}`, {
      cache: 'no-store',
    });
    return res.ok;
  } catch {
    return false;
  }
}
