import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { reqRoomBodySchema } from '@/schema';

// create classroom topic
export async function POST(
  req: NextRequest,
  { params }: { params: { classroomId: string } },
) {
  try {
    if (!params.classroomId) {
      return NextResponse.json(
        { message: 'Classroom ID is required' },
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
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (findUser.usertype !== 'TEACHER' && findUser.usertype !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized to create classroom topic' },
        { status: 401 },
      );
    }

    const { classroomId } = params;

    const findClassroom = await db.room.findUnique({
      where: {
        id: String(classroomId),
      },
    });

    if (!findClassroom) {
      return NextResponse.json(
        { message: 'Classroom not found' },
        { status: 404 },
      );
    }

    const body = await req.json();

    const topicValidation = reqRoomBodySchema.safeParse(body);

    if (!topicValidation.success) {
      return NextResponse.json(
        { message: JSON.stringify(topicValidation.error) },
        { status: 400 },
      );
    }

    const topic = await db.topic.create({
      data: {
        name: body.name,
        description: body.description,
        roomId: params.classroomId,
      },
    });

    if (!topic) {
      return NextResponse.json(
        { message: 'Failed to create topic' },
        { status: 500 },
      );
    }

    return NextResponse.json(topic, { status: 201 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Get classroom topics
export async function GET(
  req: NextRequest,
  { params }: { params: { classroomId: string } },
) {
  try {
    if (!params.classroomId) {
      return NextResponse.json(
        { message: 'Classroom ID is required' },
        { status: 400 },
      );
    }

    const findClassroom = await db.room.findUnique({
      where: {
        id: String(params.classroomId),
      },
    });

    if (!findClassroom) {
      return NextResponse.json(
        { message: 'Classroom not found' },
        { status: 404 },
      );
    }

    const topics = await db.topic.findMany({
      where: {
        roomId: params.classroomId,
      },
    });

    if (!topics) {
      return NextResponse.json({ message: 'No topics found' }, { status: 404 });
    }

    return NextResponse.json(topics, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
