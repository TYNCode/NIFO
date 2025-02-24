'use client'
import React from "react";
import ProjectDetails from "../coinnovation/components/ProjectDetails";

const page = () => {
  return (
    <div className="w-full flex gap-20">
      <div className="w-[20%]">Hi</div>
      <div className="w-[80%] h-screen">
        <ProjectDetails />
      </div>
    </div>
  );
};

export default page;
