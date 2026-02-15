import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable, inject } from 'inversify';
import type { SearchExerciseParams } from '../../../../application/dto/input/SearchExerciseInput';
import { SearchExerciseUseCase } from '../../../../application/use-case/SearchExerciseUseCase';

@injectable()
export class ExerciseController {
  constructor(@inject(SearchExerciseUseCase) private readonly searchExerciseUseCase: SearchExerciseUseCase) {}

  async searchByName(
    request: FastifyRequest<{ Params: SearchExerciseParams }>,
    reply: FastifyReply,
  ) {
    const exercises = await this.searchExerciseUseCase.execute(request.params.name);
    return reply.send(exercises);
  }
}
