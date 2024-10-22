import React from "react";
import { FaGlobe } from "react-icons/fa";
import sectorData from "../../data/data_sector.json";
import { IoClose } from "react-icons/io5";

const StartupsWeb = ({ handleEcosystem, selectedEcosystem , handleExploreClick , handleClose}) => {
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

  const { startups } = useCaseData || {};

  return (
    <div className="mx-auto w-[400px] flex justify-center items-center h-screen">
      <div className="flex flex-col gap-8 justify-center items-center bg-white">
        <div className="relative flex flex-col justify-center items-center gap-8 mx-4 bg-blue-400 h-[200px] overflow-hidden">
          <div className="text-white font-semibold absolute right-1 top-1 cursor-pointer z-10" onClick={handleClose}>
            <IoClose size={23} color="white"/>
          </div>
          <img
            src="ecosystembg.png"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 text-white font-semibold text-2xl text-center">
            {selectedEcosystem || "No Ecosystem Selected"}
          </div>

          <div
            className="relative z-50 text-sm font-medium bg-white mx-auto px-4 py-2 cursor-pointer rounded-md shadow-md"
            onClick={handleEcosystem} 
          >
            Explore Usecases
          </div>
        </div>

        <div className="flex flex-col overflow-y-scroll h-[340px] scrollbar-thin">
          {startups && startups.length > 0 ? (
            startups.map((startup, index) => (
              <div
                key={index}
                className="flex flex-col mx-2 px-2 py-1.5 mb-10 bg-white rounded-md shadow-md"
              >
                <div className="flex flex-row">
                  <div className="flex flex-col gap-2">
                    <div className="font-medium">{startup.name}</div>
                    <div>{startup.description}</div>
                    <div className="flex flex-row justify-center gap-2 items-center rounded-md p-1.5 border-2 border-black w-max cursor-pointer" onClick={handleExploreClick}>
                      <div>Explore</div>
                      <div>
                        <FaGlobe />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <img
                      src={startup.imgSrc || "default-image.png"}
                      alt={startup.name}
                      className="w-40 object-cover h-[80px]"
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No startups available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupsWeb;
