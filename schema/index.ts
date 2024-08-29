import * as z from 'zod';
import { UserType } from '@prisma/client';

export const UserTypeSchema = z.object({
  type: z.enum([UserType.ADMIN, UserType.TEACHER, UserType.STUDENT], {
    required_error: 'You need to select a user type.',
  }),
});

export const querySchema = z.object({
  id: z.string().nonempty('Classroom ID is required'),
});

export const reqRoomBodySchema = z.object({
  name: z.string().optional(),
  creatorId: z.string().optional(),
});
