import React from "react";
import BackgroundWrapper from "@/components/background-wrapper";

const MainLayout = async ({ children }) => {
  return (
    <BackgroundWrapper>
      <div className="min-h-screen pt-16 pb-20">
        {children}
      </div>
    </BackgroundWrapper>
  );
};

export default MainLayout;
