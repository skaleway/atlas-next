'use server';

import { useUser } from '@/hooks/use-user';
import { db } from '@/lib/db';
import { addUserToRoomSchema, RoomSchema } from '@/schema';
import { addUserToRoomType, RoomSchemaType } from '@/types';

export async function createRoom(data: RoomSchemaType) {
  try {
    const user = await useUser();

    if (!user)
      return {
        message: 'Unauthorized',
      };

    if (user.usertype !== 'TEACHER')
      return {
        message: "You can't create a class as a student",
      };

    const validData = RoomSchema.safeParse(data);

    if (!validData.success)
      return {
        message: 'Data provided not valid',
      };

    const room = await db.room.create({
      data: {
        name: data.name,
        description: data.description,
        creatorId: user.id,
        members: {
          create: {
            userId: user.id,
            role: 'ADMIN',
          },
        },
      },
    });

    return {
      message: 'Room created successfully',
      room,
    };
  } catch (error: any) {
    console.log('CREATING_ROOM', error.message);
    return {
      message: 'Something happened when creating a room',
    };
  }
}

export async function findUserOneRoom(userId: string) {
  try {
    const room = await db.room.findFirst({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: true,
      },
    });

    if (!room) return { message: 'Room not found' };

    return {
      message: 'Room found',
      room,
    };
  } catch (error: any) {
    console.log('FIND_USER_ONE_ROOM', error.message);
    return {
      message: 'Something happened when finding a room',
    };
  }
}

export async function findRoomById(roomId: string) {
  try {
    const room = await db.room.findFirst({
      where: { id: roomId },
      include: {
        members: true,
        quizzes: {
          include: {
            attempts: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!room) return { message: 'Room not found' };

    return {
      message: 'Room found',
      room,
    };
  } catch (error: any) {
    console.log('FIND_ROOM_BY_ID', error.message);
    return {
      message: 'Something happened when finding a room',
    };
  }
}

export async function addUserToRoom(data: addUserToRoomType) {
  try {
    const user = await useUser();

    if (!user)
      return {
        message: 'Unauthorized',
      };

    const validData = addUserToRoomSchema.safeParse(data);

    if (!validData.success)
      return {
        message: 'Invalid request body',
      };

    const room = await findRoomById(data.roomId);

    if (!room)
      return {
        message: 'Room not found',
      };

    if (room.room?.members.some((m) => m.userId === data.userId))
      return {
        message: 'User already in room',
      };

    await db.room.update({
      where: { id: data.roomId },
      data: {
        members: {
          create: [
            {
              userId: data.userId,
            },
          ],
        },
      },
    });

    return {
      message: 'User added successfully',
      room,
    };
  } catch (error: any) {
    console.log('ERROR_ADDING_USER_TO_ROOM');
  }
}

export async function findUsersCreatedRoom(userId: string) {
  try {
    const rooms = await db.room.findMany({
      where: {
        creatorId: userId,
      },
      include: {
        members: true,
      },
    });

    if (!rooms) {
      return {
        message: 'No rooms found',
        rooms: [],
      };
    }

    return {
      message: 'Rooms found',
      rooms,
    };
  } catch (error: any) {
    console.log('ERROR_FINDING_USERS_CREATED_ROOM');
  }
}
