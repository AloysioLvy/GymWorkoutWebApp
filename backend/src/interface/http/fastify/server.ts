import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { userRoutes } from './routes/exerciseRoutes.js';
import { UserController } from './controllers/UserController';

export async function buildServer(userController: UserController) {
  const app = Fastify({ logger: true });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, { origin: true });

  app.register(userRoutes(userController), { prefix: '/users' });

  return app;
}
