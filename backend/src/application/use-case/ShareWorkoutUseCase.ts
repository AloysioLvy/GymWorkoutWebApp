import { inject, injectable } from "inversify";
import { TYPES } from "../dto/types";
import { WorkoutRepository } from "../../domain/repository/WorkoutRepository";

@injectable()
export class ShareWorkoutUseCase {
  constructor(
    @inject(TYPES.WorkoutRepository) private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute(workoutId: string): Promise<{ shareToken: string }> {
    const workout = await this.workoutRepository.findById(workoutId);

    if (!workout) {
      const error = new Error(`Workout not found: ${workoutId}`);
      (error as any).statusCode = 404;
      throw error;
    }

    if (workout.shareToken) {
      return { shareToken: workout.shareToken };
    }

    const token = crypto.randomUUID();
    await this.workoutRepository.setShareToken(workoutId, token);
    return { shareToken: token };
  }
}
