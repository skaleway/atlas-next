import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Room, RoomMember } from "@prisma/client";
import { Plus } from "lucide-react";
import React from "react";

interface RoomHeaderProps {
  room: Room & { members: RoomMember[] };
}

const RoomHeader = ({ room }: RoomHeaderProps) => {
  return (
    <div className="flex h-14 bg-background items-center px-5 border-b justify-between">
      <h1 className="text-xl font-semibold text-gray-800">{room.name}</h1>
      <div className="flex items-center gap-2">
        <UserButton />
        <Button size="icon" className="min-w-10">
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default RoomHeader;
