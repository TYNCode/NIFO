"use client";

import React, { Suspense } from "react";
import ResetPassword from "../components/ResetPassword";

const SearchResetPassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
};

export default SearchResetPassword;
