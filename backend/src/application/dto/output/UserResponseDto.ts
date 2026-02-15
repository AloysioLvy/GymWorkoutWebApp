import type { User } from '../../../domain/aggregates/User';

export type UserResponseDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
};

export class UserResponseMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    };
  }
}
