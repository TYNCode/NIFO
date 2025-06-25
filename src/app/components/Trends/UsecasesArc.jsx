import React, { useEffect, useState } from "react";

const UsecasesArc = ({ selectedSector, selectedIndustry }) => {
  const radius1 = 165;
  const radius2 = 285;
  const centerX1 = 155;
  const centerY1 = 0;
  const centerX2 = 278;
  const centerY2 = 1;

  const [sectors, setSectors] = useState([]);
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await fetch("https://tyn-server.azurewebsites.net/api/trends/");
        const data = await res.json();

        const allSectors = [...new Set(data.map((item) => item.sector))];
        const allIndustries = data
          .filter((item) => item.sector === selectedSector)
          .map((item) => item.industry);
        const uniqueIndustries = [...new Set(allIndustries)];

        setSectors(allSectors);
        setIndustries(uniqueIndustries);
      } catch (err) {
        console.error("Error fetching trends:", err);
      }
    };

    if (selectedSector) fetchTrends();
  }, [selectedSector]);

  const getSurroundingItems = (list, currentItem) => {
    const index = list.indexOf(currentItem);
    if (index === -1 || list.length < 3)
      return ["Not Found", currentItem, "Not Found"];

    return [
      list[(index - 1 + list.length) % list.length],
      list[index],
      list[(index + 1) % list.length],
    ];
  };

  const displayedSectors = getSurroundingItems(sectors, selectedSector);
  const displayedIndustries = getSurroundingItems(industries, selectedIndustry);

  const fixedAnglesArc1 = [-Math.PI / 2, -Math.PI / 4, 0];
  const fixedAnglesArc2 = [-Math.PI / 2, -Math.PI / 4, 0];

  return (
    <div className="relative flex justify-end items-start select-none ">
      <div className="absolute">
        <img src="/circleup1.svg" alt="Arc 1" className="w-32" />
      </div>
      <div className="absolute">
        <div className="relative w-44">
          <img src="/circleup2.svg" alt="Arc 2" className="w-44" />
          <div className="absolute top-10 right-4 flex justify-center items-center">
            <span className="text-lg font-semibold uppercase text-gray-700" title={selectedSector}>
              {selectedSector?.slice(0, 4)}
            </span>
          </div>

          {fixedAnglesArc1.map((angle, index) => {
            const isMiddleDot = index === 1;
            const x = centerX1 + radius1 * Math.sin(angle);
            const y = centerY1 + radius1 * Math.cos(angle);

            return (
              <div
                key={index}
                className="absolute transition-all duration-500 ease-in-out"
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                <div className={`relative rounded-full shadow-lg ${isMiddleDot ? "bg-[#3AB8FF] border-2 border-[#FFEFA7] w-7 h-7" : "bg-[#D8D8D8] w-5 h-5"}`}>
                  <div className={`absolute right-full mr-2 top-2 text-sm w-24 text-right ${isMiddleDot ? "font-semibold text-base text-[#4C4C4C]" : "text-[#797979]"}`}>
                    {displayedSectors[index]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outer Circle – Industry */}
      <div>
        <div className="relative w-[300px]">
          <img src="/circleup2.svg" alt="Arc 2" className="w-[300px]" />
          {fixedAnglesArc2.map((angle, index) => {
            const isMiddleDot = index === 1;
            const x = centerX2 + radius2 * Math.sin(angle);
            const y = centerY2 + radius2 * Math.cos(angle);

            return (
              <div
                key={index}
                className="absolute transition-all duration-500 ease-in-out"
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                <div className={`relative rounded-full shadow-lg ${isMiddleDot ? "bg-[#3AB8FF] border-2 border-[#FFEFA7] w-7 h-7" : "bg-[#D8D8D8] w-5 h-5"}`}>
                  <div className={`absolute right-full mr-2 top-2 text-sm w-[100px] text-right ${isMiddleDot ? "font-semibold text-base text-[#4C4C4C]" : "text-[#797979]"}`}>
                    {displayedIndustries[index]}
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

export default UsecasesArc;
