import { injectable } from "inversify";
import { IVideoSearchProvider, VideoResult } from "../../application/provider/VideoSearchProvider";
import { QuotaExceededError } from "../../shared/errors/QuotaExceededError";

interface YoutubeSearchItem {
  id: { videoId: string };
  snippet: { title: string };
}

interface YoutubeSearchResponse {
  error?: { code: number; message: string };
  items?: YoutubeSearchItem[];
}

@injectable()
export class YoutubeVideoProvider implements IVideoSearchProvider {
  private readonly apiKey: string;
  private readonly baseUrl = "https://www.googleapis.com/youtube/v3/search";

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY ?? "";
  }

  async searchExerciseVideo(exerciseName: string): Promise<VideoResult | null> {
    if (!this.apiKey) return null;

    const params = new URLSearchParams({
      part: "snippet",
      q: `${exerciseName} exercise tutorial`,
      type: "video",
      maxResults: "1",
      relevanceLanguage: "pt",
      key: this.apiKey,
    });

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);
    const data: YoutubeSearchResponse = await response.json();

    if (data.error) {
      if (data.error.code === 403) {
        throw new QuotaExceededError("YouTube API quota exceeded");
      }
      return null;
    }

    const item = data.items?.[0];
    if (!item) return null;

    const videoId = item.id.videoId;
    return {
      videoId,
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  }
}
