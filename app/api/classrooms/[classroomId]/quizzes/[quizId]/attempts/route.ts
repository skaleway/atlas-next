import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { reqBodyQuizAttemptSchema } from '@/schema';

// get a classroom quiz attempts
export async function GET(
  req: NextRequest,
  { params }: { params: { classroomId: string; quizId: string } },
) {
  try {
    if (!params.classroomId || !params.quizId) {
      return NextResponse.json(
        {
          message: 'Classroom ID and Quiz ID are required',
        },
        { status: 400 },
      );
    }

    const findQuiz = await db.quiz.findFirst({
      where: {
        id: params.quizId,
        roomId: params.classroomId,
      },
    });

    if (!findQuiz) {
      return NextResponse.json(
        { message: 'Quiz not found, verify params.' },
        { status: 404 },
      );
    }

    const findAttempts = await db.attempt.findMany({
      where: {
        quizId: params.quizId,
      },
      include: {
        quiz: true,
        AttemptQuestion: true,
      },
    });

    if (!findAttempts) {
      return NextResponse.json(
        { message: 'Quiz Attempts not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json(findAttempts, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// create a quiz attempt
export async function POST(
  req: NextRequest,
  { params }: { params: { classroomId: string; quizId: string } },
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const findUser = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!findUser) {
      return NextResponse.json(
        { message: 'Unauthorized User, Not found in DB' },
        { status: 401 },
      );
    }

    if (
      findUser.usertype !== 'STUDENT' ||
      !(await db.roomMember.findFirst({
        where: {
          userId: findUser.id,
        },
      }))
    ) {
      return NextResponse.json(
        {
          message:
            'Only students of a particular class are allowed to take quizzes',
        },
        { status: 401 },
      );
    }

    if (!params.classroomId || !params.quizId) {
      return NextResponse.json(
        {
          message: 'Classroom ID and Quiz ID are required',
        },
        { status: 400 },
      );
    }

    const findQuiz = await db.quiz.findFirst({
      where: {
        id: params.quizId,
        roomId: params.classroomId,
      },
    });

    if (!findQuiz) {
      return NextResponse.json(
        { message: 'Quiz not found, verify params.' },
        { status: 404 },
      );
    }

    const body = await req.json();

    if (!body) {
      return NextResponse.json({ message: 'Request body is required' });
    }

    const validateBody = reqBodyQuizAttemptSchema.safeParse(body);

    if (!validateBody.success) {
      return NextResponse.json(
        {
          message: JSON.stringify(validateBody.error.errors),
        },
        { status: 400 },
      );
    }

    const data = validateBody.data;

    if (data.studentId !== findUser.id) {
      return NextResponse.json({
        message:
          'Only currenly logged in students are supposed to take an exam.',
      });
    }

    const createAttempt = await db.attempt.create({
      data: {
        score: data.score,
        grade: data.grade,
        quizId: params.quizId,
        studentId: data.studentId,
        duration: data.duration,
      },
    });

    if (!createAttempt) {
      return NextResponse.json(
        { message: 'failed to create Attempt' },
        { status: 500 },
      );
    }

    const attemptQuestions = data.attemptQuestion;

    const createQuestionAttempt = await db.attemptQuestion.createMany({
      data: attemptQuestions.map((element) => ({
        ...element,
        attemptId: createAttempt.id!,
      })),
    });

    if (!createQuestionAttempt) {
      return NextResponse.json(
        { message: 'Failed to create list of questions attempted' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: 'Quiz attempt created successfully',
        data: { createAttempt, createQuestionAttempt },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
