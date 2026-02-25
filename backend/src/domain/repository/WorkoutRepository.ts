import type { Workout } from "../aggregates/Workout";

export interface WorkoutRepository {
  create(workout: Workout): Promise<Workout>;
  findByUserId(userId: string): Promise<Workout[]>;
  findById(id: string): Promise<Workout | null>;
  updateStatus(id: string, status: string, data?: { aiOutput?: unknown; name?: string }): Promise<void>;
}
