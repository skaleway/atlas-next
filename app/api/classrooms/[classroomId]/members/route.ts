import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { classroomQuerySchema, reqClassroomMembersBodySchema } from '@/schema';
import { currentUser } from '@clerk/nextjs/server';

export async function GET({ params }: { params: { classroomId: string } }) {
  try {
    const validateParams = classroomQuerySchema.safeParse(params);

    if (!validateParams.success) {
      return NextResponse.json(
        { message: validateParams.error.errors[0].message },
        { status: 400 },
      );
    }

    const roomMembers = await db.roomMember.findMany({
      where: {
        roomId: params.classroomId,
      },
    });

    if (!roomMembers) {
      return NextResponse.json(
        { message: 'No members found' },
        { status: 404 },
      );
    }

    return NextResponse.json(roomMembers);
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { classroomId: string } },
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const validateParams = classroomQuerySchema.safeParse(params);

    if (!validateParams.success) {
      return NextResponse.json(
        { message: validateParams.error.errors[0].message },
        { status: 400 },
      );
    }

    const { classroomId } = params;

    if (!classroomId) {
      return NextResponse.json(
        { message: 'Classroom ID is required' },
        { status: 400 },
      );
    }

    const findClassroom = await db.room.findUnique({
      where: {
        id: classroomId,
      },
    });

    if (!findClassroom) {
      return NextResponse.json(
        { message: 'Classroom not found' },
        { status: 404 },
      );
    }

    const body = await req.json();

    const verifyBody = reqClassroomMembersBodySchema.safeParse(body);

    if (!verifyBody.success) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 },
      );
    }

    const findUser = await db.user.findUnique({
      where: {
        id: body.userId,
      },
    });

    if (!findUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const findMember = await db.roomMember.findFirst({
      where: {
        roomId: classroomId,
        userId: body.userId,
      },
    });

    if (findMember) {
      return NextResponse.json(
        { message: 'User already a member of this classroom' },
        { status: 400 },
      );
    }

    const createMember = await db.roomMember.create({
      data: {
        roomId: classroomId,
        userId: body.userId,
        role: body.role,
      },
    });

    if (!createMember) {
      return NextResponse.json(
        { message: 'Member not added' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      message: 'Member added successfully',
      data: createMember,
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
