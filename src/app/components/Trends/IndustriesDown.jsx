import React, { useState, useEffect, useRef } from "react";
import sectorsData from "../../data/data_sector.json";

const duplicateArrayUntilLength = (arr, targetLength) => {
  const result = [];
  while (result.length < targetLength) {
    result.push(...arr);
  }
  return result.slice(0, targetLength);
};

const IndustriesDown = ({
  selectedIndustry,
  selectedSector,
  onTechnologyClick,
  onTechnologiesUpdate,
}) => {
  const radius = 160;
  const centerX = 150;
  const centerY = 150;

  const sector = sectorsData.sectors.find(
    (sector) => sector.sector === selectedSector
  );

 const subSector = sector ? sector.subSectors[selectedIndustry] : null;
 const technologyTrend = subSector ? subSector.map(technologyTrend => technologyTrend) : "No Technology Trends Available";
 const technologyNames = technologyTrend.length
  ? technologyTrend.map((tech) => tech.technologyTrend)
  : ["No Technology Trends Available"];


 const totalPositions = 8;
 const duplicatedTechnologies = duplicateArrayUntilLength( technologyNames, totalPositions);
  const prevTechnologyNames = useRef(technologyNames);

  useEffect(() => {
    if (
      JSON.stringify(prevTechnologyNames.current) !==
      JSON.stringify(technologyNames)
    ) {
      onTechnologiesUpdate(technologyNames);
      prevTechnologyNames.current = technologyNames;
    }
  }, [technologyNames, onTechnologiesUpdate]);

  const [currentIndex, setCurrentIndex] = useState(7);
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
      handleScroll(deltaX > 0 ? "next" : "prev");
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

  const highlightedPosition = Math.floor(totalPositions / 2);

  return (
    <div
      className="relative bg-gray-100 flex justify-end items-end select-none mb-20"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="z-10">
        <img src="/circle.svg" alt="" className="w-32" />
      </div>

      <div className="absolute">
        <div className="relative w-44">
          <div>
            <img src="/circle2.svg" alt="" className="w-44" />
            <div className="absolute bottom-7 right-2 flex justify-center items-center flex-col z-20">
              <span className="text-[12px] font-semibold uppercase text-gray-700">
                Technology
              </span>
              <span className="text-[12px] font-semibold uppercase text-gray-700">
                Trend
              </span>
            </div>
          </div>
          {duplicatedTechnologies.map((tech, index) => {
            const angle =
              (index / totalPositions) * 2 * Math.PI + rotationOffset;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY - radius * Math.sin(angle);

            const isHighlighted =
              (currentIndex + highlightedPosition) % totalPositions === index;

            return (
              <div
                key={index}
                className={`absolute transition-all duration-500 ease-in-out`}
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                <div
                  className={`relative rounded-full shadow-lg cursor-pointer ${
                    isHighlighted
                      ? "bg-[#3AB8FF] border-2 border-[#FFEFA7] w-7 h-7"
                      : "bg-[#D8D8D8] w-6 h-6"
                  }`}
                  onClick={() => onTechnologyClick(tech)}
                >
                  <div
                    className={`absolute right-full mr-2 bottom-2 text-sm w-32 text-right ${
                      isHighlighted
                        ? "font-semibold text-base text-[#4C4C4C]"
                        : "text-[#797979]"
                    }`}
                  >
                    {tech}
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
