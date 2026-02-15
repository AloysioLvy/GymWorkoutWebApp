import { z } from 'zod';

export const updateGymProfileSchema = z.object({
 userId: z.string().min(2),
 answers: z.unknown(),
});

export type UpdateGymProfileDto = z.infer<typeof updateGymProfileSchema>;