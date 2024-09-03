"use client";

import React, { Suspense } from "react";
import ResetPasswordLap from "../components/ResetPasswordLap";
import ResetPasswordMobile from "../mobileComponents/ResetPasswordMobile";

const ResetPasswordPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <div className="hidden md:block">
          <ResetPasswordLap />
        </div>
        <div className="block md:hidden">
          <ResetPasswordMobile />
        </div>
      </div>
    </Suspense>
  );
};

export default ResetPasswordPage;
