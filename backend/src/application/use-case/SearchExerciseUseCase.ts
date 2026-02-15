import { injectable, inject } from 'inversify';
import { ExerciseRepository } from '../../domain/repository/ExerciseRepository';
import { ExerciseResponseMapper, type ExerciseResponseDto } from '../dto/output/ExerciseResponseDto';
import { TYPES } from '../dto/types';

@injectable()
export class SearchExerciseUseCase {
  constructor(
    @inject(TYPES.ExerciseRepository) private readonly exerciseRepository: ExerciseRepository,
  ) {}

  async execute(name: string): Promise<ExerciseResponseDto[]> {
    const exercises = await this.exerciseRepository.findByName(name);
    return exercises.map(ExerciseResponseMapper.toResponse);
  }
}
