import { Container } from "inversify";
import { UserPrismaRepository } from "../persistence/prisma/repositories/UserPrismaReposity";
import { UserRepository } from "../../domain/repository/UserRepository";
import { TYPES } from "../../application/dto/types";
import { GymProfileRepository } from "../../domain/repository/GymProfileRepository";
import { GymProfilePrismaRepository } from "../persistence/prisma/repositories/GymProfilePrismaRepository";
import { ExerciseRepository } from "../../domain/repository/ExerciseRepository";
import { ExercisePrismaRepository } from "../persistence/prisma/repositories/ExercisePrismaRepository";

export function configureRepositories(container: Container) {
    container.bind<UserRepository>(TYPES.UserRepository).to(UserPrismaRepository);
    container.bind<GymProfileRepository>(TYPES.GymProfileRepository).to(GymProfilePrismaRepository);
    container.bind<ExerciseRepository>(TYPES.ExerciseRepository).to(ExercisePrismaRepository);
}