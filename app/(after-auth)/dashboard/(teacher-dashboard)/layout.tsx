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

  if (user.usertype !== "TEACHER") return redirect("/dashboard/s");

  return <div>{children}</div>;
};

export default StudentLayout;
