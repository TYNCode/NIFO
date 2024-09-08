"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CiGlobe } from "react-icons/ci";
import Image from "next/image";
import { encryptURL } from "../../utils/shareUtils";
import StartupProfile from "../../mobileComponents/StartupProfile";


interface Startup {
  name: string;
  description: string;
  logo?: string;
  startup_id?: string;
}

const EcosystemContent: React.FC<{
  startups: any;
  usecase: string;
  usecaseDescription: string;
  handleExploreClick: (selectedStartup: any) => void; // New prop to handle navigation
}> = ({
  startups: initialStartups,
  usecase,
  usecaseDescription,
  handleExploreClick,
}) => {
  const [detailedStartups, setDetailedStartups] = useState<any[]>([]);

  const fetchStartupDetails = async (startupName: string) => {
    try {
      const response = await fetch(
        `https://nifo.theyellow.network/api/directorysearch/companysearch/?startup_name=${startupName}`
      );
      const data = await response.json();
      if (data.length > 0) {
        return {
          name: data[0]?.startup_name,
          description: data[0]?.startup_description,
          logo: data[0]?.startup_logo,
          startup_id: data[0]?.startup_id,
          database_info: data[0], // Pass all information into a database_info object
        };
      }
    } catch (error) {
      console.error("Error fetching startup details:", error);
    }
    return null;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const promises = initialStartups.map((startup) =>
        fetchStartupDetails(startup.name)
      );
      const results = await Promise.all(promises);
      setDetailedStartups(results.filter((result) => result !== null));
    };

    fetchDetails();
  }, [initialStartups]);

  return (
    <div className="flex flex-col gap-4 mt-12">
      <div className="bg-[#005585] p-4 w-full mt-4">
        <div className="text-lg font-semibold text-white">
          {usecase || "Ecosystem Overview"}
        </div>
        <div className="text-base mt-4 text-white">
          {usecaseDescription ||
            "Learn about the startups and technologies revolutionizing the industry."}
        </div>
      </div>

      <div className="mx-3 flex flex-col gap-8">
        {detailedStartups.length > 0 ? (
          detailedStartups.map((startup, index) => (
            <div
              key={index}
              className="shadow-md border-2 rounded-md px-3 py-4"
            >
              <div className="font-bold">{startup.name}</div>
              <div className="flex items-center justify-between gap-4 mt-2">
                <div className="text-sm">
                  {startup.description || "No description available."}
                </div>
                <div className="relative -mt-7 w-3/6  flex justify-center">
                  <Image
                    src={startup.logo || "/placeholder-image.png"}
                    alt="Startup Logo"
                    width={600}
                    height={600}
                  />
                </div>
              </div>
              <div className="flex justify-between mt-3">
                <button
                  className="inline-flex items-center text-[#0081CA] py-1 px-2 rounded border border-[#0081CA]"
                  onClick={() => handleExploreClick(startup)}
                >
                  Explore <CiGlobe className="ml-2" />
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

const Ecosystem: React.FC<{
  startups: any[];
  usecase: string;
  usecaseDescription: string;
}> = ({ startups, usecase, usecaseDescription }) => {
  const [selectedStartup, setSelectedStartup] = useState<any | null>(null); // State to store selected startup

  const router = useRouter();

  const handleExploreClick = (selectedStartup: any) => {
    setSelectedStartup(selectedStartup); // Set selected startup and navigate to StartupProfile
  };

  const handleBackClick = () => {
    setSelectedStartup(null); // Reset selected startup to navigate back to Ecosystem
  };

  return selectedStartup ? (
    <div className="mt-20">
      <StartupProfile
        selectedStartup={selectedStartup}
        onBackClick={handleBackClick}
        queryForConnect="From trends"
      />
    </div>
  ) : (
    <EcosystemContent
      startups={startups}
      usecase={usecase}
      usecaseDescription={usecaseDescription}
      handleExploreClick={handleExploreClick}
    />
  );
};

export default Ecosystem;
