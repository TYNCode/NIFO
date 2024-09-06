"use client";

import React from "react";
import Image from "next/image";

const UsecaseDescription = ({
  usecase,
  usecaseDescription,
  enhancement,
  measureOfImpact,
  startups,
  onComplete,
  handleEcosystem
}) => {

 const handleExploreClick = () => {
   // Pass usecase, usecaseDescription, and startups data to the ecosystem handler
   handleEcosystem({
     usecase,
     usecaseDescription,
     startups,
   });
 };

  return (
    <div>
      <div className="relative flex flex-col justify-center items-center text-center py-8 mt-16 gap-6 bg-[#005585]">
        
        {/* Background image with opacity */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <Image 
            src="/bg-usecase.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>

        {/* Text container on top of the background */}
        <div className="relative z-10 text-white font-semibold text-2xl px-4 ">
          {usecase || "No Use Case Title Available"}
        </div>

        {/* Explore Ecosystem Button */}
        <div
          className="relative z-50 text-sm font-medium bg-white mx-auto px-4 py-2 cursor-pointer rounded-md shadow-md"
          onClick={handleExploreClick}  // Call handleEcosystem with startups data
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
          <div className="mt-4 mb-24">
            <div className="font-semibold text-lg mb-2">Measure of Impact</div>
            <div className="text-base">{measureOfImpact}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsecaseDescription;
