import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { putUserRequestBodySchema, querySchema } from '@/schema';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

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
      const updateFields = [
        'username',
        'firstname',
        'secondname',
        'email',
        'age',
        'usertype',
        'profilePicture',
      ];
      return NextResponse.json(
        { message: 'Invalid request body', update_fields: updateFields },
        { status: 400 },
      );
    }

    const values = bodyValidation.data;

    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 },
      );
    }

    if (!values) {
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

    if (values.usertype) {
      if (
        values.usertype !== 'ADMIN' &&
        values.usertype !== 'TEACHER' &&
        values.usertype !== 'STUDENT'
      ) {
        return NextResponse.json(
          { message: 'Invalid user type' },
          { status: 400 },
        );
      }
    }

    const updatedUser = await db.user.update({
      where: { id: String(id) },
      data: {
        username: values.username,
        firstname: values.firstname,
        secondname: values.secondname,
        email: values.email,
        age: values.age,
        usertype: values.usertype,
        profilePicture: values.profilePicture,
      },
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
