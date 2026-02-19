export interface CachedVideo {
  normalizedName: string;
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  expiresAt: Date;
}

export interface IExerciseVideoCacheRepository {
  findByNormalizedName(normalizedName: string): Promise<CachedVideo | null>;
  save(video: CachedVideo): Promise<void>;
}
