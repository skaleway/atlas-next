import React from "react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";

const UserNotFound = () => {
  return (
    <div className="h-screen flex items-center gap-10 justify-center flex-col">
      <div className="flex items-center flex-col">
        <h1 className="text-3xl font-semibold">User not found</h1>
        <p className="text-muted-foreground">You might want to authenticate</p>
      </div>
      <Link
        className={buttonVariants({ variant: "outline" })}
        href="/auth/sign-in"
      >
        Create your account
      </Link>
    </div>
  );
};

export default UserNotFound;
