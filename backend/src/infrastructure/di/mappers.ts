import { Container } from "inversify";
import { UserPersistenceMapper } from "../persistence/prisma/mappers/UserPersistenceMapper";
import { GymProfilePersistenceMapper } from "../persistence/prisma/mappers/GymProfilePersistenceMapper";
import { ExercisePersistenceMapper } from "../persistence/prisma/mappers/ExercisePersistenceMapper";
import { WorkoutPersistenceMapper } from "../persistence/prisma/mappers/WorkoutPersistenceMapper";

export function configureMapper(container: Container){
    container.bind(UserPersistenceMapper).toSelf();
    container.bind(GymProfilePersistenceMapper).toSelf();
    container.bind(ExercisePersistenceMapper).toSelf();
    container.bind(WorkoutPersistenceMapper).toSelf();
}