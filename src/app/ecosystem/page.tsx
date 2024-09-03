"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CiGlobe } from "react-icons/ci";
import { TbLocation } from "react-icons/tb";
import { FaAngleLeft } from "react-icons/fa";
import Image from "next/image";
import { encryptURL } from "../utils/shareUtils";

const EcosystemContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const useCaseTitle = searchParams.get("usecase");
  const description = searchParams.get("usecaseDescription");

  // Parse startups safely
  let startups = [];
  try {
    startups = JSON.parse(searchParams.get("startups") || "[]");
  } catch (error) {
    console.error("Failed to parse startups:", error);
    startups = [];
  }

  const handleGoBack = () => {
    router.back();
  };

  const fetchStartupId = async (
    startupName: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://nifo.theyellow.network/api/directorysearch/companysearch/?startup_name=${startupName}`
      );
      const data = await response.json();

      if (data.length > 0) {
        return data[0]?.startup_id;
      } else {
        throw new Error("Startup not found");
      }
    } catch (error) {
      console.error("Error fetching startup ID:", error);
      return null;
    }
  };

  const handleExploreClick = async (startupName: string) => {
    try {
      const startupId = await fetchStartupId(startupName);

      if (!startupId) {
        alert("Failed to retrieve startup ID");
        return;
      }

      const encryptedId = encryptURL(startupId.toString());
      router.push(`/startups/${encryptedId}`);
    } catch (error) {
      console.error("Error in handleExploreClick:", error);
      alert("An error occurred while processing your request.");
    }
  };

  return (
    <>
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

      {/* Main Content */}
      <div className="flex flex-col gap-4">
        <div className="bg-[#005585] p-4 w-full z-50 mt-16">
          <div className="text-lg font-semibold text-white">
            {useCaseTitle || "Ecosystem Overview"}
          </div>
          <div className="text-base mt-4 text-white">
            {description ||
              "Learn about the startups and technologies revolutionizing the industry."}
          </div>
        </div>

        <div className="mx-3 flex flex-col gap-8">
          {startups.length > 0 ? (
            startups.map((startup, index) => (
              <div
                key={index}
                className="shadow-md border-2 rounded-md px-3 py-4"
              >
                <div className="font-bold">{startup.name}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm">{startup.description}</div>
                  <div className="relative -mt-7 flex justify-center">
                    <Image
                      src="/placeholder-image.png"
                      alt="placeholder"
                      width={50}
                      height={50}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-3">
                  <button
                    className="inline-flex items-center text-[#0081CA] py-1 px-2 rounded border border-[#0081CA]"
                    onClick={() => handleExploreClick(startup.name)}
                  >
                    Explore <CiGlobe className="ml-2" />
                  </button>

                  <button className="bg-[#0081CA] text-white py-1 px-2 rounded inline-flex items-center">
                    Connect <TbLocation className="ml-2" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No startups found for this use case.</div>
          )}
        </div>
      </div>
    </>
  );
};

const Ecosystem: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EcosystemContent />
    </Suspense>
  );
};

export default Ecosystem;
