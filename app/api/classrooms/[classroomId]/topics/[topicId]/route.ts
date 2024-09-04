import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { reqRoomBodySchema } from '@/schema';
