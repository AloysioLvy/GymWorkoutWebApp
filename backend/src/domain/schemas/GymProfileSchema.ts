import z from "zod";

export const GymProfileSchema = z.object({
    id: z.string(),
    userId: z.string(),
    answers: z.array(z.any()),
    updatedAt: z.date(),
});

export type GymProfile = z.infer<typeof GymProfileSchema>;