"use client";

import React from "react";
import Image from "next/image";

const UsecaseDescription = ({ handleEcosystem, selectedUseCase }) => {
  const handleExploreClick = () => {
    handleEcosystem({ selectedUseCase });
  };

  const bgImage =
    selectedUseCase?.images?.[0] || "/fallback.jpg";

  return (
    <div>
      {/* Header with Background Image */}
      <div className="relative flex flex-col justify-center items-center text-center py-8 gap-6 bg-white">
        <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
          <Image
            src={bgImage}
            alt="Usecase Background"
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = "/fallback.jpg";
            }}
          />
        </div>

        <div className="relative z-10 text-white font-bold text-2xl px-4 max-w-[90%]">
          {selectedUseCase?.challenge_title || "No Use Case Title Available"}
        </div>

        <div
          className="relative z-10 text-sm font-medium bg-white text-black px-4 py-2 rounded-md shadow-md cursor-pointer"
          onClick={handleExploreClick}
        >
          Explore Ecosystem
        </div>
      </div>

      {/* Usecase Content */}
      <div className="mx-4 py-6 leading-7 text-base">
        {selectedUseCase?.challenge && (
          <div className="mb-6">
            <div className="font-semibold text-lg mb-2 text-customBlack">
              Description
            </div>
            <p>{selectedUseCase.challenge}</p>
          </div>
        )}

        {selectedUseCase?.solution?.length > 0 && (
          <div className="mb-6">
            <div className="font-semibold text-lg mb-2 text-customBlack">
              Enhancement
            </div>
            <ul className="list-disc list-inside space-y-2">
              {selectedUseCase.solution.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {selectedUseCase?.impact?.length > 0 && (
          <div className="mb-24">
            <div className="font-semibold text-lg mb-2 text-customBlack">
              Measure of Impact
            </div>
            <ul className="list-disc list-inside space-y-2">
              {selectedUseCase.impact.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsecaseDescription;
