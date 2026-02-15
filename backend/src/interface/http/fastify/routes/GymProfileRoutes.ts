import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { updateGymProfileSchema } from "../../../../application/dto/input/UpdateGymProfile";
import { GymProfileController } from "../controllers/GymProfileController";

export function gymProfileRoutes(controller: GymProfileController) {
  return async function (app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/', {
      schema: { body: updateGymProfileSchema    },
    }, controller.updateGymProfile.bind(controller));
  };
}
