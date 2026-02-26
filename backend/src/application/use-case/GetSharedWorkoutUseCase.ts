import { inject, injectable } from "inversify";
import { TYPES } from "../dto/types";
import { WorkoutRepository } from "../../domain/repository/WorkoutRepository";

export type SharedWorkoutDto = {
  id: string;
  name: string;
  status: string;
  aiOutput: unknown;
  createdAt: Date;
};

@injectable()
export class GetSharedWorkoutUseCase {
  constructor(
    @inject(TYPES.WorkoutRepository) private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute(token: string): Promise<SharedWorkoutDto> {
    const workout = await this.workoutRepository.findByShareToken(token);

    if (!workout) {
      const error = new Error(`Shared workout not found`);
      (error as any).statusCode = 404;
      throw error;
    }

    return {
      id: workout.id,
      name: workout.name,
      status: workout.status,
      aiOutput: workout.aiOutput,
      createdAt: workout.createdAt,
    };
  }
}
