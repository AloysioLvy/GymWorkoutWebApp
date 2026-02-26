import { Workout } from '../../../../domain/aggregates/Workout.js';

interface WorkoutRecord {
  id: string;
  name: string;
  userId: string;
  status: string;
  aiOutput: unknown;
  createdAt: Date;
  updatedAt: Date;
  shareToken?: string | null;
}

export class WorkoutPersistenceMapper {
  public toDomain(record: WorkoutRecord): Workout {
    return Workout.from({
      id: record.id,
      name: record.name,
      userId: record.userId,
      status: record.status,
      aiOutput: record.aiOutput,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      shareToken: record.shareToken,
    });
  }

  public toPrisma(workout: Workout) {
    return {
      id: workout.id,
      name: workout.name,
      userId: workout.userId,
      status: workout.status,
      aiOutput: workout.aiOutput,
      shareToken: workout.shareToken,
    };
  }
}
