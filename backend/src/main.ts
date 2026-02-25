import { container } from './infrastructure/di/container';
import { buildServer } from './interface/http/fastify/server';
import { UserController } from './interface/http/fastify/controllers/UserController';
import { GymProfileController } from './interface/http/fastify/controllers/GymProfileController';
import { ExerciseController } from './interface/http/fastify/controllers/ExerciseController';
import { WorkoutController } from './interface/http/fastify/controllers/WorkoutController';
import { startWorkoutWorker } from './infrastructure/queue/WorkoutJobProcessor';

async function main() {
  const userController = container.get(UserController);
  const gymProfileController = container.get(GymProfileController);
  const exerciseController = container.get(ExerciseController);
  const workoutController = container.get(WorkoutController);

  const server = await buildServer(userController, gymProfileController, exerciseController, workoutController);

  const worker = startWorkoutWorker();
  console.log('[WorkoutWorker] Started');

  const port = Number(process.env.PORT) || 3001;

  await server.listen({ port, host: '0.0.0.0' });
  console.log(`Server running on http://localhost:${port}`);

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down...');
    await worker.close();
    await server.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
