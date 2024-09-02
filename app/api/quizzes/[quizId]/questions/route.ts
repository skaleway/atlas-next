import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

// Get questions by quiz id
export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string } },
) {
  try {
    const questions = await db.question.findMany({
      where: {
        quizId: params.quizId,
      },
    });

    if (!questions) {
      return NextResponse.json(
        { message: 'Questions not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json(questions, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 },
    );
  }
}
