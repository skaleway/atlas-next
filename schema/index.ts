import * as z from 'zod';
import { UserType } from '@prisma/client';

export const UserTypeSchema = z.object({
  type: z.enum([UserType.ADMIN, UserType.TEACHER, UserType.STUDENT], {
    required_error: 'You need to select a user type.',
  }),
});

export const querySchema = z.object({
  id: z.string().nonempty('ID is required'),
});

export const reqRoomBodySchema = z.object({
  name: z.string().optional(),
  creatorId: z.string().optional(),
});

export const putUserRequestBodySchema = z.object({
  username: z.string().optional(),
  firstname: z.string().optional(),
  secondname: z.string().optional(),
  email: z.string().email().optional(),
  age: z.number().optional(),
  usertype: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional(),
  profilePicture: z.string().optional(),
  classroomId: z.array(z.string()).optional(),
});
