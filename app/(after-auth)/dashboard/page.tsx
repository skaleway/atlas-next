import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const user = await useUser();

  if (!user) return;

  if (user.usertype === "STUDENT") return redirect("/dashboard/s");
  if (user.usertype === "TEACHER") return redirect("/dashboard/t");

  return redirect("/dashboard/admin");
};

export default Dashboard;
