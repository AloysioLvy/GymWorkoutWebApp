import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable, inject } from 'inversify';
import type { CreateUserDto } from '../../../../application/dto/input/CreateUserInput';
import { CreateUserUseCase } from '../../../../application/use-case/CreateUserUseCase';
import { UpdateGymProfileUseCase } from '../../../../application/use-case/UpdateGymProfileUseCase';
import { UpdateGymProfileDto } from '../../../../application/dto/input/UpdateGymProfile';
import { POST } from 'fastify-decorators';

@injectable()
export class GymProfileController  {
  constructor(@inject(UpdateGymProfileUseCase) private readonly updateGymProfileUseCase: UpdateGymProfileUseCase) {}

  @POST('/')
  async updateGymProfile(
    request: FastifyRequest<{ Body: UpdateGymProfileDto }>,
    reply: FastifyReply,
  ) {
    const response = await this.updateGymProfileUseCase.execute(request.body);
    return reply.send(response);
  }
}
