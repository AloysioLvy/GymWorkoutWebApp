import { Exercise } from "../aggregates/Exercise";

export interface ExerciseRepository {
  findByName(name: string): Promise<Exercise[]>;
  findById(id: string): Promise<Exercise | null>;
  create(exercise: Exercise): Promise<Exercise>;
  upsertMany(exercises: Exercise[]): Promise<void>;
}
