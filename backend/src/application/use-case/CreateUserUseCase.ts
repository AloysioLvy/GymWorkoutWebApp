import { User } from '../../domain/aggregates/User.js';
import { injectable, inject } from 'inversify';
import type { CreateUserDto } from '../dto/input/CreateUserInput.js';
import { UserResponseMapper, type UserResponseDto } from '../dto/output/UserResponseDto.js';
import { UserRepository } from '../../domain/repository/UserRepository.js';
import { TYPES } from '../dto/types.js';

@injectable()
export class CreateUserUseCase  {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async execute(input: CreateUserDto): Promise<UserResponseDto> {
    const userAlreadyExists = await this.userRepository.findByEmail(input.email);
    if (userAlreadyExists) {
      throw new Error('User with this email already exists');
    }

    const newUser = User.create({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone ?? '',
      id: crypto.randomUUID(),
    });

    await this.userRepository.create(newUser);
    return UserResponseMapper.toResponse(newUser);
  }
}
