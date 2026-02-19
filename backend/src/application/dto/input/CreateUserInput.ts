import { z } from 'zod';

export const createUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().min(2),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(10, 'Phone number must be at least 10 characters long').optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;