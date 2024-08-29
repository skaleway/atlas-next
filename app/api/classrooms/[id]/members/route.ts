// manipulate members of a classroom
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { NextApiRequest } from 'next';

export function GET() {
  return NextResponse.json({ message: 'Hello' });
}
