import { Metadata } from "next";

import SelectUserType from "@/components/forms/select-user-type";

export const metadata: Metadata = {
  title: "OnBoarding",
};

const OnBoarding = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SelectUserType />
    </div>
  );
};

export default OnBoarding;
