import { z } from 'zod';

export const searchExerciseParamsSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
});

export type SearchExerciseParams = z.infer<typeof searchExerciseParamsSchema>;
