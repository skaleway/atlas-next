import { addUserToRoomSchema, RoomSchema } from "@/schema";
import { LucideIcon } from "lucide-react";
import * as z from "zod";

export type MarkettingNavbarLinkItem = {
  label: string;
  path: string;
  isExternal?: boolean;
};

export type SidebarLinkItem = {
  name: string;
  path: string;
  icon: LucideIcon;
};

export type RoomSchemaType = z.infer<typeof RoomSchema>;
export type addUserToRoomType = z.infer<typeof addUserToRoomSchema>;
