import React, { useState } from "react";
import sectorsData from "../../data/sector_data.json"; // Import the JSON data
import { loginUser } from './../../redux/features/auth/loginSlice';

const IndustriesDown = ({ selectedIndustry, onTechnologyClick }) => {
 const radius = 160;
 const centerX = 150;
 const centerY = 150;
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

  // Extract technology names based on the selected industry
  const technologyNames = selectedIndustryData
    ? selectedIndustryData.technologies.map((tech) => tech.technologyName)
    : ["No Technologies Available"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTouchStart = (e) => {
    if (isAnimating) return;
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startX === null || isAnimating) return;

    const deltaX = e.touches[0].clientX - startX;

    if (deltaX > 50) {
      handleScroll("prev");
      setStartX(e.touches[0].clientX);
    } else if (deltaX < -50) {
      handleScroll("next");
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setStartX(null);
  };

  const handleScroll = (direction) => {
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        direction === "next"
          ? (prevIndex + 1) % technologyNames.length
          : (prevIndex - 1 + technologyNames.length) % technologyNames.length
      );
      setIsAnimating(false);
    }, 500);
  };

  const fixedAngles = [Math.PI, (3 * Math.PI) / 4, Math.PI / 2];
  const middleIndex = Math.floor(fixedAngles.length / 2);

  return (
    <div
      className="relative bg-gray-100 flex justify-end items-end select-none mb-20"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div>
        <img src="/circle.svg" alt="" className="w-32" />
      </div>

      <div className="absolute">
        <div className="relative w-44">
          <div>
            <img src="/circle2.svg" alt="" className="w-44" />
            {/* Add the currently selected technology name here */}
            <div className="absolute bottom-10 right-2 flex justify-center items-center">
              <span className="text-[12px] font-semibold uppercase text-gray-700">
                SUB INDUSTRY
              </span>
            </div>
          </div>
          {fixedAngles.map((angle, index) => {
            const isMiddleDot = index === middleIndex; // Check if this is the middle dot
            const newAngle = angle + (isAnimating ? Math.PI / 4 : 0);
            const x = centerX + radius * Math.cos(newAngle);
            const y = centerY - radius * Math.sin(newAngle);

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
                  onClick={() =>
                    onTechnologyClick(
                      technologyNames[
                        (currentIndex + index) % technologyNames.length
                      ]
                    )
                  }
                >
                  <div
                    className={`absolute right-full mr-4 text-black text-sm w-32 text-right ${
                      isMiddleDot ? "font-semibold text-base" : ""
                    }`}
                  >
                    {
                      technologyNames[
                        (currentIndex + index) % technologyNames.length
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
  );
};

export default IndustriesDown;
