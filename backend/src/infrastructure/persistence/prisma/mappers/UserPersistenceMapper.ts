import { User } from '../../../../domain/aggregates/User.js';

interface UserRecord {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
}

export class UserPersistenceMapper {
  // Banco → Domínio (usa FROM porque está reconstruindo)
  public toDomain(record: UserRecord): User {
    return User.from(
      {
        id: record.id,
        email: record.email,
        phone: record.phone ?? null,
        firstName: record.firstName,
        lastName: record.lastName,
      },// ID já existe
    );
  }

  // Domínio → Banco (retorna objeto simples para o Prisma)
  public toPrisma(user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || null, // Prisma geralmente usa null, não undefined
    };
  }
}