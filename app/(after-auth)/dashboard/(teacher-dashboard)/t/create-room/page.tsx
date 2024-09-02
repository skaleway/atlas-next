import React from "react";
import { redirect } from "next/navigation";

import { useUser } from "@/hooks/use-user";
import { findUserOneRoom } from "@/actions/room";
import CreateRoom from "@/components/forms/create-room";

const CreateRoomPage = async () => {
  const user = await useUser();

  if (!user) return null;

  const userRoom = await findUserOneRoom(user.id);

  if (userRoom.room) {
    return redirect(`/dashboard/t/room/${userRoom.room.id}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <CreateRoom />
    </div>
  );
};

export default CreateRoomPage;
