"use client";

import React from "react";
import { FaAngleLeft } from "react-icons/fa";
import Image from "next/image";

const UsecaseDescription = ({
  usecase,
  usecaseDescription,
  enhancement,
  measureOfImpact,
  onComplete,
  handleEcosystem, // Ensure this is passed
}) => {

  console.log("useCaseDescription", usecaseDescription)
  
  return (
    <div>
      <div className="relative flex flex-col justify-center items-center text-center py-8 mt-16 bg-[#005585] ">
        {/* Text Container */}
        <div className="relative z-10 text-white font-semibold text-2xl px-4 py-8">
          {usecase || "No Use Case Title Available"}
        </div>

        {/* Explore Ecosystem Button */}
        <div
          className="relative z-50 text-sm font-medium bg-white mx-auto px-4 py-2 cursor-pointer rounded-md shadow-md"
          onClick={handleEcosystem} // Ensure this function is called on click
        >
          Explore Ecosystem
        </div>
      </div>

      <div className="mx-4 py-4 leading-9 text-lg">
        {usecaseDescription && (
          <div>
            <div className="font-semibold text-lg mb-2">Description</div>
            <div className="text-base">{usecaseDescription}</div>
          </div>
        )}

        {enhancement && (
          <div className="mt-4">
            <div className="font-semibold text-lg mb-2">Enhancement</div>
            <div className="text-base">{enhancement}</div>
          </div>
        )}

        {measureOfImpact && (
          <div className="mt-4">
            <div className="font-semibold text-lg mb-2">Measure of Impact</div>
            <div className="text-base">{measureOfImpact}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsecaseDescription;
