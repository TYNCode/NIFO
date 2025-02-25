'use client'
import React from "react";

import Questionairre from "../coinnovation/components/Questionairre";

const page = () => {
  return (
    <div className="w-full flex gap-20">
      <div className="w-[20%]">Hi</div>
      <div className="w-[80%] h-screen">
        <Questionairre/>
      </div>
    </div>
  );
};

export default page;
