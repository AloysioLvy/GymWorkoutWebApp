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

export async function buildServer(userController: UserController, gymProfileController: GymProfileController, exerciseController: ExerciseController) {
  const app = Fastify({ logger: true });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, { origin: true });

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

  app.register(userRoutes(userController), { prefix: '/users' });
  app.register(gymProfileRoutes(gymProfileController), { prefix: '/gym-profile' });
  app.register(exerciseRoutes(exerciseController), { prefix: '/exercises' });

  return app;
}
