import React from "react";
import sectorData from "../../data/data_sector.json";

const Usecase = ({
  onSelectUsecase,
  selectedSector,
  selectedIndustry,
  selectedTechnology,
}) => {
  const sectors = sectorData.sectors;

  const getInitialUsecaseData = () => {
    const sector = sectors.find((s) => s.sector === selectedSector);
    if (!sector) {
      console.log("Sector not found");
      return [];
    }

    const subSector = sector.subSectors[selectedIndustry];
    if (!subSector) {
      console.log("Sub-sector not found");
      return [];
    }

    const technology = subSector.find(
      (tech) => tech.technologyTrend === selectedTechnology
    );

    if (!technology) {
      console.log("Technology not found");
      return [];
    }

    if (!technology.useCases) {
      console.log("No use cases found");
      return [];
    }

    return technology.useCases.map((usecase) => usecase.useCase);
  };

  const usecases = getInitialUsecaseData();

  const handleUsecaseClick = (usecase) => {
    onSelectUsecase(usecase);
  };

  console.log("usecases___>", usecases);

  return (
    <div>
      <div className="flex flex-col gap-8">
        <div className="border flex mx-auto w-max border-t-0 rounded-md px-8 py-3 -mt-2 border-blue-500">
          Usecases
        </div>
        <div className="flex flex-col gap-y-12 justify-center items-center">
          {usecases.length > 0 ? (
            usecases.map((usecase, index) => (
              <div
                className="bg-white shadow-md rounded-sm shadow-gray-300 p-4 w-[500px] cursor-pointer"
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
