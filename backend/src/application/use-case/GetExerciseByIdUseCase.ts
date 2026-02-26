import { injectable, inject } from 'inversify';
import { ExerciseRepository } from '../../domain/repository/ExerciseRepository';
import { ExerciseResponseMapper, type ExerciseResponseDto } from '../dto/output/ExerciseResponseDto';
import { TYPES } from '../dto/types';

@injectable()
export class GetExerciseByIdUseCase {
  constructor(
    @inject(TYPES.ExerciseRepository) private readonly exerciseRepository: ExerciseRepository,
  ) {}

  async execute(id: string): Promise<ExerciseResponseDto> {
    const exercise = await this.exerciseRepository.findById(id);
    if (!exercise) {
      const error = new Error('Exercise not found');
      (error as any).statusCode = 404;
      throw error;
    }
    return ExerciseResponseMapper.toResponse(exercise);
  }
}
