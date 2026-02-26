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

export interface WorkoutPlan {
  name: string;
  days: Array<{
    day: string;
    focus: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rest: string;
      notes?: string;
      videoUrl?: string | null;
    }>;
  }>;
}

export interface WorkoutRecord {
  id: string;
  name: string;
  userId: string;
  status: string;
  aiOutput: WorkoutPlan | null;
  createdAt: string;
  updatedAt: string;
  shareToken?: string | null;
}
