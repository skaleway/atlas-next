import { findUserOneRoom } from "@/actions/room";
import { useUser } from "@/hooks/use-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

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

  return <div>TeacherDashboard</div>;
};

export default TeacherDashboard;
