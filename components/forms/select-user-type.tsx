"use client";

import * as z from "zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserTypeSchema } from "@/schema";
import { UserType } from "@prisma/client";
import { cn } from "@/lib/utils";

const SelectUserType = () => {
  const [active, setActive] = useState(0);

  const form = useForm<z.infer<typeof UserTypeSchema>>({
    resolver: zodResolver(UserTypeSchema),
    defaultValues: {
      type: "STUDENT",
    },
  });

  async function onSubmit(values: z.infer<typeof UserTypeSchema>) {
    try {
      console.log(values);
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
