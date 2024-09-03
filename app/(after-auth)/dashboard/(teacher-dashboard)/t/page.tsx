import { findUserOneRoom, findUsersCreatedRoom } from "@/actions/room";
import { useUser } from "@/hooks/use-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import Room from "../../(student-dashboard)/s/_components/room";

const TeacherDashboard = async () => {
  const user = await useUser();

  if (!user || user?.usertype !== "TEACHER") {
    return <div>Unauthorized Access</div>;
  }

  if (!user.selected) {
    return redirect("/onboarding");
  }

  const teacherRoom = await findUserOneRoom(user.id);

  if (!teacherRoom.room) return redirect("/dashboard/t/create-room");

  const teacherRooms = await findUsersCreatedRoom(user.id);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-20">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-semibold ">Teacher dashboard</h1>
        <p className="text-sm text-gray-600">
          Hear are the rooms that you created as a teacher.
        </p>
      </div>

      {teacherRooms?.rooms.length === 0 && <div>No room yet</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {teacherRooms?.rooms &&
          teacherRooms.rooms.length > 0 &&
          teacherRooms.rooms.map((room) => (
            <Room room={room} key={room.id} userId={user.id} />
          ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
