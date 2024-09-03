import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Get quiz by id
export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string; classroomId: string } },
) {
  try {
    if (!(await db.room.findUnique({ where: { id: params.classroomId } }))) {
      return NextResponse.json(
        { message: 'Classroom not found' },
        { status: 404 },
      );
    }

    const quiz = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        roomId: params.classroomId,
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

// Delete quiz by id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { quizId: string; classroomId: string } },
) {
  try {
    if (!params.quizId || !params.classroomId) {
      return NextResponse.json(
        { message: 'Provide correct params' },
        { status: 400 },
      );
    }

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
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (findUser.usertype !== 'ADMIN' && findUser.usertype !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!(await db.room.findUnique({ where: { id: params.classroomId } }))) {
      return NextResponse.json(
        { message: 'Classroom not found' },
        { status: 404 },
      );
    }

    const quiz = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        roomId: params.classroomId,
      },
    });

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    await db.quiz.delete({
      where: {
        id: params.quizId,
        roomId: params.classroomId,
      },
    });

    return NextResponse.json({ message: 'Quiz deleted' }, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Update quiz by id
export async function PUT(
  req: NextRequest,
  { params }: { params: { quizId: string; classroomId: string } },
) {
  try {
    if (!params.quizId || !params.classroomId) {
      return NextResponse.json(
        { message: 'Provide correct params' },
        { status: 400 },
      );
    }

    if (!(await db.room.findUnique({ where: { id: params.classroomId } }))) {
      return NextResponse.json(
        { message: 'Classroom not found' },
        { status: 404 },
      );
    }

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
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (findUser.usertype !== 'ADMIN' && findUser.usertype !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const quiz = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        roomId: params.classroomId,
      },
    });

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    const body = await req.json();

    const toUpdate: { title?: string; description?: string } = {};

    if (!body) {
      return NextResponse.json(
        { message: 'Update body required.' },
        { status: 400 },
      );
    }

    if (body.title && body.title !== quiz.title) {
      toUpdate.title = body.title;
    }

    if (body.description && body.description !== quiz.description) {
      toUpdate.description = body.description;
    }

    await db.quiz.update({
      where: {
        id: params.quizId,
      },
      data: {
        ...toUpdate,
      },
    });

    return NextResponse.json({ message: 'Quiz updated' }, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
