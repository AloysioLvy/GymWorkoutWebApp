import { PrismaClient } from "@prisma/client/extension";
import { injectable, inject } from "inversify";
import { UserRepository } from "../../../../domain/repository/UserRepository";
import { User } from "../../../../domain/aggregates/User";
import { UserPersistenceMapper } from "../mappers/UserPersistenceMapper";

@injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(
    @inject('PrismaClient') private readonly prisma: PrismaClient,
    @inject(UserPersistenceMapper) private mapper: UserPersistenceMapper
  ) {}

  public async create(user: User): Promise<User>{

    const dbUser = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    });

    return this.mapper.toDomain(dbUser);
  
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }
    
    return this.mapper.toDomain(user);
  }

  public async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }
    
    return this.mapper.toDomain(user);
  }

  public async update(user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    });

    return this.mapper.toDomain(updatedUser);
  }
}

