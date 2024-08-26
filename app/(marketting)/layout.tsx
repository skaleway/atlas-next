import React, { ReactNode } from "react";
import { MarkettingFooter, MarkettingNavbar } from "./_components";

const MarkettingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-screen">
      <MarkettingNavbar />
      {children}
      <MarkettingFooter />
    </div>
  );
};

export default MarkettingLayout;
