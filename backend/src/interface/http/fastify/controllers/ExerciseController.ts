import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable, inject } from 'inversify';
import type { SearchExerciseQuery } from '../../../../application/dto/input/SearchExerciseInput';
import { SearchExerciseUseCase } from '../../../../application/use-case/SearchExerciseUseCase';
import { GetExerciseByIdUseCase } from '../../../../application/use-case/GetExerciseByIdUseCase';

@injectable()
export class ExerciseController {
  constructor(
    @inject(SearchExerciseUseCase) private readonly searchExerciseUseCase: SearchExerciseUseCase,
    @inject(GetExerciseByIdUseCase) private readonly getExerciseByIdUseCase: GetExerciseByIdUseCase,
  ) {}

  async searchByName(
    request: FastifyRequest<{ Querystring: SearchExerciseQuery }>,
    reply: FastifyReply,
  ) {
    const result = await this.searchExerciseUseCase.execute(request.query.q);
    return reply.send(result);
  }

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const exercise = await this.getExerciseByIdUseCase.execute(request.params.id);
    return reply.send(exercise);
  }
}
