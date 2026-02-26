import { Container } from "inversify";
import { getPrismaClient } from "../persistence/prisma/prisma.client";
import { configureMapper } from "./mappers";
import { configureControllers } from "./controllers";
import { configureUseCases } from "./useCases";
import { configureRepositories } from "./repositories";
import { TYPES } from "../../application/dto/types";
import { LangchainWorkoutAgentProvider } from "../providers/LangchainProvider";
import type { WorkoutAgentProvider } from "../../application/provider/WorkoutAgentProvider";
import { YoutubeVideoProvider } from "../providers/YoutubeVideoProvider";
import type { IVideoSearchProvider } from "../../application/provider/VideoSearchProvider";
import { LangchainExerciseTranslatorProvider } from "../providers/LangchainExerciseTranslatorProvider";
import type { ExerciseTranslatorProvider } from "../../application/provider/ExerciseTranslatorProvider";

export const container = new Container();

const prismaClient = getPrismaClient();
container.bind('PrismaClient').toConstantValue(prismaClient);

configureMapper(container);
configureControllers(container);
configureUseCases(container);
configureRepositories(container);

container.bind<WorkoutAgentProvider>(TYPES.WorkoutAgentProvider).to(LangchainWorkoutAgentProvider);
container.bind<IVideoSearchProvider>(TYPES.VideoSearchProvider).to(YoutubeVideoProvider);
container.bind<ExerciseTranslatorProvider>(TYPES.ExerciseTranslatorProvider).to(LangchainExerciseTranslatorProvider);
