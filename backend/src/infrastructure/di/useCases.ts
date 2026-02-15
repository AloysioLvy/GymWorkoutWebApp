import { Container } from "inversify";
import { CreateUserUseCase } from "../../application/use-case/CreateUserUseCase";
import { UpdateGymProfileUseCase } from "../../application/use-case/UpdateGymProfileUseCase";
import { SearchExerciseUseCase } from "../../application/use-case/SearchExerciseUseCase";

export function configureUseCases(container: Container){
    container.bind(CreateUserUseCase).toSelf();
    container.bind(UpdateGymProfileUseCase).toSelf();
    container.bind(SearchExerciseUseCase).toSelf();
}