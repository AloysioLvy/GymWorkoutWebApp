import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable, inject } from 'inversify';
import type { GenerateWorkoutDto } from '../../../../application/dto/input/GenerateWorkoutInput';
import { GenerateWorkoutUseCase } from '../../../../application/use-case/GenerateWorkoutUseCase';
import { GetWorkoutsByUserIdUseCase } from '../../../../application/use-case/GetWorkoutsByUserIdUseCase';
import { GetWorkoutByIdUseCase } from '../../../../application/use-case/GetWorkoutByIdUseCase';

@injectable()
export class WorkoutController {
  constructor(
    @inject(GenerateWorkoutUseCase) private readonly generateWorkoutUseCase: GenerateWorkoutUseCase,
    @inject(GetWorkoutsByUserIdUseCase) private readonly getWorkoutsByUserIdUseCase: GetWorkoutsByUserIdUseCase,
    @inject(GetWorkoutByIdUseCase) private readonly getWorkoutByIdUseCase: GetWorkoutByIdUseCase,
  ) {}

  async generateWorkout(
    request: FastifyRequest<{ Body: GenerateWorkoutDto }>,
    reply: FastifyReply,
  ) {
    const result = await this.generateWorkoutUseCase.execute(request.body);
    return reply.status(202).send(result);
  }

  async getByUser(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply,
  ) {
    const result = await this.getWorkoutsByUserIdUseCase.execute(request.params.userId);
    return reply.send(result);
  }

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const result = await this.getWorkoutByIdUseCase.execute(request.params.id);
    return reply.send(result);
  }
}
