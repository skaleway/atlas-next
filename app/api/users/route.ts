import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { useUser } from '@/hooks/use-user';

export async function GET() {
  try {
    const user = await db.user.findMany();

    return NextResponse.json(user);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const newUser = await useUser();

//     if (!newUser) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     const user = await db.user.create({
//       data: {
//         ...newUser,
//       },
//     });

//     return NextResponse.json(user, { status: 201 });
//   } catch (error: any) {
//     console.log(error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
