import { Exercise } from '../../../../domain/aggregates/Exercise';
import { injectable } from 'inversify';

interface ExerciseRecord {
  id: string;
  name: string;
  gifUrl: string | null;
  targetMuscles: string | null;
  bodyParts: string | null;
  secondaryMuscles: string | null;
  instructions: string | null;
  cachedAt: Date | null;
}

@injectable()
export class ExercisePersistenceMapper {
  public toDomain(record: ExerciseRecord): Exercise {
    return Exercise.from({
      id: record.id,
      name: record.name,
      gifUrl: record.gifUrl,
      targetMuscles: record.targetMuscles,
      bodyParts: record.bodyParts,
      secondaryMuscles: record.secondaryMuscles,
      instructions: record.instructions,
      cachedAt: record.cachedAt,
    });
  }
}
