import { inject, injectable } from "inversify";
import { TYPES } from "../dto/types";
import { WorkoutRepository } from "../../domain/repository/WorkoutRepository";
import { WorkoutResponseDto, WorkoutResponseMapper } from "../dto/output/WorkoutResponseDto";

@injectable()
export class GetWorkoutsByUserIdUseCase {
  constructor(
    @inject(TYPES.WorkoutRepository) private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute(userId: string): Promise<WorkoutResponseDto[]> {
    const workouts = await this.workoutRepository.findByUserId(userId);
    return workouts.map(WorkoutResponseMapper.toResponse);
  }
}
