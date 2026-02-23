import { inject, injectable } from "inversify";
import { randomUUID } from "crypto";
import { TYPES } from "../dto/types";
import { GymProfileRepository } from "../../domain/repository/GymProfileRepository";
import { WorkoutRepository } from "../../domain/repository/WorkoutRepository";
import { WorkoutAgentProvider } from "../provider/WorkoutAgentProvider";
import { GenerateWorkoutDto } from "../dto/input/GenerateWorkoutInput";
import { Workout } from "../../domain/aggregates/Workout";
import { WorkoutResponseDto, WorkoutResponseMapper } from "../dto/output/WorkoutResponseDto";
import { EnrichWorkoutWithVideosUseCase } from "./EnrichWorkoutWithVideosUseCase";

@injectable()
export class GenerateWorkoutUseCase {
  constructor(
    @inject(TYPES.GymProfileRepository) private readonly gymProfileRepository: GymProfileRepository,
    @inject(TYPES.WorkoutRepository) private readonly workoutRepository: WorkoutRepository,
    @inject(TYPES.WorkoutAgentProvider) private readonly workoutAgentProvider: WorkoutAgentProvider,
    @inject(EnrichWorkoutWithVideosUseCase) private readonly enrichUseCase: EnrichWorkoutWithVideosUseCase,
  ) {}

  async execute(input: GenerateWorkoutDto): Promise<WorkoutResponseDto> {
    const gymProfile = await this.gymProfileRepository.findByUserId(input.userId);

    if (!gymProfile) {
      const error = new Error(`GymProfile not found for userId: ${input.userId}`);
      (error as any).statusCode = 404;
      throw error;
    }

    const existingWorkouts = await this.workoutRepository.findByUserId(input.userId);
    if (existingWorkouts.length >= 2) {
      const error = new Error('Limite de 2 treinos por usuário atingido.');
      (error as any).statusCode = 403;
      throw error;
    }

    const generatedPlan = await this.workoutAgentProvider.generateWorkoutPlan(gymProfile);
    const parsedPlan = JSON.parse(generatedPlan);

    const enrichedPlan = await this.enrichUseCase.execute(parsedPlan);

    const workout = Workout.create({
      id: randomUUID(),
      name: enrichedPlan.name ?? "Workout Plan",
      userId: input.userId,
      status: "completed",
      aiOutput: enrichedPlan,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.workoutRepository.create(workout);
    return WorkoutResponseMapper.toResponse(saved);
  }
}
