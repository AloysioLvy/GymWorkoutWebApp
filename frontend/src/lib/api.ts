export interface Exercise {
  id: string;
  name: string;
  gifUrl: string | null;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function searchExercises(query: string): Promise<Exercise[]> {
  if (!query.trim()) return [];

  const res = await fetch(
    `${API_BASE}/exercises/search?q=${encodeURIComponent(query)}`,
  );

  if (!res.ok) return [];

  return res.json();
}
