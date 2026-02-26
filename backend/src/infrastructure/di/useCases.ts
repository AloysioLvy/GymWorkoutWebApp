import { Container } from "inversify";
import { CreateUserUseCase } from "../../application/use-case/CreateUserUseCase";
import { UpdateGymProfileUseCase } from "../../application/use-case/UpdateGymProfileUseCase";
import { SearchExerciseUseCase } from "../../application/use-case/SearchExerciseUseCase";
import { GenerateWorkoutUseCase } from "../../application/use-case/GenerateWorkoutUseCase";
import { GetWorkoutsByUserIdUseCase } from "../../application/use-case/GetWorkoutsByUserIdUseCase";
import { GetWorkoutByIdUseCase } from "../../application/use-case/GetWorkoutByIdUseCase";
import { EnrichWorkoutWithVideosUseCase } from "../../application/use-case/EnrichWorkoutWithVideosUseCase";
import { ShareWorkoutUseCase } from "../../application/use-case/ShareWorkoutUseCase";
import { GetSharedWorkoutUseCase } from "../../application/use-case/GetSharedWorkoutUseCase";

export function configureUseCases(container: Container){
    container.bind(CreateUserUseCase).toSelf();
    container.bind(UpdateGymProfileUseCase).toSelf();
    container.bind(SearchExerciseUseCase).toSelf();
    container.bind(EnrichWorkoutWithVideosUseCase).toSelf();
    container.bind(GenerateWorkoutUseCase).toSelf();
    container.bind(GetWorkoutsByUserIdUseCase).toSelf();
    container.bind(GetWorkoutByIdUseCase).toSelf();
    container.bind(ShareWorkoutUseCase).toSelf();
    container.bind(GetSharedWorkoutUseCase).toSelf();
}