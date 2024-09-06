"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa";
import Image from "next/image";

const UsecaseDescription: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extracting data from query parameters
  const usecase = searchParams.get("usecase") || "";
  const usecaseDescription = searchParams.get("usecaseDescription") || "";
  const enhancement = searchParams.get("Enhancement") || "";
  const measureOfImpact = searchParams.get("MeasureOfImpact") || "";
  const startups = JSON.parse(searchParams.get("startups") || "[]");

  // Handle Go Back
  const handleGoBack = () => {
    // Retrieve the navigation history from sessionStorage
    const history = JSON.parse(sessionStorage.getItem('navigationHistory') || "[]");
    const previousPath = history[history.length - 2] || "/";
    
    // Navigate to the previous path
    router.push(previousPath);
  };

  // Handle Explore Ecosystem
  const handleExploreEcosystem = () => {
    const query = new URLSearchParams({
      usecase,
      usecaseDescription,
      startups: JSON.stringify(startups),
      Enhancement: enhancement,
      MeasureOfImpact: measureOfImpact,
    }).toString();

    router.push(`/ecosystem?${query}`);
  };

  // Track navigation history
  useEffect(() => {
    const currentPath = window.location.pathname;
    let history = JSON.parse(sessionStorage.getItem('navigationHistory') || "[]");

    // Avoid adding the current path if it's already the latest
    if (history[history.length - 1] !== currentPath) {
      history.push(currentPath);
      sessionStorage.setItem('navigationHistory', JSON.stringify(history));
    }
  }, [router]);

  return (
    <div>
      <div className="relative">
        <div className="fixed top-0 left-0 w-full h-16 border-b shadow-md bg-white z-50 flex items-center justify-between px-4">
          <div
            className="text-gray-700 cursor-pointer z-50"
            onClick={handleGoBack}
            role="button"
            aria-label="Go back"
          >
            <FaAngleLeft size={24} />
          </div>
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

     <div className="relative flex flex-col justify-center items-center text-center  py-8 mt-16 bg-[#005585] ">
  {/* Background Image */}
  <div className="absolute inset-0 z-0 opacity-15">
    <img src="bg-usecase.png" alt="Background" className="object-cover w-full h-full" />
  </div>

  {/* Text Container */}
  <div className="relative z-10 text-white font-semibold text-2xl px-4 py-8">
    {usecase || "No Use Case Title Available"}
  </div>

  {/* Explore Ecosystem Button */}
  <div
    className="relative z-10 text-sm font-medium bg-white mx-auto px-4 py-2 cursor-pointer rounded-md shadow-md"
    onClick={handleExploreEcosystem}
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

const UsecaseDescriptionPage = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <UsecaseDescription />
    </React.Suspense>
  );
};

export default UsecaseDescriptionPage;
