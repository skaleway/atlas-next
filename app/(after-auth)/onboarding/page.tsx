import { Metadata } from "next";

import SelectUserType from "@/components/forms/select-user-type";
import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "OnBoarding",
};

const OnBoarding = async () => {
  const user = await useUser();

  if (!user) return null;

  if (user.selected) {
    if (user.usertype === "STUDENT") return redirect("/dashboard/s");
    if (user.usertype === "TEACHER")
      return redirect("/dashboard/t/create-room");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SelectUserType />
    </div>
  );
};

export default OnBoarding;
