"use client";

import React from "react";
import Image from "next/image";

const UsecaseDescription = ({
  handleEcosystem,
  selectedUseCase
}) => {

  console.log("UsecaseDescription", selectedUseCase?.useCaseDescription)

 const handleExploreClick = () => {
   handleEcosystem({
     selectedUseCase
   });
 };

  return (
    <div>
      <div className="relative flex flex-col justify-center items-center text-center py-8 mt-16 gap-6 bg-[#005585]">
       
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <Image 
            src="/bg-usecase.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>

    
        <div className="relative z-10 text-white font-semibold text-2xl px-4 ">
          {selectedUseCase?.useCase || "No Use Case Title Available"}
        </div>

    
        <div
          className="relative z-50 text-sm font-medium bg-white mx-auto px-4 py-2 cursor-pointer rounded-md shadow-md"
          onClick={handleExploreClick} 
        >
          Explore Ecosystem
        </div>
      </div>

      <div className="mx-4 py-4 leading-9 text-lg">
        {selectedUseCase?.useCaseDescription && (
          <div>
            <div className="font-semibold text-lg mb-2">Description</div>
            <div className="text-base">{selectedUseCase?.useCaseDescription}</div>
          </div>
        )}

        {selectedUseCase?.enhancement && (
          <div className="mt-4">
            <div className="font-semibold text-lg mb-2">Enhancement</div>
            <div className="text-base">{selectedUseCase?.enhancement}</div>
          </div>
        )}

        {selectedUseCase?.measureOfImpact && (
          <div className="mt-4 mb-24">
            <div className="font-semibold text-lg mb-2">Measure of Impact</div>
            <div className="text-base">{selectedUseCase?.measureOfImpact}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsecaseDescription;
