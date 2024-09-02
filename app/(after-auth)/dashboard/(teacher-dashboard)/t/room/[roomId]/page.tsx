import { findRoomById } from "@/actions/room";
import { useUser } from "@/hooks/use-user";
import { notFound } from "next/navigation";
import React from "react";

const RoomIdPage = async ({ params }: { params: { roomId: string } }) => {
  const user = await useUser();

  if (!user) return null;

  const room = await findRoomById(params.roomId);

  if (!room) return notFound();

  return <div>RoomIdPage</div>;
};

export default RoomIdPage;
