import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { reqBodyQuizSchema } from '@/schema';

// Create quiz
export async function POST(
  req: NextRequest,
  { params }: { params: { classroomId: string } },
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!(await db.room.findUnique({ where: { id: params.classroomId } }))) {
      return NextResponse.json(
        { message: 'Classroom not found' },
        { status: 404 },
      );
    }

    const body = await req.json();

    const quizValidation = reqBodyQuizSchema.safeParse(body);

    if (!quizValidation.success) {
      return NextResponse.json(
        { message: quizValidation.error.errors[0].message },
        { status: 400 },
      );
    }

    if (!(await db.topic.findUnique({ where: { id: body.topicId } }))) {
      return NextResponse.json({ message: 'Topic not found' }, { status: 404 });
    }

    if (body.questions.options.length < 4) {
      return NextResponse.json(
        { message: 'At least four options are required' },
        { status: 400 },
      );
    }

    if (!body.questions.options.includes(body.questions.answer)) {
      return NextResponse.json(
        { message: 'Answer must be one of the options' },
        { status: 400 },
      );
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
        { message: 'Unauthorized to create quiz' },
        { status: 401 },
      );
    }

    const quiz = await db.quiz.create({
      data: {
        title: body.title,
        description: body.description,
        topicId: body.topicId,
        roomId: params.classroomId,
        questions: {
          create: body.questions,
        },
        createdBy: user.id,
      },
    });

    return NextResponse.json({ data: quiz }, { status: 201 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Get all quizzes
export async function GET(
  req: NextRequest,
  { params }: { params: { classroomId: string } },
) {
  try {
    if (!(await db.room.findUnique({ where: { id: params.classroomId } }))) {
      return NextResponse.json(
        { message: 'Classroom not found' },
        { status: 404 },
      );
    }

    const quizzes = await db.quiz.findMany({
      where: { roomId: params.classroomId },
    });

    if (!quizzes) {
      return NextResponse.json(
        { message: 'No quizzes found' },
        { status: 404 },
      );
    }

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
