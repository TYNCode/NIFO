import React from "react";
import sectorData from "../../data/data_sector.json";
import { IoClose } from "react-icons/io5";

const EcosystemWeb = ({ handleExploreClick, selectedEcosystem, handleClose }) => {
  const findUseCaseData = (ecosystemName) => {
    for (const sector of sectorData.sectors) {
      for (const subSector in sector.subSectors) {
        for (const tech of sector.subSectors[subSector]) {
          const foundUseCase = tech.useCases.find(
            (usecase) => usecase.useCase === ecosystemName
          );
          if (foundUseCase) {
            return foundUseCase;
          }
        }
      }
    }
    return null;
  };

  const useCaseData = findUseCaseData(selectedEcosystem);

  const {
    useCase,
    useCaseDescription: description,
    enhancement,
    measureOfImpact: measurementOfImpact,
  } = useCaseData || {};

  return (
    <div className="flex flex-col gap-4 justify-center items-center bg-white shadow-lg rounded mt-10 w-[400px] xl:w-[600px] h-[75vh] overflow-hidden">
      <div className="relative w-full flex flex-col gap-8 py-6 px-4 bg-blue-400">
        <div
          className="text-white font-semibold absolute right-1 top-1 cursor-pointer z-10"
          onClick={handleClose}
        >
          <IoClose size={23} color="white" />
        </div>
        <img
          src="ecosystembg.png"
          alt="Ecosystem Background"
          className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
        />

        <div className="relative z-10 text-center text-white font-medium text-xl">
          {useCase || "Ecosystem not found"}
        </div>

        <div
          className="relative z-50 text-sm font-medium bg-blue-200 text-black mx-auto px-4 py-2 cursor-pointer rounded-md shadow-md"
          onClick={handleExploreClick}
        >
          Explore Solution Provider
        </div>
      </div>

      <div className="flex flex-col flex-grow pb-2 gap-4 px-5 overflow-y-auto scrollbar-thin scrollbar-track-indigo-50 scrollbar-thumb-blue-400">
        <div className="flex flex-col gap-2">
          <div className="font-medium text-base">Description</div>
          <div className="text-base text-gray-700">
            {description || "No description available."}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-medium text-base">Enhancement</div>
          <div className="text-gray-700">{enhancement || "No enhancement information available."}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-medium text-base">Measurement of Impact</div>
          <div className="text-gray-700">
            {measurementOfImpact || "No measurement of impact available."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcosystemWeb;
