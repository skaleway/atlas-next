import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await db.user.findMany();

    return NextResponse.json(user);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { firstname, secondname, email, usertype, username, profilePicture } =
      await req.json();

    return NextResponse.json({
      firstname,
      secondname,
      email,
      usertype,
      username,
      profilePicture,
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
