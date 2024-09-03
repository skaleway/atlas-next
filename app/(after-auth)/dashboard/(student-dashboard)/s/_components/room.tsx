"use client";

import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { RoomMember, Room as Rooms } from "@prisma/client";
import { addUserToRoomType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { addUserToRoomSchema } from "@/schema";
import { addUserToRoom } from "@/actions/room";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RoomProps {
  room: Rooms & { members: RoomMember[] };
  userId: string;
}
const Room = ({ room, userId }: RoomProps) => {
  const router = useRouter();
  const {
    formState: { isSubmitting },
  } = useForm<addUserToRoomType>({
    resolver: zodResolver(addUserToRoomSchema),
  });

  async function handleJoinRoom(values: addUserToRoomType) {
    try {
      const added = await addUserToRoom(values);

      if (added?.message === "Unathorized") {
        return toast.error(added?.message);
      }

      router.push("/");

      return toast.success("User added");
    } catch (error) {}
  }

  const userInRoom = room.members.some((member) => member.userId === userId);

  return (
    <Card key={room.id}>
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="bg-muted h-5 px-2 rounded w-fit flex items-center justify-center border border-border">
          <span className="text-xs">
            {userInRoom
              ? `You + ${room.members.length > 0 ? room.members.length - 1 : 0}`
              : room.members.length}{" "}
            Enrolled
          </span>
        </div>
        {userId === room.creatorId || userInRoom ? (
          <Link
            className={buttonVariants({ variant: "outline", size: "sm" })}
            href={`/rooms/${room.id}`}
          >
            <span>View room</span>
            <ArrowRight className="size-4 ml-2" />
          </Link>
        ) : (
          <Button
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleJoinRoom({ userId, roomId: room.id })}
          >
            Join
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Room;
