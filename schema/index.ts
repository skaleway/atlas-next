import * as z from "zod";
import { UserType } from "@prisma/client";

export const UserTypeSchema = z.object({
  type: z.enum([UserType.ADMIN, UserType.TEACHER, UserType.STUDENT], {
    required_error: "You need to select a user type.",
  }),
});
