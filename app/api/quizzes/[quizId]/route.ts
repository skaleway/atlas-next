import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Get quiz by id
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

// Delete quiz by id
export async function DELETE(
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
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (findUser.usertype !== 'ADMIN' && findUser.usertype !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const quiz = await db.quiz.findUnique({
      where: {
        id: params.quizId,
      },
    });

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    await db.quiz.delete({
      where: {
        id: params.quizId,
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
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (findUser.usertype !== 'ADMIN' && findUser.usertype !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const quiz = await db.quiz.findUnique({
      where: {
        id: params.quizId,
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
