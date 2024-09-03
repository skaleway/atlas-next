import { MarkettingNavbarLinkItem, SidebarLinkItem } from "@/types";
import { Activity } from "lucide-react";

export const markettingNavbarRoutes: MarkettingNavbarLinkItem[] = [
  { path: "/features", label: "Features" },
  { path: "/pricing", label: "pricing", isExternal: true },
  { path: "/contact", label: "contact" },
];

export const roomSidebarRoutes = (roomId: string): SidebarLinkItem[] => {
  return [
    {
      name: "Quizes",
      path: `/rooms/${roomId}`,
      icon: Activity,
    },
    {
      name: "Leaders board",
      path: `/rooms/${roomId}/leaders`,
      icon: Activity,
    },
    {
      name: "Activities",
      path: `/rooms/${roomId}/activities`,
      icon: Activity,
    },
  ];
};
