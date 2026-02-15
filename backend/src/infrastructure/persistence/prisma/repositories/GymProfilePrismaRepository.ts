import { PrismaClient } from "@prisma/client/extension";
import { injectable, inject } from "inversify";
import { UserRepository } from "../../../../domain/repository/UserRepository";
import { User } from "../../../../domain/aggregates/User";
import { UserPersistenceMapper } from "../mappers/UserPersistenceMapper";
import { GymProfileRepository } from "../../../../domain/repository/GymProfileRepository";
import { GymProfilePersistenceMapper } from "../mappers/GymProfilePersistenceMapper";
import { GymProfile } from "../../../../domain/aggregates/GymProfile";

@injectable()
export class GymProfilePrismaRepository implements GymProfileRepository {
  constructor(
    @inject('PrismaClient') private readonly prisma: PrismaClient,
    @inject(GymProfilePersistenceMapper) private mapper: GymProfilePersistenceMapper
  ) {}

  public async create(gymProfile: GymProfile): Promise<GymProfile>{
    console.log('Creating gym profile in database:', gymProfile);
    const dbGymProfile = await this.prisma.gymProfile.create({
      data: {
        id: gymProfile.id,
        userId: gymProfile.userId,
        answers: gymProfile.answers,
        updatedAt: gymProfile.updatedAt,
      },
    });

    return this.mapper.toDomain(dbGymProfile);
  
  }

  public async findByUserId(userId: string): Promise<GymProfile | null> {
    const gymProfile = await this.prisma.gymProfile.findUnique({
      where: { userId },
    });

    if (!gymProfile) {
      return null;
    }
    
    return this.mapper.toDomain(gymProfile);
  }

  public async findById(id: string): Promise<GymProfile | null> {
    const gymProfile = await this.prisma.gymProfile.findUnique({
      where: { id },
    });

    if (!gymProfile) {
      return null;
    }
    
    return this.mapper.toDomain(gymProfile);
  }

  public async update(gymProfile: GymProfile): Promise<GymProfile> {
        console.log('Creating gym profile in database:', gymProfile);

    const updatedGymProfile = await this.prisma.gymProfile.update({
      where: { id: gymProfile.id },
      data: {
        answers: gymProfile.answers,
        updatedAt: gymProfile.updatedAt,
      },
    });

    return this.mapper.toDomain(updatedGymProfile);
  }
}

