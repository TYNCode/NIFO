"use client";

import React from "react";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";

const UsecaseDescription = ({ handleEcosystem, selectedUseCase, handleBack }) => {
  const handleExploreClick = () => {
    handleEcosystem({ selectedUseCase });
  };

  const bgImage = selectedUseCase?.images?.[0] || "/fallback.jpg";

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-primary hover:text-blue-800 font-medium transition-colors"
        >
          <FaArrowLeft className="text-sm" />
          <span className="text-sm">Back to Use Cases</span>
        </button>
      </div>

      {/* Header with Background Image */}
      <div className="relative flex flex-col justify-center items-center text-center py-12 px-4 bg-white">
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

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-40 z-5"></div>

        <div className="relative z-10 text-white font-bold text-xl sm:text-2xl px-4 max-w-[90%] mb-6 text-center leading-tight">
          {selectedUseCase?.challenge_title || "No Use Case Title Available"}
        </div>

        <button
          className="relative z-10 text-sm font-medium bg-white text-black px-6 py-3 rounded-lg shadow-lg cursor-pointer hover:bg-gray-100 transition-colors min-w-[160px]"
          onClick={handleExploreClick}
        >
          Explore Ecosystem
        </button>
      </div>

      {/* Usecase Content */}
      <div className="px-4 py-6 pb-24 space-y-6">
        {selectedUseCase?.challenge && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="font-semibold text-lg mb-3 text-gray-900 border-b border-gray-200 pb-2">
              Challenge
            </div>
            <p className="text-gray-700 leading-relaxed text-base">
              {selectedUseCase.challenge}
            </p>
          </div>
        )}

        {selectedUseCase?.solution?.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="font-semibold text-lg mb-3 text-gray-900 border-b border-gray-200 pb-2">
             Solution
            </div>
            <ul className="space-y-3">
              {selectedUseCase.solution.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed text-base">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedUseCase?.impact?.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="font-semibold text-lg mb-3 text-gray-900 border-b border-gray-200 pb-2">
              Impact
            </div>
            <ul className="space-y-3">
              {selectedUseCase.impact.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed text-base">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsecaseDescription;