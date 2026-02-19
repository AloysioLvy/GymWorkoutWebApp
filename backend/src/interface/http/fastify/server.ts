import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import { userRoutes } from './routes/UserRoutes.js';
import { UserController } from './controllers/UserController';
import { gymProfileRoutes } from './routes/GymProfileRoutes.js';
import { GymProfileController } from './controllers/GymProfileController.js';
import { exerciseRoutes } from './routes/ExerciseRoutes.js';
import { ExerciseController } from './controllers/ExerciseController.js';
import { workoutRoutes } from './routes/WorkoutRoutes.js';
import { WorkoutController } from './controllers/WorkoutController.js';
import { QuotaExceededError } from '../../../shared/errors/QuotaExceededError';

export async function buildServer(userController: UserController, gymProfileController: GymProfileController, exerciseController: ExerciseController, workoutController: WorkoutController) {
  const app = Fastify({ logger: true });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  const allowedOrigin = process.env.ALLOWED_ORIGIN ?? 'http://localhost:3000';
  await app.register(cors, {
    origin: allowedOrigin,
    credentials: true,
  });

  // Bloqueia requisições que não vêm do BFF interno
  const internalSecret = process.env.INTERNAL_API_SECRET;
  app.addHook('onRequest', async (request, reply) => {
    // Rotas públicas: docs e busca de exercícios
    if (request.url.startsWith('/docs') || request.url.startsWith('/exercises')) return;
    // Em dev sem secret configurado, permite passar
    if (!internalSecret) return;
    if (request.headers['x-internal-secret'] !== internalSecret) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Gym Workout API',
        description: 'API for managing users and gym profiles',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  app.setErrorHandler((error: Error & { statusCode?: number }, _request, reply) => {
    if (error instanceof QuotaExceededError) {
      return reply.status(429).send({ error: error.message });
    }
    const statusCode = error.statusCode ?? 500;
    return reply.status(statusCode).send({ error: error.message });
  });

  app.register(userRoutes(userController), { prefix: '/users' });
  app.register(gymProfileRoutes(gymProfileController), { prefix: '/gym-profile' });
  app.register(exerciseRoutes(exerciseController), { prefix: '/exercises' });
  app.register(workoutRoutes(workoutController), { prefix: '/workout' });

  return app;
}
