import { z } from 'zod';

export const createUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().min(2),
  firstName: z.string().min(2, 'First name must be at least 2 characters long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters long').optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;