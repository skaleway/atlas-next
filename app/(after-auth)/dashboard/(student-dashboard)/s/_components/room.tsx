"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { RoomMember, Room as Rooms } from "@prisma/client";

interface RoomProps {
  room: Rooms & { members: RoomMember[] };
}

const Room = ({ room }: RoomProps) => {
  return (
    <Card key={room.id}>
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <p className="flex gap-2 items-center">
          <span className="font-bold ">{room.members.length}</span>
          <span>currently enrolled</span>
        </p>
        <Button size="sm">Join</Button>
      </CardContent>
    </Card>
  );
};

export default Room;
