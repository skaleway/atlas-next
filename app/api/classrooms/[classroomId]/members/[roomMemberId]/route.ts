import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { classroomQuerySchema } from '@/schema';

export async function GET({
  params,
}: {
  params: { classroomId: string; roomMemberId: string };
}) {
  try {
    const validateParams = classroomQuerySchema.safeParse(params);

    if (!validateParams.success) {
      return NextResponse.json(
        { message: validateParams.error.errors[0].message },
        { status: 400 },
      );
    }

    const { classroomId, roomMemberId } = params;

    const roomMember = await db.roomMember.findUnique({
      where: {
        id: roomMemberId,
        roomId: classroomId,
      },
    });

    if (!roomMember) {
      return NextResponse.json(
        { message: 'Room member not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(roomMember);
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE({
  params,
}: {
  params: { classroomId: string; roomMemberId: string };
}) {
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

    const { classroomId, roomMemberId } = params;

    if (!classroomId || !roomMemberId) {
      return NextResponse.json(
        { message: 'Classroom ID and Room Member ID is required' },
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

    const findRoomMember = await db.roomMember.findUnique({
      where: {
        id: roomMemberId,
        roomId: classroomId,
      },
    });

    if (!findRoomMember) {
      return NextResponse.json(
        { message: 'Room member not found' },
        { status: 404 },
      );
    }

    if (findUser.usertype !== 'TEACHER' && findUser.usertype !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized to delete room member' },
        { status: 401 },
      );
    }

    await db.roomMember.delete({
      where: {
        id: roomMemberId,
      },
    });

    return NextResponse.json({ message: 'Room member deleted' });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: { classroomId: string; roomMemberId: string };
  },
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

    const { classroomId, roomMemberId } = params;

    if (!classroomId || !roomMemberId) {
      return NextResponse.json(
        { message: 'Classroom ID and Room Member ID is required' },
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

    const findRoomMember = await db.roomMember.findUnique({
      where: {
        id: roomMemberId,
        roomId: classroomId,
      },
    });

    if (!findRoomMember) {
      return NextResponse.json(
        { message: 'Room member not found' },
        { status: 404 },
      );
    }

    if (findUser.usertype !== 'TEACHER' && findUser.usertype !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized to update room member' },
        { status: 401 },
      );
    }

    const body = await req.json();

    if (!body.role) {
      return NextResponse.json(
        { message: 'Request body is required' },
        { status: 400 },
      );
    }

    if (
      body.role !== 'ADMIN' &&
      body.role !== 'STUDENT' &&
      body.role !== 'TEACHER'
    ) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    if (body.role === findRoomMember.role) {
      return NextResponse.json(
        { message: 'Can not update same role' },
        { status: 400 },
      );
    }

    const updateRoomMember = await db.roomMember.update({
      where: {
        id: roomMemberId,
        roomId: classroomId,
      },
      data: {
        role: body.role,
      },
    });

    return NextResponse.json({
      message: 'Room member updated',
      data: updateRoomMember,
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
