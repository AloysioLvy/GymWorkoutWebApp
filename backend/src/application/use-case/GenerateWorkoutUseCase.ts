import { inject, injectable } from "inversify";
import { randomUUID } from "crypto";
import { TYPES } from "../dto/types";
import { GymProfileRepository } from "../../domain/repository/GymProfileRepository";
import { WorkoutRepository } from "../../domain/repository/WorkoutRepository";
import { GenerateWorkoutDto } from "../dto/input/GenerateWorkoutInput";
import { Workout } from "../../domain/aggregates/Workout";
import { workoutQueue } from "../../infrastructure/queue/WorkoutQueue";

// Lock por processo: impede que requisições concorrentes do mesmo usuário
// ultrapassem o limite de 2 treinos. Para deploys multi-instância, substituir
// por um lock Redis (SETNX).
const inFlightUsers = new Set<string>();

@injectable()
export class GenerateWorkoutUseCase {
  constructor(
    @inject(TYPES.GymProfileRepository) private readonly gymProfileRepository: GymProfileRepository,
    @inject(TYPES.WorkoutRepository) private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute(input: GenerateWorkoutDto): Promise<{ workoutId: string; status: string }> {
    if (inFlightUsers.has(input.userId)) {
      const error = new Error('Já existe uma geração de treino em andamento para este usuário.');
      (error as any).statusCode = 409;
      throw error;
    }

    inFlightUsers.add(input.userId);
    try {
      return await this.#doExecute(input);
    } finally {
      inFlightUsers.delete(input.userId);
    }
  }

  async #doExecute(input: GenerateWorkoutDto): Promise<{ workoutId: string; status: string }> {
    const gymProfile = await this.gymProfileRepository.findByUserId(input.userId);

    if (!gymProfile) {
      const error = new Error(`GymProfile not found for userId: ${input.userId}`);
      (error as any).statusCode = 404;
      throw error;
    }

    const existingWorkouts = await this.workoutRepository.findByUserId(input.userId);
    if (existingWorkouts.length >= 5) {
      const error = new Error('Limite de 5 treinos por usuário atingido.');
      (error as any).statusCode = 403;
      throw error;
    }

    const workout = Workout.create({
      id: randomUUID(),
      name: 'Gerando...',
      userId: input.userId,
      status: 'pending',
      aiOutput: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.workoutRepository.create(workout);

    await workoutQueue.add('generate', { workoutId: saved.id, userId: input.userId });

    return { workoutId: saved.id, status: 'pending' };
  }
}
