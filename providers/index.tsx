"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Toaster } from "./toast";
import { ThemeProvider } from "./theme";
import { Loading } from "@/components/shared/loading";
import NextTopLoader from "nextjs-toploader";
import { useTheme } from "next-themes";

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  const { resolvedTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="bg h-screen flex justify-center items-center  bg-primary">
        <Loading />
      </div>
    );

  return (
    <>
      <Toaster />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NextTopLoader
          showSpinner={false}
          color={resolvedTheme === undefined ? "#000" : "#fff"}
        />
        {children}
      </ThemeProvider>
    </>
  );
};

export default GlobalProvider;
