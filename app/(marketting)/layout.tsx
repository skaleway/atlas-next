import React, { ReactNode } from "react";
import { MarkettingFooter, MarkettingNavbar } from "./_components";
import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";

const MarkettingLayout = async ({ children }: { children: ReactNode }) => {
  const user = await useUser();

  if (user) return redirect("/ready");

  return (
    <div className="w-full min-h-screen">
      <MarkettingNavbar />
      {children}
      <MarkettingFooter />
    </div>
  );
};

export default MarkettingLayout;
