import React, { useState } from "react";
import sectorsData from "../../data/sector_data.json"; // Import the JSON data

const Sectors = ({ onSectorClick }) => {
  const radius = 180; // Radius of the circle
  const centerX = 170; // Center of the circle on x-axis
  const centerY = 170; // Center of the circle on y-axis

  // Extract sector names from the sectors data and limit to the first 8 items
  const sectorNames = sectorsData.sectors
    .map((sector) => sector.sectorName)
    .slice(0, 8);

  const totalPositions = sectorNames.length; // Use the actual number of sectors
  const highlightedPosition = Math.floor(totalPositions / 2); // Middle position or close to it

  const [currentIndex, setCurrentIndex] = useState(3); // Index of the highlighted dot
  const [rotationOffset, setRotationOffset] = useState(0); // Track rotation
  const [isAnimating, setIsAnimating] = useState(false);
  const [startX, setStartX] = useState(null); // Initialize startX state

  const handleTouchStart = (e) => {
    if (isAnimating) return; // Prevent interaction during animation
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startX === null || isAnimating) return;

    const deltaX = e.touches[0].clientX - startX;

    if (Math.abs(deltaX) > 20) {
      // Invert the logic here
      handleScroll(deltaX > 0 ? "next" : "prev"); // Inverted logic: Right swipe (positive deltaX) should go to "next"
      setStartX(e.touches[0].clientX); // Update startX
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
    }, 500); // Match this duration with the CSS transition duration
  };

  return (
    <div className="relative flex flex-col justify-between h-screen overflow-hidden bg-gray-100">
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
        {/* Sector image, positioned independently */}
        <div className="">
          <img src="/circle.svg" alt="Sector" className="w-32" />
        </div>

        {/* Dots rotating around the center */}
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

              // Highlight the dot based on the current index
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
