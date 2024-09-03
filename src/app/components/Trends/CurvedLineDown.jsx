import React, { useState } from "react";
import sectorsData from "../../data/sector_data.json"; // Import the JSON data

const CurvedLineDown = ({ selectedSector, onIndustryClick }) => {
  const radius = 160;
  const centerX = 150;
  const centerY = 150;

  // Find the selected sector's data
  const selectedSectorData = sectorsData.sectors.find(
    (sector) => sector.sectorName === selectedSector
  );


  // Extract industry names based on the selected sector
  const industryNames = selectedSectorData
    ? selectedSectorData.industries.map((industry) => industry.industryName)
    : ["No Industries Found"];

    const totalPositions = 8;
    const highlightedPosition = 3;

    const [dots, setDots] = useState(
      Array.from(
        {
          length: totalPositions,
        },
        (_, i) => industryNames[i % industryNames.length]
      )
    );


  const [currentIndex, setCurrentIndex] = useState(0);
   const [rotationOffset, setRotationOffset] = useState(0);
  const [startX, setStartX] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTouchStart = (e) => {
    if (isAnimating) return;
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startX === null || isAnimating) return;

    const deltaX = e.touches[0].clientX - startX;

     if (Math.abs(deltaX) > 20) {
       handleScroll(deltaX > 0 ? "prev" : "next");
       setStartX(e.touches[0].clientX); 
     }
  };

  const handleTouchEnd = () => {
    setStartX(null);
  };

  const handleScroll = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (direction === "next") {
      setRotationOffset(
        (prevOffset) => prevOffset - (2 * Math.PI) / totalPositions
      );
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPositions);
    } else if (direction === "prev") {
      setRotationOffset(
        (prevOffset) => prevOffset + (2 * Math.PI) / totalPositions
      );
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + totalPositions) % totalPositions
      );
    }

      setTimeout(() => {
        setIsAnimating(false);
      }, 500); 
  };

  return (
    <div
      className="relative bg-gray-100 flex justify-end items-end select-none mb-20 "
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
            {/* Add the selected sector name here */}
            <div className="absolute bottom-10 right-2 flex justify-center items-center">
              <span className="text-base font-semibold uppercase text-gray-700">
                INDUSTRY
              </span>
            </div>
          </div>
          {Array.from({ length: totalPositions }).map((_, index) => {
            const angle =
              (index / totalPositions) * 2 * Math.PI + rotationOffset;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY - radius * Math.sin(angle);

            // Highlight the dot based on the current index
            const isHighlighted =
              index === (currentIndex + highlightedPosition) % totalPositions;

            return (
              <div
                key={index}
                className={`absolute transition-all duration-500 ease-in-out`}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  visibility: "visible",
                }}
              >
                <div
                  className={`relative rounded-full shadow-lg cursor-pointer ${
                    isHighlighted
                      ? "bg-[#3AB8FF] border-2 border-[#FFEFA7] w-7 h-7"
                      : "bg-[#D8D8D8] w-6 h-6"
                  }`}
                  onClick={() =>
                    onIndustryClick(
                      industryNames[
                        (currentIndex + index) % industryNames.length
                      ]
                    )
                  }
                >
                  <div
                    className={`absolute right-full mr-4 text-black text-sm w-32 text-right ${
                      isHighlighted ? "font-semibold text-base" : ""
                    }`}
                  >
                    {
                      industryNames[
                        (currentIndex + index) % industryNames.length
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

export default CurvedLineDown;
