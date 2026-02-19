import { Container } from "inversify";
import { UserPrismaRepository } from "../persistence/prisma/repositories/UserPrismaReposity";
import { UserRepository } from "../../domain/repository/UserRepository";
import { TYPES } from "../../application/dto/types";
import { GymProfileRepository } from "../../domain/repository/GymProfileRepository";
import { GymProfilePrismaRepository } from "../persistence/prisma/repositories/GymProfilePrismaRepository";
import { ExerciseRepository } from "../../domain/repository/ExerciseRepository";
import { ExercisePrismaRepository } from "../persistence/prisma/repositories/ExercisePrismaRepository";
import { WorkoutRepository } from "../../domain/repository/WorkoutRepository";
import { WorkoutPrismaRepository } from "../persistence/prisma/repositories/WorkoutPrismaRepository";
import { IExerciseVideoCacheRepository } from "../../domain/repository/ExerciseVideoCacheRepository";
import { ExerciseVideoCachePrismaRepository } from "../persistence/prisma/repositories/ExerciseVideoCachePrismaRepository";

export function configureRepositories(container: Container) {
    container.bind<UserRepository>(TYPES.UserRepository).to(UserPrismaRepository);
    container.bind<GymProfileRepository>(TYPES.GymProfileRepository).to(GymProfilePrismaRepository);
    container.bind<ExerciseRepository>(TYPES.ExerciseRepository).to(ExercisePrismaRepository);
    container.bind<WorkoutRepository>(TYPES.WorkoutRepository).to(WorkoutPrismaRepository);
    container.bind<IExerciseVideoCacheRepository>(TYPES.ExerciseVideoCacheRepository).to(ExerciseVideoCachePrismaRepository);
}