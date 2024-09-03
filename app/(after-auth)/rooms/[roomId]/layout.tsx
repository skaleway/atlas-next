import React, { ReactNode } from "react";
import RoomSidebar from "../../_components/sidebar";
import { findRoomById } from "@/actions/room";
import { notFound } from "next/navigation";
import RoomHeader from "../../_components/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/hooks/use-user";

const RoomLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: { roomId: string };
}) => {
  const user = await useUser();
  const { room } = await findRoomById(params.roomId);

  if (!room) return notFound();
  if (!user) return null;


  return (
    <div className="h-screen">
      <div className="h-full w-full mx-auto max-w-7xl flex">
        <RoomSidebar room={room} />
        <div className="flex-[3] border-x flex flex-col">
          <RoomHeader room={room} user={user} />
          <ScrollArea className="remaining-height flex bg-muted">
            <div className="h-full p-5">{children}</div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default RoomLayout;
