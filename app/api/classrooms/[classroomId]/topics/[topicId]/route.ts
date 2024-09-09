import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { putReqBodyTopicSchema, reqRoomBodySchema } from "@/schema";
import { findUserOneRoom } from "@/actions/room";

// get a classroom topic
export async function GET(
  req: NextRequest,
  { params }: { params: { classroomId: string; topicId: string } }
) {
  try {
    if (!params.classroomId || !params.topicId) {
      return NextResponse.json(
        {
          message: "Classroom ID and Topic ID are required",
        },
        { status: 400 }
      );
    }

    const findTopic = await db.topic.findFirst({
      where: {
        id: params.topicId,
        roomId: params.classroomId,
      },
    });

    if (!findTopic) {
      return NextResponse.json(
        { message: "Topic not found, verify params." },
        { status: 404 }
      );
    }

    return NextResponse.json(findTopic, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// update a classroom topic
export async function PUT(
  req: NextRequest,
  { params }: { params: { classroomId: string; topicId: string } }
) {
  try {
    if (!params.classroomId || !params.topicId) {
      return NextResponse.json(
        { message: "Classroom ID and Topic ID are required" },
        { status: 400 }
      );
    }

    const findClassroom = await db.room.findUnique({
      where: {
        id: params.classroomId,
      },
    });

    if (!findClassroom) {
      return NextResponse.json(
        { message: "Classroom not found" },
        { status: 404 }
      );
    }

    const findTopic = await db.topic.findFirst({
      where: {
        id: params.topicId,
        roomId: params.classroomId,
      },
    });

    if (!findTopic) {
      return NextResponse.json({ message: "Topic not found" }, { status: 404 });
    }

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const findRoomMember = await db.roomMember.findFirst({
      where: {
        roomId: params.classroomId,
        userId: user.id,
      },
    });

    if (!findRoomMember || findRoomMember.role !== "ADMIN") {
      const findUser = await db.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!findUser) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      if (findUser.usertype !== "ADMIN") {
        return NextResponse.json(
          { message: "Unauthorized to update topic" },
          { status: 401 }
        );
      }
    }

    const body = await req.json();

    const validateTopic = putReqBodyTopicSchema.safeParse(body);

    if (!validateTopic.success) {
      return NextResponse.json(
        { message: JSON.stringify(validateTopic.error) },
        { status: 400 }
      );
    }

    const { name, description } = validateTopic.data;

    const toUpdate: any = {};

    if (name && name !== findTopic.name) {
      toUpdate.name = name;
    }

    if (description && description !== findTopic.description) {
      toUpdate.description = description;
    }

    const updatedTopic = await db.topic.update({
      where: {
        id: findTopic.id,
      },
      data: toUpdate,
    });

    if (!updatedTopic) {
      return NextResponse.json(
        { message: "Failed to update topic" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedTopic, { status: 201 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// delete a classroom topic
export async function DELETE(
  req: NextRequest,
  { params }: { params: { classroomId: string; topicId: string } }
) {
  try {
    if (!params.classroomId || !params.topicId) {
      return NextResponse.json(
        { message: "Classroom ID and Topic ID are required" },
        { status: 400 }
      );
    }

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const findRoomMember = await db.roomMember.findFirst({
      where: {
        roomId: params.classroomId,
        userId: user.id,
      },
    });

    if (!findRoomMember || findRoomMember.role !== "ADMIN") {
      const findUser = await db.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!findUser) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      if (findUser.usertype !== "ADMIN") {
        return NextResponse.json(
          { message: "Unauthorized to delete topic" },
          { status: 401 }
        );
      }
    }

    const findTopic = await db.topic.findFirst({
      where: {
        id: params.topicId,
        roomId: params.classroomId,
      },
    });

    if (!findTopic) {
      return NextResponse.json({ message: "Topic not found" }, { status: 404 });
    }

    const deletedTopic = await db.topic.delete({
      where: {
        id: params.topicId,
        roomId: params.classroomId,
      },
    });

    if (!deletedTopic) {
      return NextResponse.json(
        { message: "Failed to delete topic" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Topic deleted successfully",
      data: deletedTopic,
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
