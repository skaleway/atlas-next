"use client";

import Logo from "@/components/shared/logo";
import Link from "next/link";
import React from "react";
import { markettingNavbarRoutes } from "@/constants";
import { MarkettingNavbarLinkItem } from "@/types";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MarkettingNavbar = () => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center justify-between sticky top-0 bg-white/50 backdrop-blur-3xl">
      <Logo link="/" />
      <nav className="flex gap-4 sm:gap-6 h-full">
        {markettingNavbarRoutes.map((route, index) => (
          <MarkettingNavbarLink item={route} key={index} />
        ))}
      </nav>
      <div className="flex gap-10">
        <Link
          href="/auth/sign-in"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          prefetch={false}
        >
          Sign In
        </Link>
        <Link
          href="/auth/sign-up"
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          prefetch={false}
        >
          SignUp
        </Link>
      </div>
    </header>
  );
};

function MarkettingNavbarLink({ item }: { item: MarkettingNavbarLinkItem }) {
  const pathname = usePathname();

  const isActive = pathname === item.path;

  return (
    <Link
      href={item.path}
      className={cn("relative h-full items-center flex", {
        "after:absolute after:size-2 after:min-h-2 after:min-w-2 after:bg-black after:rounded-full after:left-0 after:right-0 after:mx-auto after:bottom-2 ":
          isActive,
      })}
    >
      {item.label}
    </Link>
  );
}

export default MarkettingNavbar;
