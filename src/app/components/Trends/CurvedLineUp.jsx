import React, { useEffect, useState } from "react";

const CurvedLineUp = ({ selectedSector }) => {
  const radius = 164;
  const centerX = 168;
  const centerY = 12;
  const fixedAngles = [-Math.PI / 2, -Math.PI / 4, 0];
  const middleIndex = Math.floor(fixedAngles.length / 2);

  const [sectorNames, setSectorNames] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch("https://tyn-server.azurewebsites.net/api/api/trends/options/");
        const data = await response.json();

        const sectors = (data.sectors || []).map((s) => s.value);
        setSectorNames(sectors);
      } catch (err) {
        console.error("Failed to fetch sectors:", err);
      }
    };

    fetchSectors();
  }, []);

  const selectedIndex = sectorNames.indexOf(selectedSector);
  const displayedSectors =
    selectedIndex !== -1
      ? [
        sectorNames[(selectedIndex - 1 + sectorNames.length) % sectorNames.length],
        sectorNames[selectedIndex],
        sectorNames[(selectedIndex + 1) % sectorNames.length],
      ]
      : ["No Sectors", "No Sectors", "No Sectors"];

  return (
    <div className="relative flex justify-end items-start select-none">
      <div className="absolute">
        <img src="/circleup1.svg" alt="" className="w-32" />
      </div>

      <div className="absolute">
        <div className="relative w-44">
          <img src="/circleup2.svg" alt="" className="w-44" />
          <div className="absolute top-10 right-4 flex justify-center items-center">
            <span className="text-base font-semibold uppercase text-gray-700">
              SECTOR
            </span>
          </div>

          {fixedAngles.map((angle, index) => {
            const isMiddleDot = index === middleIndex;
            const newAngle = angle + (isAnimating ? Math.PI / 4 : 0);
            const x = centerX + radius * Math.sin(newAngle) - (isMiddleDot ? 14 : 12);
            const y = centerY + radius * Math.cos(newAngle) - (isMiddleDot ? 14 : 12);

            return (
              <div
                key={index}
                className="absolute transition-all duration-500 ease-in-out"
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                <div
                  className={`relative rounded-full shadow-lg ${isMiddleDot
                      ? "bg-[#3AB8FF] border-2 border-[#FFEFA7] w-7 h-7"
                      : "bg-[#D8D8D8] w-5 h-5"
                    }`}
                >
                  <div
                    className={`absolute right-full mr-2 top-2 text-sm w-32 text-right ${isMiddleDot
                        ? "font-semibold text-base text-[#4C4C4C]"
                        : "text-[#797979]"
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
