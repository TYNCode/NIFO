import React, { useState } from "react";
import sectorsData from "../../data/data_sector.json";

const IndustriesUp = ({ selectedIndustry, selectedSector }) => {
  const radius = 164;
  const centerX = 168;
  const centerY = 12;

  const sector = sectorsData.sectors.find(
    (sector) => sector.sector === selectedSector
  );


  const industryNames = sector ? Object.keys(sector.subSectors) : ["No Industries Available"];

  const selectedIndex = industryNames.indexOf(selectedIndustry);

  const displayedIndustries =
    selectedIndex !== -1
      ? [
          industryNames[
            (selectedIndex - 1 + industryNames.length) % industryNames.length
          ],
          industryNames[selectedIndex],
          industryNames[(selectedIndex + 1) % industryNames.length],
        ]
      : [
          "No Industries Available",
          "No Industries Available",
          "No Industries Available",
        ];

  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [startX, setStartX] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const middleIndex = Math.floor(displayedIndustries.length / 2);

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
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % industryNames.length
          : (currentIndex - 1 + industryNames.length) % industryNames.length;
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 500);
  };

  const fixedAngles = [-Math.PI / 2, -Math.PI / 4, 0];

  return (
    <div
      className="relative bg-gray-100 flex justify-end items-start select-none mt-16"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div>
        <img src="/circleup1.svg" alt="" className="w-32" />
      </div>

      <div className="absolute">
        <div className="relative w-44">
          <div>
            <img src="/circleup2.svg" alt="" className="w-44" />
            <div className="absolute top-10 right-4 flex justify-center items-center">
              <span className="text-lg font-semibold uppercase text-gray-700">
                BFSI
              </span>
            </div>
          </div>
          {displayedIndustries.map((industry, index) => {
            const isMiddleDot = index === middleIndex;
            const angle = fixedAngles[index];
            const x =
              centerX + radius * Math.sin(angle) - (isMiddleDot ? 14 : 12);
            const y =
              centerY + radius * Math.cos(angle) - (isMiddleDot ? 14 : 12);

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
                      : "bg-[#D8D8D8] w-5 h-5"
                  }`}
                >
                  <div
                    className={`absolute right-full mr-2 top-2  text-sm w-32 text-right ${
                      isMiddleDot
                        ? "font-semibold text-base text-[#4C4C4C]"
                        : "text-[#797979]"
                    }`}
                  >
                    {industry}
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

export default IndustriesUp;
