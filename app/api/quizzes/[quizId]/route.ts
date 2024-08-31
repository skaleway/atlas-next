import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string } },
) {
  try {
    const quiz = await db.quiz.findUnique({
      where: {
        id: params.quizId,
      },
    });

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json({ data: quiz }, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
