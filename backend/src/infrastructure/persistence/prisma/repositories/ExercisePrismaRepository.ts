import { PrismaClient } from "@prisma/client/extension";
import { injectable, inject } from "inversify";
import { ExerciseRepository } from "../../../../domain/repository/ExerciseRepository";
import { Exercise } from "../../../../domain/aggregates/Exercise";
import { ExercisePersistenceMapper } from "../mappers/ExercisePersistenceMapper";

@injectable()
export class ExercisePrismaRepository implements ExerciseRepository {
  constructor(
    @inject('PrismaClient') private readonly prisma: PrismaClient,
    @inject(ExercisePersistenceMapper) private mapper: ExercisePersistenceMapper
  ) {}

  public async findByName(name: string): Promise<Exercise[]> {
    const exercises = await this.prisma.exercise.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    return exercises.map((e: any) => this.mapper.toDomain(e));
  }

  public async findById(id: string): Promise<Exercise | null> {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      return null;
    }

    return this.mapper.toDomain(exercise);
  }

  public async create(exercise: Exercise): Promise<Exercise> {
    const dbExercise = await this.prisma.exercise.create({
      data: {
        id: exercise.id,
        name: exercise.name,
        gifUrl: exercise.gifUrl,
        targetMuscles: exercise.targetMuscles,
        bodyParts: exercise.bodyParts,
        secondaryMuscles: exercise.secondaryMuscles,
        instructions: exercise.instructions,
        cachedAt: exercise.cachedAt,
      },
    });

    return this.mapper.toDomain(dbExercise);
  }
}
