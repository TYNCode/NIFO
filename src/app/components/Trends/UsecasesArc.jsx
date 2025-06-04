import React from "react";
import sectorsData from "../../data/data_sector.json";

const UsecasesArc = ({
  selectedSector,
  selectedIndustry,
  selectedTechnology,
}) => {  
  const radius1 = 165;
  const radius2 = 285;
  const centerX1 = 155;
  const centerY1 = 0;
  const centerX2 = 278;
  const centerY2 = 1;

  const selectedSectorData = sectorsData.sectors.find(
    (sector) => sector.sector === selectedSector
  );

  const sector = sectorsData.sectors.find(
    (sector) => sector.sector === selectedSector
  )

  const selectedIndustryData = selectedSectorData
    ? selectedSectorData.subSectors[selectedIndustry]
    : null;

  const allIndustries = selectedSectorData
    ? Object.keys(selectedSectorData.subSectors)
    : [];

  const technologyTrends = selectedIndustryData
    ? selectedIndustryData.map((tech) => tech.technologyTrend)
    : [];

  const selectedIndustryIndex = allIndustries.length
    ? allIndustries.indexOf(selectedIndustry)
    : -1;

  const selectedTechnologyIndex = technologyTrends.length
    ? technologyTrends.indexOf(selectedTechnology)
    : -1;

  const displayedIndustries =
    selectedIndustryIndex !== -1
      ? [
          allIndustries[
            (selectedIndustryIndex - 1 + allIndustries.length) %
              allIndustries.length
          ],
          selectedIndustry,
          allIndustries[(selectedIndustryIndex + 1) % allIndustries.length],
        ]
      : [
          "No Industries Available",
          "No Industries Available",
          "No Industries Available",
        ];

  const displayedTechnologies =
    selectedTechnologyIndex !== -1
      ? [
          technologyTrends[
            (selectedTechnologyIndex - 1 + technologyTrends.length) %
              technologyTrends.length
          ],
          selectedTechnology,
          technologyTrends[
            (selectedTechnologyIndex + 1) % technologyTrends.length
          ],
        ]
      : [
          "No Technologies Available",
          "No Technologies Available",
          "No Technologies Available",
        ];

  const fixedAnglesArc1 = [-Math.PI / 2, -Math.PI / 4, 0];
  const fixedAnglesArc2 = [-Math.PI / 2, -Math.PI / 4, 0];

  return (
    <div>
      <div className="relative flex justify-end items-start select-none mt-16">
        <div className="absolute">
          <img src="/circleup1.svg" alt="Arc 1" className="w-32" />
        </div>

        <div className="absolute">
          <div className="relative w-44">
            <div>
              <img src="/circleup2.svg" alt="Arc 2" className="w-44" />
              <div className="absolute top-10 right-4 flex justify-center items-center">
                <span
                  className="text-lg font-semibold uppercase text-gray-700 cursor-pointer"
                  title={selectedSector}
                >
                  {selectedSector?.slice(0, 4)}
                </span>
              </div>
            </div>
            {fixedAnglesArc1.map((angle, index) => {
              const isMiddleDot = index === 1;
              const x = centerX1 + radius1 * Math.sin(angle);
              const y = centerY1 + radius1 * Math.cos(angle);

              return (
                <div
                  key={index}
                  className={`absolute transition-all duration-500 ease-in-out`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  <div
                    className={`relative rounded-full shadow-lg ${
                      isMiddleDot
                        ? "bg-tertiary border-2 border-[#FFEFA7] w-7 h-7"
                        : "bg-[#D8D8D8] w-5 h-5"
                    }`}
                  >
                    <div
                      className={`absolute right-full mr-2 top-2 text-sm w-24 text-right ${
                        isMiddleDot
                          ? "font-semibold text-base text-[#4C4C4C]"
                          : "text-[#797979]"
                      }`}
                    >
                      {displayedIndustries[index]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="relative w-[300px]">
            <div>
              <img src="/circleup2.svg" alt="Arc 2" className="w-[300px]" />
            </div>
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
                  <div
                    className={`relative rounded-full shadow-lg ${
                      isMiddleDot
                        ? "bg-tertiary border-2 border-[#FFEFA7] w-7 h-7"
                        : "bg-[#D8D8D8] w-5 h-5"
                    }`}
                  >
                    <div
                      className={`absolute right-full mr-2 top-2 text-sm w-[100px] text-right ${
                        isMiddleDot
                          ? "font-semibold text-base text-[#4C4C4C]"
                          : "text-[#797979]"
                      }`}
                    >
                      {isMiddleDot
                        ? selectedTechnology
                        : displayedTechnologies[index]}
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
