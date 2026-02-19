import type { Exercise, WorkoutRecord } from '@/types';

export async function searchExercises(query: string): Promise<Exercise[]> {
  if (!query.trim()) return [];

  const res = await fetch(
    `/api/exercises/search?q=${encodeURIComponent(query)}`,
  );

  if (!res.ok) return [];

  return res.json();
}

export async function updateGymProfile(
  userId: string,
  answers: Record<string, unknown>,
): Promise<void> {
  const res = await fetch('/api/gym-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, answers }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update gym profile: ${res.status}`);
  }
}

export async function generateWorkout(userId: string): Promise<WorkoutRecord> {
  const res = await fetch('/api/workout/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    throw new Error(`Failed to generate workout: ${res.status}`);
  }

  return res.json();
}

export async function getWorkoutsByUser(userId: string): Promise<WorkoutRecord[]> {
  const res = await fetch(`/api/workout/user/${userId}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch workouts: ${res.status}`);
  }

  return res.json();
}

export async function getWorkoutById(id: string): Promise<WorkoutRecord> {
  const res = await fetch(`/api/workout/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch workout: ${res.status}`);
  }

  return res.json();
}
