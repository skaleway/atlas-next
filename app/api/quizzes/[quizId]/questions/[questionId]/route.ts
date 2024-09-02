import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { questionQuerySchema } from '@/schema';

// get a question by quiz id
export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string; questionId: string } },
) {
  try {
    const validateParams = questionQuerySchema.safeParse(params);

    if (!validateParams.success) {
      return NextResponse.json(
        { message: 'Provide correct params' },
        { status: 400 },
      );
    }

    const question = await db.question.findFirst({
      where: {
        id: params.questionId,
        quizId: params.quizId,
      },
    });

    if (!question) {
      return NextResponse.json(
        { message: 'Question not found.' },
        { status: 404 },
      );
    }
    return NextResponse.json(question, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 },
    );
  }
}
