export interface VideoResult {
  videoId: string;
  title: string;
  url: string;
}

export interface IVideoSearchProvider {
  searchExerciseVideo(exerciseName: string): Promise<VideoResult | null>;
}
