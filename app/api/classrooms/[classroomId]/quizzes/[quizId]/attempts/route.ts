import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

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
