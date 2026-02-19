import { inject, injectable } from "inversify";
import { TYPES } from "../dto/types";
import { WorkoutRepository } from "../../domain/repository/WorkoutRepository";
import { WorkoutResponseDto, WorkoutResponseMapper } from "../dto/output/WorkoutResponseDto";

@injectable()
export class GetWorkoutByIdUseCase {
  constructor(
    @inject(TYPES.WorkoutRepository) private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute(id: string): Promise<WorkoutResponseDto> {
    const workout = await this.workoutRepository.findById(id);

    if (!workout) {
      const error = new Error(`Workout not found: ${id}`);
      (error as any).statusCode = 404;
      throw error;
    }

    return WorkoutResponseMapper.toResponse(workout);
  }
}
