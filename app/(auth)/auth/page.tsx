import { redirect } from "next/navigation";

const AuthPage = () => {
  return redirect("/auth/sign-in");
};

export default AuthPage;
