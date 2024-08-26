import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";

import localFont from "next/font/local";
import { cn } from "@/lib/utils";

const satoshi = localFont({
  src: [
    {
      path: "../fonts/Satoshi-Light.woff",
      weight: "300",
    },
    {
      path: "../fonts/Satoshi-Regular.woff",
      weight: "400",
    },
    {
      path: "../fonts/Satoshi-Medium.woff",
      weight: "500",
    },
    {
      path: "../fonts/Satoshi-Bold.woff",
      weight: "700",
    },
    {
      path: "../fonts/Satoshi-Black.woff",
      weight: "900",
    },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Atlas",
    template: " %s | Atlas",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body className={cn(satoshi.className, "")}>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <div className="w-full md:w-full">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
