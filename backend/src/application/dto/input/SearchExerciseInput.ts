import { z } from 'zod';

export const searchExerciseQuerySchema = z.object({
  q: z.string().min(1, 'Query is required'),
});

export type SearchExerciseQuery = z.infer<typeof searchExerciseQuerySchema>;
