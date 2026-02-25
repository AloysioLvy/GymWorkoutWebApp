import { Worker } from 'bullmq';
import { container } from '../di/container';
import { WORKOUT_QUEUE_NAME } from './WorkoutQueue';
import type { GenerateWorkoutJobData } from '../../application/dto/input/GenerateWorkoutJobData';
import { TYPES } from '../../application/dto/types';
import type { WorkoutRepository } from '../../domain/repository/WorkoutRepository';
import type { WorkoutAgentProvider } from '../../application/provider/WorkoutAgentProvider';
import type { GymProfileRepository } from '../../domain/repository/GymProfileRepository';
import { EnrichWorkoutWithVideosUseCase } from '../../application/use-case/EnrichWorkoutWithVideosUseCase';

export function startWorkoutWorker(): Worker {
  const worker = new Worker<GenerateWorkoutJobData>(
    WORKOUT_QUEUE_NAME,
    async (job) => {
      const { workoutId, userId } = job.data;

      const workoutRepo = container.get<WorkoutRepository>(TYPES.WorkoutRepository);
      const gymProfileRepo = container.get<GymProfileRepository>(TYPES.GymProfileRepository);
      const agentProvider = container.get<WorkoutAgentProvider>(TYPES.WorkoutAgentProvider);
      const enrichUseCase = container.get(EnrichWorkoutWithVideosUseCase);

      await workoutRepo.updateStatus(workoutId, 'processing');

      try {
        const gymProfile = await gymProfileRepo.findByUserId(userId);
        if (!gymProfile) {
          throw new Error(`GymProfile not found for userId: ${userId}`);
        }

        const generatedPlan = await agentProvider.generateWorkoutPlan(gymProfile);
        const parsedPlan = JSON.parse(generatedPlan);

        const enrichedPlan = await enrichUseCase.execute(parsedPlan);

        await workoutRepo.updateStatus(workoutId, 'completed', {
          aiOutput: enrichedPlan,
          name: enrichedPlan.name ?? 'Workout Plan',
        });
      } catch (err) {
        // Só marca como 'failed' na última tentativa; nas anteriores mantém
        // 'processing' para não confundir o usuário durante o backoff.
        const maxAttempts = job.opts.attempts ?? 1;
        const isLastAttempt = job.attemptsMade >= maxAttempts - 1;
        if (isLastAttempt) {
          await workoutRepo.updateStatus(workoutId, 'failed');
        }
        throw err;
      }
    },
    {
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
      concurrency: 2,
    },
  );

  worker.on('completed', (job) => {
    console.log(`[WorkoutWorker] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[WorkoutWorker] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
