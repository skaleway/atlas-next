import GlobalProvider from "@/providers";
import React, { ReactNode } from "react";

const AfterAuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <GlobalProvider>
      <div>{children}</div>
    </GlobalProvider>
  );
};

export default AfterAuthLayout;
