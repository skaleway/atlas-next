import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { putReqBodyQuestionSchema, questionQuerySchema } from '@/schema';

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

// update a question by quiz id and question id
export async function PUT(
  req: NextRequest,
  { params }: { params: { quizId: string; questionId: string } },
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
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    if (findUser.usertype !== 'ADMIN' && findUser.usertype !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const validateParams = questionQuerySchema.safeParse(params);

    if (!validateParams.success) {
      return NextResponse.json(
        { message: validateParams.error.message },
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

    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { message: 'Provide correct body' },
        { status: 400 },
      );
    }

    const validateBody = putReqBodyQuestionSchema.safeParse(body);

    if (!validateBody.success) {
      return NextResponse.json(
        { message: validateBody.error.message },
        { status: 400 },
      );
    }

    const toUpdate: any = {};

    if (body.question && body.question !== question.question) {
      toUpdate.question = body.question;
    }

    if (body.options && body.options.length >= 4) {
      toUpdate.options = body.options;
    }

    if (
      body.answer &&
      body.answer !== question.answer &&
      body.options.includes(body.answer)
    ) {
      toUpdate.answer = body.answer;
    }

    if (body.ansDesc && body.ansDesc !== question.ansDesc) {
      toUpdate.ansDesc = body.ansDesc;
    }

    const updatedQuestion = await db.question.update({
      where: {
        id: params.questionId,
        quizId: params.quizId,
      },
      data: toUpdate,
    });

    if (!updatedQuestion) {
      return NextResponse.json(
        { message: 'Question not updated.' },
        { status: 500 },
      );
    }

    return NextResponse.json(updatedQuestion, { status: 201 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 },
    );
  }
}
