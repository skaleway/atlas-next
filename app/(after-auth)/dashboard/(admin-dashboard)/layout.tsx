import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const StudentLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await useUser();

  if (!user) return;

  if (user.usertype === "STUDENT") return redirect("/dashboard/s");
  if (user.usertype === "TEACHER") return redirect("/dashboard/t");

  return <div>{children}</div>;
};

export default StudentLayout;
