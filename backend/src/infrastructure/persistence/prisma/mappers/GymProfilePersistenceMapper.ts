import { GymProfile } from '../../../../domain/aggregates/GymProfile.js';

interface GymProfileRecord {
  id: string;
  userId: string;
  answers: unknown;
  updatedAt: Date;
}

export class GymProfilePersistenceMapper {
  // Banco → Domínio (usa FROM porque está reconstruindo)
  public toDomain(record: GymProfileRecord): GymProfile {
    return GymProfile.from(
      {
        id: record.id,
        userId: record.userId,
        answers: record.answers,
        updatedAt: record.updatedAt,
      },
    );
  }

  // Domínio → Banco (retorna objeto simples para o Prisma)
  public toPrisma(gymProfile: GymProfile) {
    return {
      id: gymProfile.id,
      userId: gymProfile.userId,
      answers: gymProfile.answers,
      updatedAt: gymProfile.updatedAt,
    };
  }
}