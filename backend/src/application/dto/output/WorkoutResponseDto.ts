import type { Workout } from "../../../domain/aggregates/Workout";

export type WorkoutResponseDto = {
  id: string;
  name: string;
  userId: string;
  status: string;
  aiOutput: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export class WorkoutResponseMapper {
  static toResponse(workout: Workout): WorkoutResponseDto {
    return {
      id: workout.id,
      name: workout.name,
      userId: workout.userId,
      status: workout.status,
      aiOutput: workout.aiOutput,
      createdAt: workout.createdAt,
      updatedAt: workout.updatedAt,
    };
  }
}
