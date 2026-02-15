import type { Exercise } from '../../../domain/aggregates/Exercise';

export type ExerciseResponseDto = {
  id: string;
  name: string;
  gifUrl: string | null;
  targetMuscles: string | null;
  bodyParts: string | null;
  secondaryMuscles: string | null;
  instructions: string | null;
};

export class ExerciseResponseMapper {
  static toResponse(exercise: Exercise): ExerciseResponseDto {
    return {
      id: exercise.id,
      name: exercise.name,
      gifUrl: exercise.gifUrl,
      targetMuscles: exercise.targetMuscles,
      bodyParts: exercise.bodyParts,
      secondaryMuscles: exercise.secondaryMuscles,
      instructions: exercise.instructions,
    };
  }
}
