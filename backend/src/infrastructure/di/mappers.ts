import { Container } from "inversify";
import { UserPersistenceMapper } from "../persistence/prisma/mappers/UserPersistenceMapper";

export function configureMapper(container: Container){
    container.bind(UserPersistenceMapper).toSelf();
}