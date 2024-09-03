import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { reqBodyQuestionSchema } from '@/schema';

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

// Create question
export async function POST(
  req: NextRequest,
  { params }: { params: { quizId: string } },
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const findUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!findUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (findUser.usertype !== 'TEACHER' && findUser.usertype !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized to create question' },
        { status: 401 },
      );
    }

    if (!params.quizId) {
      return NextResponse.json(
        { message: 'Quiz ID required to create question' },
        { status: 400 },
      );
    }

    if (!(await db.quiz.findUnique({ where: { id: params.quizId } }))) {
      return NextResponse.json({ message: 'Quiz Not found.' }, { status: 404 });
    }

    const body = await req.json();

    const validateBody = reqBodyQuestionSchema.safeParse(body);

    if (!validateBody.success) {
      return NextResponse.json(
        { message: 'Wrong request body' },
        { status: 400 },
      );
    }

    const data = validateBody.data;

    if (data.options.length < 4) {
      return NextResponse.json(
        { message: 'Question options should be at least four.' },
        { status: 400 },
      );
    }

    if (!data.options.includes(data.answer)) {
      return NextResponse.json(
        { message: 'Correct answer should be amongst the proposed options.' },
        { status: 400 },
      );
    }

    const createQuestion = await db.question.create({
      data: {
        ...body,
        quizId: params.quizId,
      },
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
