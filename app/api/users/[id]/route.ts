import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

import { NextApiRequest } from 'next';

export async function PUT(req: NextApiRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = req.query;
    const { classroomId, ...values } = req.body;

    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 },
      );
    }

    if (!values && !classroomId) {
      return NextResponse.json(
        { message: 'Values are required' },
        { status: 400 },
      );
    }

    const findUser = await db.user.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!findUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let userClassrooms = [...(findUser.classroomId || [])];

    if (classroomId && Array.isArray(classroomId)) {
      for (let i = 0; i < classroomId.length; i++) {
        if (!userClassrooms.includes(classroomId[i])) {
          const classroomExists = await db.room.findUnique({
            where: { id: classroomId[i] },
          });
          if (classroomExists) {
            userClassrooms.push(classroomId[i]);
          } else {
            return NextResponse.json(
              { message: 'Classroom not found' },
              { status: 404 },
            );
          }
        } else {
          return NextResponse.json(
            { message: 'User already in this class' },
            { status: 400 },
          );
        }
      }
    }

    const valuesToBeUpdated: any = { classroomId: userClassrooms };

    // Prevent updating restricted fields
    if (values) {
      if (values['clerkId']) {
        return NextResponse.json(
          {
            message: 'clerkId cannot be updated. Please try again',
          },
          { status: 400 },
        );
      }

      const updateFields = [
        'username',
        'firstname',
        'secondname',
        'email',
        'age',
        'usertype',
        'profilePicture',
      ];
      updateFields.forEach((field) => {
        if (
          values[field] &&
          values[field] !== findUser[field as keyof typeof findUser]
        ) {
          valuesToBeUpdated[field] = values[field];
        }
      });
    }

    const updatedUser = await db.user.update({
      where: { id: String(id) },
      data: valuesToBeUpdated,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not updated' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: 'User updated successfully', data: updatedUser },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextApiRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = req.query;

    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 },
      );
    }

    const findUser = await db.user.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!findUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const deletedUser = await db.user.delete({
      where: { id: String(id) },
    });

    if (!deletedUser) {
      return NextResponse.json(
        { message: 'User not deleted' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: 'User deleted successfully', data: deletedUser },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
