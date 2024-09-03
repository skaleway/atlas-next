"use client";

import { roomSidebarRoutes } from "@/constants";
import { cn } from "@/lib/utils";
import { SidebarLinkItem } from "@/types";
import { Room } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const RoomSidebar = ({ room }: { room: Room }) => {
  const sidebarRoutes = roomSidebarRoutes(room.id);
  return (
    <aside className="flex-1 py-10 flex flex-col gap-20 px-5">
      <div className="bg-muted size-10 rounded-lg flex items-center justify-center font-semibold">
        {room.name.split("")[0]}
      </div>
      <nav>
        <ul className="flex-col flex gap-3">
          {sidebarRoutes.map((item, index) => (
            <SidebarNavItem key={index} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

function SidebarNavItem({
  item: { path, icon, name },
}: {
  item: SidebarLinkItem;
}) {
  const Icon = icon;
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <li>
      <Link
        href={path}
        className={cn(
          "text-sm text-gray-600 hover:text-gray-800 flex items-center gap-3 py-1.5 px-3 rounded hover:bg-muted transition-all duration-150",
          { "text-gray-800 bg-muted": isActive }
        )}
      >
        <Icon className="size-4 text-gray-400" />
        <span> {name}</span>
      </Link>
    </li>
  );
}

export default RoomSidebar;
