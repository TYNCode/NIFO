"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CiGlobe } from "react-icons/ci";
import { TbLocation } from "react-icons/tb";
import Image from "next/image";
import { encryptURL } from "../../utils/shareUtils";

// Receive startups as props
const EcosystemContent: React.FC<{
  startups: any[];
  usecase: string;
  usecaseDescription: string;
}> = ({ startups, usecase, usecaseDescription }) => {

  console.log("Ecosystem pagee",startups, usecase, usecaseDescription)
  const router = useRouter();

  const handleExploreClick = async (startupName: string) => {
    try {
      const response = await fetch(
        `https://nifo.theyellow.network/api/directorysearch/companysearch/?startup_name=${startupName}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const startupId = data[0]?.startup_id;
        const encryptedId = encryptURL(startupId.toString());
        router.push(`/startups/${encryptedId}`);
      } else {
        alert("Startup not found");
      }
    } catch (error) {
      console.error("Error in handleExploreClick:", error);
      alert("An error occurred while processing your request.");
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-12">
      {/* Main content section */}
      <div className="bg-[#005585] p-4 w-full z-50 mt-4">
        <div className="text-lg font-semibold text-white">
          {usecase|| "Ecosystem Overview"}
        </div>
        <div className="text-base mt-4 text-white">
          {usecaseDescription ||
            "Learn about the startups and technologies revolutionizing the industry."}
        </div>
      </div>

      {/* Startup list */}
      <div className="mx-3 flex flex-col gap-8">
        {startups.length > 0 ? (
          startups.map((startup, index) => (
            <div
              key={index}
              className="shadow-md border-2 rounded-md px-3 py-4"
            >
              <div className="font-bold">{startup.name}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm">
                  {startup.description || "No description available."}
                </div>
                <div className="relative -mt-7 flex justify-center">
                  <Image
                    src={startup.logo || "/placeholder-image.png"}
                    alt="Startup Logo"
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
  );
};

// Ecosystem component that receives startups and other details as props
const Ecosystem: React.FC<{
  startups: any[];
  usecase: string;
  usecaseDescription: string;
}> = ({ startups, usecase, usecaseDescription }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EcosystemContent
        startups={startups}
        usecase={usecase}
        usecaseDescription={usecaseDescription}
      />
    </Suspense>
  );
};

export default Ecosystem;
