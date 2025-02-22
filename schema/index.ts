import * as z from 'zod';
import { UserType, RoomRole, Grade } from '@prisma/client';

// user type zod schema
export const UserTypeSchema = z.object({
  type: z.enum([UserType.ADMIN, UserType.TEACHER, UserType.STUDENT], {
    required_error: 'You need to select a user type.',
  }),
});

// classrooom params zod schema
export const RoomSchema = z.object({
  name: z.string().min(5, { message: 'Name too short' }),
  description: z.string().min(20, { message: 'Description too short' }),
});

export const addUserToRoomSchema = z.object({
  userId: z.string().min(5, { message: 'Id too short' }),
  roomId: z.string().min(5, { message: 'Id too short' }),
});

export const classroomQuerySchema = z.object({
  roomMemberId: z.string().optional(),
  classroomId: z.string().nonempty('ID is required'),
});

//create quiz schema
export const createQuizSchema = z.object({
  name: z.string().min(5, { message: 'Name too short' }),
  description: z.string().min(20, { message: 'Description too short' }),
});

export const createQuestionsSchema = z.object({
  question: z.string().min(10, { message: 'Question is too short' }),
  options: z
    .array(z.string())
    .min(4, { message: 'At least 4 options are required' }),
  answer: z.string().min(5, { message: 'Answer is too short' }),
});

// user params zod schema
export const querySchema = z.object({
  id: z.string().nonempty('ID is required'),
});

// class room member body request zod schema
export const reqClassroomMembersBodySchema = z.object({
  userId: z.string().nonempty('User ID is required'),
  role: z.enum([RoomRole.ADMIN, RoomRole.MODERATORS, RoomRole.GUEST], {
    required_error: 'Role is required',
  }),
});

// class room request body zod schema
export const reqRoomBodySchema = z.object({
  name: z.string().optional(),
  creatorId: z.string().optional(),
});

// update user request body zod schema
export const putUserRequestBodySchema = z.object({
  username: z.string().optional(),
  firstname: z.string().optional(),
  secondname: z.string().optional(),
  email: z.string().email().optional(),
  age: z.number().optional(),
  usertype: z
    .enum([UserType.ADMIN, UserType.TEACHER, UserType.STUDENT], {
      required_error: 'User type is required',
    })
    .optional(),
  profilePicture: z.string().optional(),
  classroomId: z.array(z.string()).optional(),
});

// request body quiz zod schema
export const reqBodyQuizSchema = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string().nonempty('Description is required'),
  topicId: z.string().nonempty('Topic ID is required'),
  questions: z
    .object(
      {
        question: z.string().nonempty('Question is required'),
        options: z.array(z.string()).nonempty('Options are required'),
        answer: z.string().nonempty('Answer is required'),
        ansDesc: z.string().optional(),
      },
      { required_error: 'Questions are required' },
    )
    .required(),
});

// question request body zod schema
export const reqBodyQuestionSchema = z.object({
  question: z.string().nonempty('Question required.'),
  options: z.array(z.string()).nonempty('Question options are required'),
  answer: z.string().nonempty('Question Correct answer required'),
  ansDesc: z.string().optional(),
});

// question params zod schema
export const questionQuerySchema = z.object({
  quizId: z.string().nonempty('Quiz Id must be provided in params.'),
  questionId: z.string().nonempty('Question Id must be provided.'),
});

// question put request body zod schema
export const putReqBodyQuestionSchema = z.object({
  question: z.string().optional(),
  options: z.array(z.string()).optional(),
  answer: z.string().optional(),
  ansDesc: z.string().optional(),
});

// topic post request body zod schema
export const reqBodyTopicSchema = z.object({
  name: z.string().nonempty('Topic name is required'),
  description: z.string().optional(),
});

// topic put request body zod schema
export const putReqBodyTopicSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

// post request quiz attempt schema
export const reqBodyQuizAttemptSchema = z.object({
  score: z.number().int().nonnegative('Score must be a positive integer'),
  grade: z.enum(
    [Grade.A, Grade.B, Grade.C, Grade.D, Grade.E, Grade.F, Grade.U],
    {
      required_error: 'Grade is required',
    },
  ),
  studentId: z.string().nonempty('Student ID is required'),
  duration: z.number().int().nonnegative('Duration must be a positive integer'),
  attemptQuestion: z.array(
    z.object({
      questionId: z.string().nonempty('Question ID is required'),
      answer: z.string().nonempty('Proposed answer is required'),
      correct: z.boolean(),
    }),
  ),
});
