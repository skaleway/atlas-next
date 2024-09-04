import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { reqRoomBodySchema } from '@/schema';

// get a classroom topic
export async function GET(
  req: NextRequest,
  { params }: { params: { classroomId: string; topicId: string } },
) {
  try {
    if (!params.classroomId || !params.topicId) {
      return NextResponse.json(
        {
          message: 'Classroom ID and Topic ID are required',
        },
        { status: 400 },
      );
    }

    const findTopic = await db.topic.findFirst({
      where: {
        id: params.topicId,
        roomId: params.classroomId,
      },
    });

    if (!findTopic) {
      return NextResponse.json(
        { message: 'Topic not found, verify params.' },
        { status: 404 },
      );
    }

    return NextResponse.json(findTopic, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
