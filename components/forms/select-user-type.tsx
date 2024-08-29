"use client";

import * as z from "zod";
import React, { useState } from "react";
import { UserType } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { UserTypeSchema } from "@/schema";
import { cn } from "@/lib/utils";

const SelectUserType = () => {
  const [active, setActive] = useState(0);
  const router = useRouter();

  const form = useForm<z.infer<typeof UserTypeSchema>>({
    resolver: zodResolver(UserTypeSchema),
    defaultValues: {
      type: "STUDENT",
    },
  });

  async function onSubmit(values: z.infer<typeof UserTypeSchema>) {
    try {
      if (values.type === "STUDENT") {
        await router.push("/dashboard/student");
      }

      if (values.type === "TEACHER") {
        await router.push("/dashboard/teacher");
      }
    } catch (error: any) {}
  }

  const types = [UserType.STUDENT, UserType.TEACHER];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 w-full">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Select User Type
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please choose whether you are a student or a teacher.
          </p>
        </div>

        <div className="flex gap-10">
          {types.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setActive(index);
                onSubmit({ type: item });
              }}
              className={cn(
                "border-2 border-border p-5 flex-1 cursor-pointer transition-all duration-300 rounded-2xl",
                active === index && "border-primary text-primary"
              )}
            >
              {item === "STUDENT" ? "Student" : "Teacher"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectUserType;
