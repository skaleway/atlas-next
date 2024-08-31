import * as z from 'zod';
import { UserType, RoomRole } from '@prisma/client';

export const UserTypeSchema = z.object({
  type: z.enum([UserType.ADMIN, UserType.TEACHER, UserType.STUDENT], {
    required_error: 'You need to select a user type.',
  }),
});

export const classroomQuerySchema = z.object({
  roomMemberId: z.string().optional(),
  classroomId: z.string().nonempty('ID is required'),
});

export const querySchema = z.object({
  id: z.string().nonempty('ID is required'),
});

export const reqClassroomMembersBodySchema = z.object({
  userId: z.string().nonempty('User ID is required'),
  role: z.enum([RoomRole.ADMIN, RoomRole.MODERATORS, RoomRole.GUEST], {
    required_error: 'Role is required',
  }),
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
  usertype: z
    .enum([RoomRole.ADMIN, RoomRole.MODERATORS, RoomRole.GUEST])
    .optional(),
  profilePicture: z.string().optional(),
  classroomId: z.array(z.string()).optional(),
});
