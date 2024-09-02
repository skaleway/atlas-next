import { Button } from "@/components/ui/button";

import { useUser } from "@/hooks/use-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import Room from "./_components/room";

const StudentDashboard = async () => {
  const user = await useUser();

  if (!user) {
    return <div>Unauthorized Access</div>;
  }

  if (!user.selected) {
    return redirect("/onboarding");
  }

  const rooms = await db.room.findMany({
    include: {
      members: {
        where: {
          role: "GUEST",
        },
      },
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-20">
      <h1 className="text-3xl font-semibold">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {rooms &&
          rooms.length > 0 &&
          rooms.map((room) => <Room room={room} key={room.id} />)}
      </div>
    </div>
  );
};

export default StudentDashboard;
