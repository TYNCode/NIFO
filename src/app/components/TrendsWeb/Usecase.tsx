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

      // Extracting the use cases with descriptions
      const fetchedUsecases = technology.useCases.map((usecase) => ({
        useCase: usecase.useCase,
        description: usecase.useCaseDescription,
      }));
      setUsecases(fetchedUsecases);
    }
  }, [selectedSector, selectedIndustry, selectedTechnology]);

  const handleUsecaseClick = (usecase) => {
    console.log("handleclickusecase",usecase)
    onSelectUsecase(usecase.useCase);
  };

  return (
    <div>
      <div className="">
        <div className="border-2 flex mx-auto w-max border-t-0 rounded-md px-8 py-3 bg-blue shadow-md text-gray-700 font-medium text-xl border-blue-400">
          Usecases
        </div>
        <div
          className="flex flex-col gap-4 h-[70vh] xl:h-screen mt-5 xl:mt-10 scrollbar-thin scrollbar-track-indigo-50 scrollbar-thumb-blue-400 overflow-y-scroll"
          style={{ maxHeight: '500px' }}
        >
          {usecases.length > 0 ? (
            usecases.map((usecase, index) => (
              <div
                className="flex flex-col gap-2 items-center bg-white border border-gray-200 shadow-md rounded-sm shadow-gray-300 p-4 w-[450px] xl:w-[500px] 2xl:w-[600px] hover:shadow-lg cursor-pointer hover:text-white group hover:bg-blue-400"
                key={index}
                onClick={() => handleUsecaseClick(usecase)}
              >
                <div className="font-semibold hover:font-bold  group-hover:text-yellow-200">{usecase.useCase}</div>
                <div className="text-gray-700 group-hover:text-white hover:text-base text-sm">{usecase.description}</div>
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
