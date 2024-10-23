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
    startups,
  } = useCaseData || {};

  return (
    <div className="flex flex-col gap-4 items-center  shadow-lg  rounded overflow-y-auto  pb-4 scrollbar-thin mt-16 w-[400px] h-[75vh]">
      <div className="relative flex flex-col gap-8 py-6 px-4 w-full bg-blue-400">
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
          className="relative z-50 text-sm font-medium  mx-auto px-4 py-2 cursor-pointer rounded-md shadow-md bg-blue-200 text-black"
          onClick={handleExploreClick}
        >
          Explore Ecosystem
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5">
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-lg">Description</div>
          <div className="text-base">
            {description || "No description available."}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-lg">Enhancement</div>
          <div>{enhancement || "No enhancement information available."}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-lg">Measurement of Impact</div>
          <div>
            {measurementOfImpact || "No measurement of impact available."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcosystemWeb;
