import { Container } from "inversify";
import { CreateUserUseCase } from "../../application/use-case/CreateUserUseCase";

export function configureUseCases(container: Container){
    container.bind(CreateUserUseCase).toSelf();
}