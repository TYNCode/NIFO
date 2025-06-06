import React, { Suspense } from "react";
import ResetPasswordPage from "./ResetPasswordPage";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default Page;
