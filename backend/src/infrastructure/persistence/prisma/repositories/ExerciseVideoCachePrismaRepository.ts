import { inject, injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { CachedVideo, IExerciseVideoCacheRepository } from "../../../../domain/repository/ExerciseVideoCacheRepository";

@injectable()
export class ExerciseVideoCachePrismaRepository implements IExerciseVideoCacheRepository {
  constructor(@inject("PrismaClient") private readonly prisma: PrismaClient) {}

  async findByNormalizedName(normalizedName: string): Promise<CachedVideo | null> {
    const record = await this.prisma.exerciseVideoCache.findUnique({
      where: { normalizedName },
    });

    if (!record) return null;

    return {
      normalizedName: record.normalizedName,
      videoId: record.videoId,
      videoTitle: record.videoTitle,
      videoUrl: record.videoUrl,
      expiresAt: record.expiresAt,
    };
  }

  async save(video: CachedVideo): Promise<void> {
    await this.prisma.exerciseVideoCache.upsert({
      where: { normalizedName: video.normalizedName },
      create: {
        normalizedName: video.normalizedName,
        videoId: video.videoId,
        videoTitle: video.videoTitle,
        videoUrl: video.videoUrl,
        expiresAt: video.expiresAt,
      },
      update: {
        videoId: video.videoId,
        videoTitle: video.videoTitle,
        videoUrl: video.videoUrl,
        expiresAt: video.expiresAt,
      },
    });
  }
}
