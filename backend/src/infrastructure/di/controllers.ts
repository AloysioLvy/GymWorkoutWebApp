import { Container } from "inversify";
import { UserController } from "../../interface/http/fastify/controllers/UserController";
import { GymProfileController } from "../../interface/http/fastify/controllers/GymProfileController";
import { ExerciseController } from "../../interface/http/fastify/controllers/ExerciseController";

export function configureControllers(container: Container){
    container.bind(UserController).toSelf();
    container.bind(GymProfileController).toSelf();
    container.bind(ExerciseController).toSelf();
}