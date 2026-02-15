import { Container } from "inversify";
import { UserController } from "../../interface/http/fastify/controllers/UserController";

export function configureControllers(container: Container){
    container.bind(UserController).toSelf();
}