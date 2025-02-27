import React, { useEffect, useState } from "react";
import { FaGlobe } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import sectorData from "../../data/data_sector.json";
import { ThreeDots } from "react-loader-spinner"; // Use a specific loader

const StartupsWeb = ({
  handleEcosystem,
  selectedEcosystem,
  handleExploreClick,
  handleClose,
}) => {
  const [detailedStartups, setDetailedStartups] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchStartupDetails = async (startupName) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/directorysearch/companysearch/?startup_name=${startupName}`
      );
      const data = await response.json();
      if (data.length > 0) {
        return {
          name: data[0]?.startup_name,
          description: data[0]?.startup_description,
          logo: data[0]?.startup_logo,
          startup_id: data[0]?.startup_id,
        };
      }
    } catch (error) {
      console.error("Error fetching startup details:", error);
    }
    return null;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      if (startups && startups.length > 0) {
        const promises = startups.map((startup) =>
          fetchStartupDetails(startup.name)
        );
        const results = await Promise.all(promises);
        setDetailedStartups(results.filter((result) => result !== null));
      }
      setLoading(false);
    };

    fetchDetails();
  }, [startups]);

  return (
    <div className="flex flex-col gap-4 items-center bg-white shadow-lg rounded mt-10 w-[400px] xl:w-[600px] h-[75vh]">
      <div className="relative w-full flex flex-col gap-8 py-6 px-4 bg-blue-400">
        <div
          className="text-white font-semibold absolute right-1 top-1 cursor-pointer z-10"
          onClick={handleClose}
        >
          <IoClose size={23} color="white" />
        </div>
        <img
          src="ecosystembg.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
        />
        <div className="relative z-10 text-center text-white font-medium text-xl">
          {selectedEcosystem || "No Ecosystem Selected"}
        </div>

        <div
          className="relative z-50 text-sm font-medium bg-white mx-auto px-4 py-2 cursor-pointer rounded-md shadow-md"
          onClick={handleEcosystem}
        >
          Explore Usecases
        </div>
      </div>

      <div className={`flex flex-col gap-4 px-1 ${loading ? '' : 'overflow-y-auto scrollbar-thin scrollbar-track-indigo-50 scrollbar-thumb-blue-400'}`}>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <ThreeDots color="#00BFFF" height={80} width={80} />
          </div>
        ) : detailedStartups && detailedStartups.length > 0 ? (
          detailedStartups.map((startup, index) => (
            <div
              key={index}
              className="flex flex-col mx-2 px-2 py-1.5 mb-10 rounded-md shadow-sm shadow-gray-400 border-gray-400"
            >
              <div className="flex flex-row">
                <div className="flex flex-col gap-2 w-full h-full text-sm">
                  <div className="font-medium">{startup.name}</div>
                  <div>{startup.description || "No description available."}</div>
                  <div
                    className="flex flex-row justify-center gap-2 items-center rounded-md py-1 px-2.5 border-2 border-sky-500 w-max cursor-pointer text-sky-500 mt-1 mb-1.5"
                    onClick={() => handleExploreClick(startup)}
                  >
                    <div>Explore</div>
                    <div>
                      <FaGlobe />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <img
                    src={startup?.logo || "default-image.png"}
                    alt={startup?.name}
                    className="w-24 object-cover h-[40px]"
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
  );
};

export default StartupsWeb;
