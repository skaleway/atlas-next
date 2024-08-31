"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { UserType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateUserType(type: UserType) {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        message: "Unathorized",
      };
    }

    const updatedUser = await db.user.update({
      where: { clerkId: user.id },
      data: { usertype: type, selected: true },
    });

    if (!updatedUser) {
      return {
        message: "User type not updated",
      };
    }

    revalidatePath("/onboarding");

    return {
      message: "User type updated successfully",
    };
  } catch (error: any) {
    console.error(error.message);
    return {
      message: "Error updating user type",
    };
  }
}
