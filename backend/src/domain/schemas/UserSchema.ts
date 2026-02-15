import z from "zod";

export const UseSchema = z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().optional(),
});

export type User = z.infer<typeof UseSchema>;