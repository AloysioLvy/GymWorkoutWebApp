import { Container } from "inversify";
import { UserPersistenceMapper } from "../persistence/prisma/mappers/UserPersistenceMapper";
import { GymProfilePersistenceMapper } from "../persistence/prisma/mappers/GymProfilePersistenceMapper";
import { ExercisePersistenceMapper } from "../persistence/prisma/mappers/ExercisePersistenceMapper";

export function configureMapper(container: Container){
    container.bind(UserPersistenceMapper).toSelf();
    container.bind(GymProfilePersistenceMapper).toSelf();
    container.bind(ExercisePersistenceMapper).toSelf();
}