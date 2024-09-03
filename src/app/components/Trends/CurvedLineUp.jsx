import React, { useState, useEffect } from "react";
import sectorsData from "../../data/sector_data.json"; // Import the JSON data

const CurvedLineUp = ({ selectedSector }) => {
  const radius = 224; // Radius of the curve
  const centerX = 226; // Center the topmost dot horizontally
  const centerY = 10; // Y position for the topmost dot (you can adjust this for your design)

  // Extract sector names from the JSON data
  const sectorNames = sectorsData.sectors.map((sector) => sector.sectorName);

  // Define the fixed positions for the three dots along the curve
  const fixedAngles = [
    -Math.PI / 2, // Top center (90°)
    -Math.PI / 4, // Middle right (45°)
    0, // Bottom right (0°)
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const middleIndex = Math.floor(fixedAngles.length / 2);

  // Find the index of the selected sector
  const selectedIndex = sectorNames.indexOf(selectedSector);

  // Determine the sectors to display
  const displayedSectors =
    selectedIndex !== -1
      ? [
          sectorNames[
            (selectedIndex - 1 + sectorNames.length) % sectorNames.length
          ],
          sectorNames[selectedIndex],
          sectorNames[(selectedIndex + 1) % sectorNames.length],
        ]
      : [
          "No Sectors Available",
          "No Sectors Available",
          "No Sectors Available",
        ];

  const handleTouchStart = (e) => {
    if (isAnimating) return; // Prevent interaction during animation
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startX === null || isAnimating) return;

    const deltaX = e.touches[0].clientX - startX;

    if (deltaX > 50) {
      handleScroll("prev");
      setStartX(e.touches[0].clientX); // Reset startX to the new position
    } else if (deltaX < -50) {
      handleScroll("next");
      setStartX(e.touches[0].clientX); // Reset startX to the new position
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
          ? (selectedIndex + 1) % sectorNames.length
          : (selectedIndex - 1 + sectorNames.length) % sectorNames.length;
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 500); // Match this duration with the CSS transition duration
  };

  return (
    <div
      className="relative bg-gray-100 flex justify-end items-start select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div>
        <img src="/circleup1.svg" alt="" className="w-40" />
      </div>

      <div className="absolute">
        <div className="relative w-60">
          <div>
            <img src="/circleup2.svg" alt="" className="w-60" />
            {/* Add the selected sector name inside the innermost circle */}
            <div className="absolute top-20 right-4 flex justify-center items-center">
              <span className="text-base font-semibold uppercase text-gray-700">
                SECTOR
              </span>
            </div>
          </div>
          {fixedAngles.map((angle, index) => {
            const isMiddleDot = index === middleIndex; // Check if this is the middle dot
            const newAngle = angle + (isAnimating ? Math.PI / 4 : 0);
            const x =
              centerX + radius * Math.sin(newAngle) - (isMiddleDot ? 14 : 12);
            const y =
              centerY + radius * Math.cos(newAngle) - (isMiddleDot ? 14 : 12);

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
                    {displayedSectors[index]}
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

export default CurvedLineUp;
