import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { updateGymProfileSchema } from "../../../../application/dto/input/UpdateGymProfile";
import { GymProfileController } from "../controllers/GymProfileController";
import { z } from "zod";

export function gymProfileRoutes(controller: GymProfileController) {
  return async function (app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/', {
      schema: { body: updateGymProfileSchema },
    }, controller.updateGymProfile.bind(controller));

    app.withTypeProvider<ZodTypeProvider>().get('/:userId', {
      schema: { params: z.object({ userId: z.string().min(1) }) },
    }, controller.getByUserId.bind(controller));
  };
}
