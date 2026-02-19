import { z } from 'zod';

export const generateWorkoutSchema = z.object({
  userId: z.string().min(1),
});

export type GenerateWorkoutDto = z.infer<typeof generateWorkoutSchema>;
