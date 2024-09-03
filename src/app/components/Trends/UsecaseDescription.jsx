import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import Image from "next/image";

const UsecaseDescription = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extracting the required fields from the location's state
  const { useCaseTitle, description, startups, enhancement, measureOfImpact } =
    location.state || {};

  console.log("Enhancement", enhancement);

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleExploreEcosystem = () => {
    navigate("/ecosystem", {
      state: {
        useCaseTitle,
        startups,
        description,
        enhancement,
        measureOfImpact,
      },
    });
  };

  return (
    <div>
      {/* Navbar */}
      <div className="relative">
        <div className="fixed top-0 left-0 w-full h-16 border-b shadow-md bg-white z-50 flex items-center justify-between px-4">
          {/* Left Arrow */}
          <div
            className="text-gray-700 cursor-pointer z-50"
            onClick={handleGoBack}
            role="button"
            aria-label="Go back"
          >
            <FaAngleLeft size={24} />
          </div>

          {/* Centered Logo */}
          <div className="mx-auto">
            <Image
              src="/nifoimage.png"
              width={100}
              height={100}
              alt="Tyn Logo"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col bg-[#005585] px-4 justify-center items-center text-center gap-8 py-8 mt-16">
        {" "}
        {/* Adjusted for navbar height */}
        <div className="font-semibold text-white text-4xl">
          {useCaseTitle || "No Use Case Title Available"}
        </div>
        <div
          className="text-black text-lg font-medium bg-[#00A3FF] mx-auto p-2 cursor-pointer"
          onClick={handleExploreEcosystem}
        >
          Explore Ecosystem
        </div>
      </div>

      <div className="mx-4 py-4 leading-9 text-xl">
        {description && (
          <div>
            <h2 className="font-bold text-2xl mb-2">Description</h2>
            <p>{description}</p>
          </div>
        )}

        {enhancement && (
          <div className="mt-4">
            <h2 className="font-bold text-2xl mb-2">Enhancement</h2>
            <p>{enhancement}</p>
          </div>
        )}

        {measureOfImpact && (
          <div className="mt-4">
            <h2 className="font-bold text-2xl mb-2">Measure of Impact</h2>
            <p>{measureOfImpact}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsecaseDescription;
