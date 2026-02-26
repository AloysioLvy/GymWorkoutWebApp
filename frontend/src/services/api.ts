import type { Exercise, WorkoutRecord } from '@/types';

// ---------------------------------------------------------------------------
// Cache de treinos no localStorage (por userId)
// ---------------------------------------------------------------------------

const cacheKey = (userId: string) => `gymai_workouts_${userId}`;

function getCachedWorkouts(userId: string): WorkoutRecord[] | null {
  try {
    const raw = localStorage.getItem(cacheKey(userId));
    if (!raw) return null;
    return JSON.parse(raw) as WorkoutRecord[];
  } catch {
    return null;
  }
}

export function setCachedWorkouts(userId: string, workouts: WorkoutRecord[]): void {
  try {
    localStorage.setItem(cacheKey(userId), JSON.stringify(workouts));
  } catch {
    // localStorage pode estar cheio ou indisponível
  }
}

// ---------------------------------------------------------------------------

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

  // Backend retorna 202 + { workoutId, status: 'pending' }
  const { workoutId } = (await res.json()) as { workoutId: string; status: string };

  // Busca o record completo (com createdAt, name: 'Gerando...', etc.)
  const pendingWorkout = await getWorkoutById(workoutId);

  const cached = getCachedWorkouts(userId) ?? [];
  setCachedWorkouts(userId, [pendingWorkout, ...cached]);
  return pendingWorkout;
}

export async function getWorkoutsByUser(userId: string): Promise<WorkoutRecord[]> {
  const cached = getCachedWorkouts(userId);
  if (cached) return cached;

  const res = await fetch(`/api/workout/user/${userId}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch workouts: ${res.status}`);
  }

  const workouts: WorkoutRecord[] = await res.json();
  setCachedWorkouts(userId, workouts);
  return workouts;
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

export async function shareWorkout(workoutId: string): Promise<string> {
  const res = await fetch(`/api/workout/${workoutId}/share`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to share workout');
  const { shareToken } = await res.json();
  return `${window.location.origin}/shared/${shareToken}`;
}
