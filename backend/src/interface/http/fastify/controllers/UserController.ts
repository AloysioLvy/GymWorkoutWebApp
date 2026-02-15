import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable, inject } from 'inversify';
import type { CreateUserDto } from '../../../../application/dto/input/CreateUserInput';
import { CreateUserUseCase } from '../../../../application/use-case/CreateUserUseCase';

@injectable()
export class UserController  {
  constructor(@inject(CreateUserUseCase) private readonly createUserUseCase: CreateUserUseCase) {}

  async createUser(
    request: FastifyRequest<{ Body: CreateUserDto }>,
    reply: FastifyReply,
  ) {
    const response = await this.createUserUseCase.execute(request.body);
    return reply.send(response);
  }
}
