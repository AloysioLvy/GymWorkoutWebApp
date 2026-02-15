import { unknown, z } from 'zod';

export const createGymProfieSchema = z.object({
 userId: z.string().min(2),
 anserws: z.array(z.object({
 })).min(1, 'At least one answer is required'),
});

export type CreateGymProfileDto = z.infer<typeof createGymProfieSchema>;