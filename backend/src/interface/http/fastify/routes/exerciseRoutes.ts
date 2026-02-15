import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createUserSchema } from '../../../../application/dto/input/CreateUserInput';
import type { UserController } from '../controllers/UserController';

export function userRoutes(controller: UserController) {
  return async function (app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/', {
      schema: { body: createUserSchema },
    }, controller.createUser.bind(controller));
  };
}
