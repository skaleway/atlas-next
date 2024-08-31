import { addUserToRoomSchema, RoomSchema } from "@/schema";
import * as z from "zod";

export type MarkettingNavbarLinkItem = {
  label: string;
  path: string;
  isExternal?: boolean;
};

export type RoomSchemaType = z.infer<typeof RoomSchema>;
export type addUserToRoomType = z.infer<typeof addUserToRoomSchema>;
