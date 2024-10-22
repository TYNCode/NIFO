import React, { useEffect, useState } from "react";
import sectorData from "../../data/data_sector.json";

const Usecase = ({
  onSelectUsecase,
  selectedSector,
  selectedIndustry,
  selectedTechnology,
}) => {
  const [usecases, setUsecases] = useState([]);
  useEffect(() => {
    if (selectedSector && selectedIndustry && selectedTechnology) {
      const sector = sectorData.sectors.find(
        (s) => s.sector === selectedSector
      );
      if (!sector) {
        console.log("Sector not found");
        setUsecases([]);
        return;
      }

      const subSector = sector.subSectors[selectedIndustry];
      if (!subSector) {
        console.log("Sub-sector not found");
        setUsecases([]);
        return;
      }

      const technology = subSector.find(
        (tech) => tech.technologyTrend === selectedTechnology
      );

      if (!technology) {
        console.log("Technology not found");
        setUsecases([]);
        return;
      }

      if (!technology.useCases || technology.useCases.length === 0) {
        console.log("No use cases found");
        setUsecases([]);
        return;
      }

      // Extracting the use cases
      const fetchedUsecases = technology.useCases.map(
        (usecase) => usecase.useCase
      );
      setUsecases(fetchedUsecases);
    }
  }, [selectedSector, selectedIndustry, selectedTechnology]);

  const handleUsecaseClick = (usecase) => {
    onSelectUsecase(usecase); // Notify the parent component of the selected use case
  };

  console.log("usecases___>", usecases);

  return (
    <div>
      <div className="flex flex-col gap-8">
        <div className="border flex mx-auto w-max border-t-0 rounded-md px-8 py-3 bg-blue shadow-md bg-blue-400 text-white font-medium text-lg border-blue-400">
          Usecases
        </div>
        <div className="flex flex-col gap-y-12 justify-center items-center">
          {usecases.length > 0 ? (
            usecases.map((usecase, index) => (
              <div
                className="bg-white shadow-md rounded-sm shadow-gray-300 p-4 w-[500px] cursor-pointer hover:text-white hover:bg-blue-400"
                key={index}
                onClick={() => handleUsecaseClick(usecase)}
              >
                {usecase}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No use cases available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Usecase;
