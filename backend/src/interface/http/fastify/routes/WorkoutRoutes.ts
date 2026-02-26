import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { generateWorkoutSchema } from '../../../../application/dto/input/GenerateWorkoutInput';
import type { WorkoutController } from '../controllers/WorkoutController';

export function workoutRoutes(controller: WorkoutController) {
  return async function (app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/generate', {
      schema: { body: generateWorkoutSchema },
    }, controller.generateWorkout.bind(controller));

    app.withTypeProvider<ZodTypeProvider>().get('/user/:userId', {
      schema: { params: z.object({ userId: z.string().min(1) }) },
    }, controller.getByUser.bind(controller));

    app.withTypeProvider<ZodTypeProvider>().get('/shared/:token', {
      schema: { params: z.object({ token: z.string().min(1) }) },
    }, controller.getSharedWorkout.bind(controller));

    app.withTypeProvider<ZodTypeProvider>().get('/:id', {
      schema: { params: z.object({ id: z.string().min(1) }) },
    }, controller.getById.bind(controller));

    app.withTypeProvider<ZodTypeProvider>().post('/:id/share', {
      schema: { params: z.object({ id: z.string().min(1) }) },
    }, controller.shareWorkout.bind(controller));
  };
}
