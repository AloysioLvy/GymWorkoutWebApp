import { Container } from "inversify";
import { UserPrismaRepository } from "../persistence/prisma/repositories/UserPrismaReposity";
import { UserRepository } from "../../domain/repository/UserRepository";
import { TYPES } from "../../application/dto/types";


export function configureRepositories(container: Container) {

    container.bind<UserRepository>(TYPES.UserRepository).to(UserPrismaRepository)
}