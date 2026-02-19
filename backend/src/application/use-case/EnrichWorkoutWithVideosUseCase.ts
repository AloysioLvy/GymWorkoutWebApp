import { inject, injectable } from "inversify";
import { TYPES } from "../dto/types";
import { IVideoSearchProvider } from "../provider/VideoSearchProvider";
import { IExerciseVideoCacheRepository } from "../../domain/repository/ExerciseVideoCacheRepository";
import { normalizeExerciseName } from "../../shared/utils/normalizeExerciseName";

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: WorkoutExerciseItem[];
}

export interface WorkoutExerciseItem {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  videoUrl?: string | null;
}

export interface WorkoutPlanInput {
  name: string;
  days: WorkoutDay[];
}

const CACHE_TTL_DAYS = 30;

@injectable()
export class EnrichWorkoutWithVideosUseCase {
  constructor(
    @inject(TYPES.VideoSearchProvider) private readonly videoProvider: IVideoSearchProvider,
    @inject(TYPES.ExerciseVideoCacheRepository) private readonly cacheRepo: IExerciseVideoCacheRepository,
  ) {}

  async execute(plan: WorkoutPlanInput): Promise<WorkoutPlanInput> {
    const allExercises: WorkoutExerciseItem[] = plan.days.flatMap((d) => d.exercises);

    await Promise.allSettled(
      allExercises.map((ex) => this.enrichExercise(ex)),
    );

    return plan;
  }

  private async enrichExercise(exercise: WorkoutExerciseItem): Promise<void> {
    const key = normalizeExerciseName(exercise.name);

    const cached = await this.cacheRepo.findByNormalizedName(key);
    if (cached && cached.expiresAt > new Date()) {
      exercise.videoUrl = cached.videoUrl;
      return;
    }

    const result = await this.videoProvider.searchExerciseVideo(exercise.name);
    if (!result) {
      exercise.videoUrl = null;
      return;
    }

    exercise.videoUrl = result.url;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + CACHE_TTL_DAYS);

    await this.cacheRepo.save({
      normalizedName: key,
      videoId: result.videoId,
      videoTitle: result.title,
      videoUrl: result.url,
      expiresAt,
    });
  }
}
