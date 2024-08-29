import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextApiRequest } from 'next';
import { reqRoomBodySchema } from '@/schema';

export async function POST(req: NextApiRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const bodyValidation = reqRoomBodySchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 },
      );
    }

    const { name } = bodyValidation.data;

    if (!name) {
      return NextResponse.json(
        { message: 'class name is required for class creation' },
        { status: 400 },
      );
    }

    const teacher = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!teacher || teacher.usertype !== 'TEACHER') {
      return NextResponse.json(
        { message: 'unauthorized access' },
        { status: 401 },
      );
    }

    const findroom = await db.room.findUnique({
      where: {
        name: name.toLowerCase(),
      },
    });

    if (findroom) {
      return NextResponse.json(
        { message: 'class already exists' },
        { status: 400 },
      );
    }

    const createroom = await db.room.create({
      data: {
        name: name.toLowerCase(),
        creatorId: teacher.id,
      },
    });

    if (!createroom) {
      return NextResponse.json(
        { message: 'class not created ' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      message: 'class created successfully',
      data: createroom,
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rooms = await db.room.findMany();

    return NextResponse.json(rooms);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
