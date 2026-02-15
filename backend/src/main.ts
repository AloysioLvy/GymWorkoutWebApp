import { container } from './infrastructure/di/container';
import { buildServer } from './interface/http/fastify/server';
import { UserController } from './interface/http/fastify/controllers/UserController';
import { GymProfileController } from './interface/http/fastify/controllers/GymProfileController';
import { ExerciseController } from './interface/http/fastify/controllers/ExerciseController';

async function main() {
  const userController = container.get(UserController);
  const gymProfileController = container.get(GymProfileController);
  const exerciseController = container.get(ExerciseController);

  const server = await buildServer(userController, gymProfileController, exerciseController);

  const port = Number(process.env.PORT) || 3001;

  await server.listen({ port, host: '0.0.0.0' });
  console.log(`Server running on http://localhost:${port}`);
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
