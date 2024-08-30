import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { putUserRequestBodySchema, querySchema } from '@/schema';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const queryValidation = querySchema.safeParse(params);

    if (!queryValidation.success) {
      return NextResponse.json(
        { message: queryValidation.error.errors[0].message },
        { status: 400 },
      );
    }

    const bodyValidation = putUserRequestBodySchema.safeParse(body);
    if (!bodyValidation.success) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 },
      );
    }

    const { classroomId, ...values } = body;

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = currentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

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
