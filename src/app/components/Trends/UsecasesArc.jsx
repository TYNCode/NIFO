import React, { useState } from "react";
import sectorsData from "../../data/sector_data.json"; // Import the JSON data

const UsecasesArc = ({ selectedIndustry, selectedTechnology }) => {
  const radius1 = 220; // Radius of the first arc
  const radius2 = 339; // Radius of the second arc
  const centerX1 = 213; // Center the first arc's topmost dot horizontally
  const centerY1 = 1; // Y position for the first arc's topmost dot
  const centerX2 = 330; // Center the second arc's topmost dot horizontally
  const centerY2 = 1; // Y position for the second arc's topmost dot

  // Find the selected industry's data within the sectors
  const selectedSector = sectorsData.sectors.find((sector) =>
    sector.industries.some(
      (industry) => industry.industryName === selectedIndustry
    )
  );

  const selectedIndustryData = selectedSector
    ? selectedSector.industries.find(
        (industry) => industry.industryName === selectedIndustry
      )
    : null;

  const technologyNames = selectedIndustryData
    ? selectedIndustryData.technologies.map((tech) => tech.technologyName)
    : [];

  // Find the index of the selected industry and technology
  const selectedIndustryIndex = selectedIndustryData
    ? selectedSector.industries
        .map((industry) => industry.industryName)
        .indexOf(selectedIndustry)
    : -1;

  const selectedTechnologyIndex = technologyNames.indexOf(selectedTechnology);

  // Determine the industries and technologies to display along with their neighbors
  const displayedIndustries =
    selectedIndustryIndex !== -1
      ? [
          selectedSector.industries[
            (selectedIndustryIndex - 1 + selectedSector.industries.length) %
              selectedSector.industries.length
          ].industryName,
          selectedIndustry,
          selectedSector.industries[
            (selectedIndustryIndex + 1) % selectedSector.industries.length
          ].industryName,
        ]
      : [
          "No Industries Available",
          "No Industries Available",
          "No Industries Available",
        ];

  const displayedTechnologies =
    selectedTechnologyIndex !== -1
      ? [
          technologyNames[
            (selectedTechnologyIndex - 1 + technologyNames.length) %
              technologyNames.length
          ],
          selectedTechnology,
          technologyNames[
            (selectedTechnologyIndex + 1) % technologyNames.length
          ],
        ]
      : [
          "No Technologies Available",
          "No Technologies Available",
          "No Technologies Available",
        ];

  const [currentIndexArc1, setCurrentIndexArc1] = useState(
    selectedIndustryIndex
  );
  const [currentIndexArc2, setCurrentIndexArc2] = useState(
    selectedTechnologyIndex
  );
  const [startXArc1, setStartXArc1] = useState(null);
  const [startXArc2, setStartXArc2] = useState(null);
  const [isAnimatingArc1, setIsAnimatingArc1] = useState(false);
  const [isAnimatingArc2, setIsAnimatingArc2] = useState(false);

  // Define the fixed positions for the three dots along each arc
  const fixedAnglesArc1 = [
    -Math.PI / 2, // Top center (90°)
    -Math.PI / 4, // Middle right (45°)
    0, // Bottom right (0°)
  ];

  const fixedAnglesArc2 = [
    -Math.PI / 2, // Top center (90°)
    -Math.PI / 4, // Middle right (30°)
    0, // Bottom right (0°)
  ];

  // Handlers for the first arc
  const handleTouchStartArc1 = (e) => {
    if (isAnimatingArc1) return;
    setStartXArc1(e.touches[0].clientX);
  };

  const handleTouchMoveArc1 = (e) => {
    if (startXArc1 === null || isAnimatingArc1) return;

    const deltaX = e.touches[0].clientX - startXArc1;

    if (deltaX > 50) {
      handleScrollArc1("prev");
      setStartXArc1(e.touches[0].clientX);
    } else if (deltaX < -50) {
      handleScrollArc1("next");
      setStartXArc1(e.touches[0].clientX);
    }
  };

  const handleTouchEndArc1 = () => {
    setStartXArc1(null);
  };

  const handleScrollArc1 = (direction) => {
    setIsAnimatingArc1(true);

    setTimeout(() => {
      setCurrentIndexArc1((prevIndex) =>
        direction === "next"
          ? (prevIndex + 1) % displayedIndustries.length
          : (prevIndex - 1 + displayedIndustries.length) %
            displayedIndustries.length
      );
      setIsAnimatingArc1(false);
    }, 500);
  };

  // Handlers for the second arc
  const handleTouchStartArc2 = (e) => {
    if (isAnimatingArc2) return;
    setStartXArc2(e.touches[0].clientX);
  };

  const handleTouchMoveArc2 = (e) => {
    if (startXArc2 === null || isAnimatingArc2) return;

    const deltaX = e.touches[0].clientX - startXArc2;

    if (deltaX > 50) {
      handleScrollArc2("prev");
      setStartXArc2(e.touches[0].clientX);
    } else if (deltaX < -50) {
      handleScrollArc2("next");
      setStartXArc2(e.touches[0].clientX);
    }
  };

  const handleTouchEndArc2 = () => {
    setStartXArc2(null);
  };

  const handleScrollArc2 = (direction) => {
    setIsAnimatingArc2(true);

    setTimeout(() => {
      setCurrentIndexArc2((prevIndex) =>
        direction === "next"
          ? (prevIndex + 1) % displayedTechnologies.length
          : (prevIndex - 1 + displayedTechnologies.length) %
            displayedTechnologies.length
      );
      setIsAnimatingArc2(false);
    }, 500);
  };

  return (
    <div>
      <div className="relative flex justify-end items-start select-none">
        {/* First Arc */}
        <div
          onTouchStart={handleTouchStartArc1}
          onTouchMove={handleTouchMoveArc1}
          onTouchEnd={handleTouchEndArc1}
        >
          <img src="/circleup1.svg" alt="" className="w-40" />
        </div>

        <div className="absolute">
          <div className="relative w-60">
            <div>
              <img src="/circleup2.svg" alt="" className="w-60" />
              {/* Add BFSI text inside the innermost arc */}
              <div className="absolute top-20 right-4 flex justify-center items-center">
                <span className="text-lg font-semibold uppercase text-gray-700">
                  BFSI
                </span>
              </div>
            </div>
            {fixedAnglesArc1.map((angle, index) => {
              const isMiddleDot = index === 1; // Middle dot is at index 1
              const newAngle = angle + (isAnimatingArc1 ? Math.PI / 4 : 0);
              const x = centerX1 + radius1 * Math.sin(newAngle);
              const y = centerY1 + radius1 * Math.cos(newAngle);

              return (
                <div
                  key={index}
                  className={`absolute transition-all duration-500 ease-in-out`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  <div
                    className={`relative rounded-full shadow-lg ${
                      isMiddleDot
                        ? "bg-[#3AB8FF] border-2 border-[#FFEFA7] w-7 h-7"
                        : "bg-[#D8D8D8] w-6 h-6"
                    }`}
                  >
                    <div
                      className={`absolute right-full mr-4 text-black text-sm w-32 text-right ${
                        isMiddleDot ? "font-semibold text-base" : ""
                      }`}
                    >
                      {
                        displayedIndustries[
                          (currentIndexArc1 + index) %
                            displayedIndustries.length
                        ]
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Second Arc */}
        <div
          className="absolute"
          onTouchStart={handleTouchStartArc2}
          onTouchMove={handleTouchMoveArc2}
          onTouchEnd={handleTouchEndArc2}
        >
          <div className="relative w-[360px]">
            <div>
              <img src="/circleup2.svg" alt="" className="w-[360px]" />
            </div>
            {fixedAnglesArc2.map((angle, index) => {
              const isMiddleDot = index === 1; // Middle dot is at index 1
              const newAngle = angle + (isAnimatingArc2 ? Math.PI / 4 : 0);
              const x = centerX2 + radius2 * Math.sin(newAngle);
              const y = centerY2 + radius2 * Math.cos(newAngle);

              return (
                <div
                  key={index}
                  className={`absolute transition-all duration-500 ease-in-out`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  <div
                    className={`relative rounded-full shadow-lg ${
                      isMiddleDot
                        ? "bg-[#3AB8FF] border-2 border-[#FFEFA7] w-7 h-7"
                        : "bg-[#D8D8D8] w-6 h-6"
                    }`}
                  >
                    <div
                      className={`absolute right-full mr-4 text-black text-sm w-32 text-right ${
                        isMiddleDot ? "font-semibold text-base" : ""
                      }`}
                    >
                      {
                        displayedTechnologies[
                          (currentIndexArc2 + index) %
                            displayedTechnologies.length
                        ]
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsecasesArc;
