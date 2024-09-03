"use client";
import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import sectors from "../data/sectors.json"; // Sectors data
import industriesBySector from "../data/industriesBySectors.json"; // Industries by sector data
import trendsData from "../data/trendsData.json"; // Trends data

interface TrendsProps {}

const Trends: React.FC<TrendsProps> = () => {
  const [sectorDropdownOpen, setSectorDropdownOpen] = useState(false);
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState("Select Sector");
  const [selectedIndustry, setSelectedIndustry] = useState("Select Industry");

  // Toggle sector dropdown
  const toggleSectorDropdown = () => {
    setSectorDropdownOpen(!sectorDropdownOpen);
    setIndustryDropdownOpen(false); // Close industry dropdown when sector dropdown is toggled
  };

  // Handle sector selection
  const handleSectorSelect = (sector: string) => {
    setSelectedSector(sector);
    setSectorDropdownOpen(false);
    setIndustryDropdownOpen(false); // Close industry dropdown initially
    setSelectedIndustry("Select Industry"); // Reset selected industry
  };

  // Handle industry selection
  const handleIndustrySelect = (industry: string) => {
    setSelectedIndustry(industry);
    setIndustryDropdownOpen(false);
  };

  // Get the trends data for the selected industry
  const trendsForSelectedIndustry =
    selectedIndustry !== "Select Industry"
      ? trendsData[selectedIndustry] || []
      : [];

  return (
    <div className="flex flex-col items-center">
      <div>
        <img src="nifoimage.png" alt="The Yellow Network" className="w-48" />
      </div>

      <div className="bg-white shadow-xl px-8 py-2 rounded-md mt-16">
        <div className="flex gap-16 justify-center items-center">
          <div className="font-semibold">Map View</div>
          <div className="font-semibold">Card View</div>
        </div>
      </div>

      <div className="flex flex-row mt-12 gap-4">
        <div className="relative flex flex-col items-center">
          <div
            className="flex bg-white shadow-xl px-2 py-2 border justify-between gap-4 items-center rounded-md cursor-pointer"
            onClick={toggleSectorDropdown}
          >
            <div>{selectedSector}</div>
            <div>
              {sectorDropdownOpen ? (
                <IoIosArrowUp size={23} />
              ) : (
                <IoIosArrowDown size={23} />
              )}
            </div>
          </div>
          {sectorDropdownOpen && (
            <div className="absolute top-12 bg-white border rounded-md shadow-lg w-full max-h-48 overflow-y-auto">
              {sectors.map((sector) => (
                <div
                  key={sector}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSectorSelect(sector)}
                >
                  {sector}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex flex-col items-center">
          <div
            className={`flex bg-white shadow-xl px-2 py-2 border justify-between gap-4 items-center rounded-md ${
              selectedSector === "Select Sector"
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
            onClick={() =>
              selectedSector !== "Select Sector" &&
              setIndustryDropdownOpen(!industryDropdownOpen)
            }
          >
            <div>{selectedIndustry}</div>
            <div>
              {industryDropdownOpen ? (
                <IoIosArrowUp size={23} />
              ) : (
                <IoIosArrowDown size={23} />
              )}
            </div>
          </div>
          {industryDropdownOpen &&
            selectedSector !== "Select Sector" &&
            industriesBySector[selectedSector] && (
              <div className="absolute top-12 bg-white border rounded-md shadow-lg w-full max-h-48 overflow-y-auto">
                {industriesBySector[selectedSector].map((industry) => (
                  <div
                    key={industry}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleIndustrySelect(industry)}
                  >
                    {industry}
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Render trends as cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendsForSelectedIndustry.map((trend, index) => (
          <div
            key={index}
            className="bg-white shadow-xl p-6 rounded-md border border-gray-200"
          >
            <h3 className="font-semibold text-lg mb-2">
             {trend.SubIndustry}
            </h3>
            <p className="text-gray-700">
              <strong>Use Case:</strong> {trend.UseCases[0].UseCase}
            </p>
            <p className="text-gray-700">
              <strong>Company:</strong> {trend.UseCases[0].Company}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trends;
