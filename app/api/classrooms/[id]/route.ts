import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { NextApiRequest } from 'next';
import { querySchema, reqRoomBodySchema } from '@/schema';

export async function PUT(req: NextApiRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized to update classroom' },
        { status: 401 },
      );
    }

    const findUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!findUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (findUser.usertype !== 'TEACHER' && findUser.usertype !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized to update classroom' },
        { status: 401 },
      );
    }

    // Validate query parameters
    const queryValidation = querySchema.safeParse(req.query);
    if (!queryValidation.success) {
      return NextResponse.json(
        { message: queryValidation.error.errors[0].message },
        { status: 400 },
      );
    }
    const { id } = queryValidation.data;

    // Validate request body
    const bodyValidation = reqRoomBodySchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 },
      );
    }
    const { name, creatorId } = bodyValidation.data;

    if (!name && !creatorId) {
      return NextResponse.json(
        { message: 'Values are required' },
        { status: 400 },
      );
    }

    const findClassroom = await db.room.findUnique({
      where: { id: String(id) },
    });

    if (!findClassroom) {
      return NextResponse.json(
        { message: 'Classroom not found' },
        { status: 404 },
      );
    }

    const toUpdate: any = {};

    if (name && name !== findClassroom.name) {
      const findRoom = await db.room.findUnique({
        where: { name: name.toLowerCase() },
      });

      if (findRoom) {
        return NextResponse.json(
          { message: 'Classroom already exists' },
          { status: 400 },
        );
      }

      toUpdate.name = name.toLowerCase();
    }

    if (creatorId && creatorId !== findClassroom.creatorId) {
      const findUser = await db.user.findUnique({
        where: { id: creatorId },
      });

      if (!findUser) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 },
        );
      }

      toUpdate.creatorId = creatorId;
    }

    const updateClassroom = await db.room.update({
      where: { id: String(id) },
      data: toUpdate,
    });

    return NextResponse.json({
      message: 'Classroom updated successfully',
      data: updateClassroom,
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
