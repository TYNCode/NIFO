import React from "react";
import sectorsData from "../../data/sector_data.json"; // Import the JSON data

const UsecasesArc = ({
  selectedIndustry,
  selectedTechnology,
  OriginalTechnologyNames,
}) => {
  const radius1 = 165; // Radius of the first arc
  const radius2 = 285; // Radius of the second arc
  const centerX1 = 155; // Center the first arc's topmost dot horizontally
  const centerY1 = 0; // Y position for the first arc's topmost dot
  const centerX2 = 278; // Center the second arc's topmost dot horizontally
  const centerY2 = 1; // Y position for the second arc's topmost dot

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

  const technologyNames = selectedIndustryData
    ? selectedIndustryData.technologies.map((tech) => tech.technologyName)
    : [];

  // Find the index of the selected industry and technology
  const selectedIndustryIndex = selectedIndustryData
    ? selectedSector.industries
        .map((industry) => industry.industryName)
        .indexOf(selectedIndustry)
    : -1;

  const selectedTechnologyIndex = technologyNames.indexOf(selectedTechnology);

  // Determine the industries and technologies to display along with their neighbors
  const displayedIndustries =
    selectedIndustryIndex !== -1
      ? [
          OriginalTechnologyNames[
            (selectedIndustryIndex - 1 + OriginalTechnologyNames.length) %
              OriginalTechnologyNames.length
          ],
          selectedIndustry,
          OriginalTechnologyNames[
            (selectedIndustryIndex + 1) % OriginalTechnologyNames.length
          ],
        ]
      : [
          "No Industries Available",
          "No Industries Available",
          "No Industries Available",
        ];

  const displayedTechnologies =
    selectedTechnologyIndex !== -1
      ? [
          technologyNames[
            (selectedTechnologyIndex - 1 + technologyNames.length) %
              technologyNames.length
          ],
          selectedTechnology,
          technologyNames[
            (selectedTechnologyIndex + 1) % technologyNames.length
          ],
        ]
      : [
          "No Technologies Available",
          "No Technologies Available",
          "No Technologies Available",
        ];

  // Define the fixed positions for the three dots along each arc
  const fixedAnglesArc1 = [
    -Math.PI / 2, // Top center (90°)
    -Math.PI / 4, // Middle right (45°)
    0, // Bottom right (0°)
  ];

  const fixedAnglesArc2 = [
    -Math.PI / 2, // Top center (90°)
    -Math.PI / 4, // Middle right (45°)
    0, // Bottom right (0°)
  ];

  return (
    <div>
      <div className="relative flex justify-end items-start select-none mt-16">
        {/* First Arc */}
        <div className="absolute">
          <img src="/circleup1.svg" alt="Arc 1" className="w-32" />
        </div>

        <div className="absolute">
          <div className="relative w-44">
            <div>
              <img src="/circleup2.svg" alt="Arc 2" className="w-44" />
              <div className="absolute top-10 right-4 flex justify-center items-center">
                <span className="text-lg font-semibold uppercase text-gray-700">
                  BFSI
                </span>
              </div>
            </div>
            {fixedAnglesArc1.map((angle, index) => {
              const isMiddleDot = index === 1; // Middle dot is at index 1
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
                        ? "bg-[#3AB8FF] border-2 border-[#FFEFA7] w-7 h-7"
                        : "bg-[#D8D8D8] w-5 h-5"
                    }`}
                  >
                    <div
                      className={`absolute right-full mr-2 top-2 text-sm w-32 text-right ${
                        isMiddleDot
                          ? "font-semibold text-base text-[#4C4C4C]"
                          : "text-[#797979]"
                      }`}
                    >
                      {
                        displayedIndustries[
                          (selectedIndustryIndex + index) %
                            displayedIndustries.length
                        ]
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Second Arc */}
        <div>
          <div className="relative w-[300px]">
            <div>
              <img src="/circleup2.svg" alt="Arc 2" className="w-[300px]" />
            </div>
            {fixedAnglesArc2.map((angle, index) => {
              const isMiddleDot = index === 1; // Middle dot is at index 1
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
                        ? "bg-[#3AB8FF] border-2 border-[#FFEFA7] w-7 h-7"
                        : "bg-[#D8D8D8] w-5 h-5"
                    }`}
                  >
                    <div
                      className={`absolute right-full mr-2 top-2 text-sm w-32 text-right ${
                        isMiddleDot
                          ? "font-semibold text-base text-[#4C4C4C]"
                          : "text-[#797979]"
                      }`}
                    >
                      {isMiddleDot
                        ? selectedTechnology
                        : displayedTechnologies[
                            (selectedTechnologyIndex + index) %
                              displayedTechnologies.length
                          ]}
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
