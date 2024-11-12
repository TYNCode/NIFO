import React, { useState } from "react";
import sectorData from "../../data/sector_data.json";
import sectorsData from "../../data/data_sector.json";

const Sectors = ({ onSectorClick }) => {
  const radius = 180;
  const centerX = 170;
  const centerY = 170;

  const sectors = sectorsData.sectors;

  const getInitialSectorData = ()=>{
     return sectors.slice(0, 8).map((sector) => ({
      sectorName: sector.sector,
     }));
  }

  const [outerCircleData, setOuterCircleData] = useState(getInitialSectorData());

  const sectorNames = outerCircleData.map((item)=>item.sectorName)
  const totalPositions = sectorNames.length;
  const highlightedPosition = Math.floor(totalPositions / 2);

  const [currentIndex, setCurrentIndex] = useState(3);
  const [rotationOffset, setRotationOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [startX, setStartX] = useState(null);

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
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sectorNames.length);
    } else if (direction === "prev") {
      setRotationOffset(
        (prevOffset) => prevOffset + (2 * Math.PI) / totalPositions
      );
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + sectorNames.length) % sectorNames.length
      );
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="relative flex flex-col justify-between h-[100dvh] overflow-hidden bg-gray-100">
      <div>
        <div className="">
          <img src="/sector_default.png" alt="" className="" />
        </div>
        <div className="bg-[#005585] flex flex-col px-4 py-4 gap-2">
          <div className="flex text-lg text-white font-medium">
            TYN Industry trends outlook
          </div>
          <div className="flex text-base text-white font-light">
            Get Contextualize industry trends which most big players adopted
          </div>
        </div>
      </div>

      <div
        className="relative w-screen flex justify-end items-end select-none pb-20"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="">
          <img src="/circle.svg" alt="Sector" className="w-32" />
        </div>

        <div className="absolute">
          <div className="relative w-48">
            <div className="relative">
              <img
                src="/circle2.svg"
                alt="Inner Arc"
                className="relative w-48 z-0"
              />
              <div className="absolute bottom-10 right-4 flex justify-center items-center z-50">
                <span className="text-lg font-semibold uppercase text-gray-700">
                  Sector
                </span>
              </div>
            </div>
            {sectorNames.map((sectorName, index) => {
              const angle =
                (index / totalPositions) * 2 * Math.PI + rotationOffset;
              const x = centerX + radius * Math.cos(angle);
              const y = centerY - radius * Math.sin(angle);

              const isHighlighted = index === currentIndex;

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
                    className={`relative rounded-full shadow-lg ${
                      isHighlighted
                        ? "bg-[#3AB8FF] border-2 border-[#FFEFA7] w-7 h-7"
                        : "bg-[#D8D8D8] w-5 h-5"
                    }`}
                  >
                    <div
                      className={`absolute right-full mr-2 bottom-2 text-sm w-32 text-right ${
                        isHighlighted
                          ? "font-semibold text-base text-[#4C4C4C]"
                          : "text-[#797979]"
                      } cursor-pointer`}
                      onClick={() => onSectorClick(sectorName)}
                    >
                      {sectorName}
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

export default Sectors;
