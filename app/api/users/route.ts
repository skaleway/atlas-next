import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';


export async function GET(req:Request){
  try {
    const users = await db.user.findMany()

    if(!users){
      return new NextResponse("Something happened while getting users", {status:404
      })
    }
    
  } catch (error:any) {

    console.log(error.message)
return new NextResponse("Internal server error", {status:500})    
  }
}
