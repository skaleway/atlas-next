import { useUser } from "@/hooks/use-user";
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

  return <div>TeacherDashboard</div>;
};

export default TeacherDashboard;
