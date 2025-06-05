"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa";
import Image from "next/image";

const UsecaseDescriptionPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const usecase = searchParams.get("usecase") || "";
  const usecaseDescription = searchParams.get("usecaseDescription") || "";
  const enhancement = searchParams.get("Enhancement") || "";
  const measureOfImpact = searchParams.get("MeasureOfImpact") || "";
  const startups = JSON.parse(searchParams.get("startups") || "[]");

  const handleGoBack = () => {
    const history = JSON.parse(sessionStorage.getItem("navigationHistory") || "[]");
    const previousPath = history[history.length - 2] || "/";
    router.push(previousPath);
  };

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

  useEffect(() => {
    const currentPath = window.location.pathname;
    let history = JSON.parse(sessionStorage.getItem("navigationHistory") || "[]");

    if (history[history.length - 1] !== currentPath) {
      history.push(currentPath);
      sessionStorage.setItem("navigationHistory", JSON.stringify(history));
    }
  }, [router]);

  return (
    <div>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full h-16 border-b shadow-md bg-white z-50 flex items-center justify-between px-4">
        <div className="text-gray-700 cursor-pointer z-50" onClick={handleGoBack} role="button">
          <FaAngleLeft size={24} />
        </div>
        <div className="mx-auto">
          <Image src="/nifoimage.png" width={100} height={100} alt="Tyn Logo" />
        </div>
      </div>

      {/* Banner */}
      <div className="relative flex flex-col justify-center items-center text-center py-8 mt-16 bg-secondary">
        <div className="absolute inset-0 z-0 opacity-15">
          <Image src="/bg-usecase.png" alt="Background" className="object-cover w-full h-full" fill />
        </div>
        <div className="relative z-10 text-white font-semibold text-2xl px-4 py-8">
          {usecase || "No Use Case Title Available"}
        </div>
        <div
          className="relative z-10 text-sm font-medium bg-white mx-auto px-4 py-2 cursor-pointer rounded-md shadow-md"
          onClick={handleExploreEcosystem}
        >
          Explore Ecosystem
        </div>
      </div>

      {/* Content */}
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

export default UsecaseDescriptionPage;
