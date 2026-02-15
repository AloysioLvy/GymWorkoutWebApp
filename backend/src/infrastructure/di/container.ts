import { Container } from "inversify";
import { getPrismaClient } from "../persistence/prisma/prisma.client";
import { configureMapper } from "./mappers";
import { configureControllers } from "./controllers";
import { configureUseCases } from "./useCases";
import { configureRepositories } from "./repositories";

export const container = new Container();

const prismaClient = getPrismaClient();
container.bind('PrismaClient').toConstantValue(prismaClient);

configureMapper(container);
configureControllers(container);
configureUseCases(container);
configureRepositories(container);
