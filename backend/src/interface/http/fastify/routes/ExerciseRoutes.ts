import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { searchExerciseParamsSchema } from '../../../../application/dto/input/SearchExerciseInput';
import type { ExerciseController } from '../controllers/ExerciseController';

export function exerciseRoutes(controller: ExerciseController) {
  return async function (app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/:name', {
      schema: { params: searchExerciseParamsSchema },
    }, controller.searchByName.bind(controller));
  };
}
