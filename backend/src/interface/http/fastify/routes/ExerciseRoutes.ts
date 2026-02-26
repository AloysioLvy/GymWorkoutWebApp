import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { searchExerciseQuerySchema } from '../../../../application/dto/input/SearchExerciseInput';
import type { ExerciseController } from '../controllers/ExerciseController';
import { z } from 'zod';

export function exerciseRoutes(controller: ExerciseController) {
  return async function (app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/search', {
      schema: { querystring: searchExerciseQuerySchema },
    }, controller.searchByName.bind(controller));

    app.withTypeProvider<ZodTypeProvider>().get('/:id', {
      schema: { params: z.object({ id: z.string() }) },
    }, controller.getById.bind(controller));
  };
}
