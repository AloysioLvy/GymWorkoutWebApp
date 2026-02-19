import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable, inject } from 'inversify';
import { UpdateGymProfileUseCase } from '../../../../application/use-case/UpdateGymProfileUseCase';
import { UpdateGymProfileDto } from '../../../../application/dto/input/UpdateGymProfile';
import { GymProfileRepository } from '../../../../domain/repository/GymProfileRepository';
import { GymProfileResponseMapper } from '../../../../application/dto/output/GymProfileResponseDto';
import { TYPES } from '../../../../application/dto/types';

@injectable()
export class GymProfileController {
  constructor(
    @inject(UpdateGymProfileUseCase) private readonly updateGymProfileUseCase: UpdateGymProfileUseCase,
    @inject(TYPES.GymProfileRepository) private readonly gymProfileRepository: GymProfileRepository,
  ) {}

  async updateGymProfile(
    request: FastifyRequest<{ Body: UpdateGymProfileDto }>,
    reply: FastifyReply,
  ) {
    const response = await this.updateGymProfileUseCase.execute(request.body);
    return reply.send(response);
  }

  async getByUserId(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply,
  ) {
    const { userId } = request.params;
    const gymProfile = await this.gymProfileRepository.findByUserId(userId);
    if (!gymProfile) {
      return reply.status(404).send({ message: 'GymProfile not found' });
    }
    return reply.send(GymProfileResponseMapper.toResponse(gymProfile));
  }
}
