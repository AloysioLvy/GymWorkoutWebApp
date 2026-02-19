import { PrismaClient } from "@prisma/client/extension";
import { injectable, inject } from "inversify";
import { WorkoutRepository } from "../../../../domain/repository/WorkoutRepository";
import { Workout } from "../../../../domain/aggregates/Workout";
import { WorkoutPersistenceMapper } from "../mappers/WorkoutPersistenceMapper";

@injectable()
export class WorkoutPrismaRepository implements WorkoutRepository {
  constructor(
    @inject('PrismaClient') private readonly prisma: PrismaClient,
    @inject(WorkoutPersistenceMapper) private mapper: WorkoutPersistenceMapper,
  ) {}

  public async create(workout: Workout): Promise<Workout> {
    const data = this.mapper.toPrisma(workout);
    const record = await this.prisma.workout.create({ data });
    return this.mapper.toDomain(record);
  }

  public async findByUserId(userId: string): Promise<Workout[]> {
    const records = await this.prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r: any) => this.mapper.toDomain(r));
  }

  public async findById(id: string): Promise<Workout | null> {
    const record = await this.prisma.workout.findUnique({ where: { id } });
    if (!record) return null;
    return this.mapper.toDomain(record);
  }
}
