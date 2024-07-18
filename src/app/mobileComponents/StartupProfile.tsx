import React, { useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { TbShare2 } from "react-icons/tb";

const StartupProfile = ({
  selectedStartup,
  onBackClick,
  connectionStatus,
  setConnectionStatus,
}) => {
  useEffect(() => {
    // Log whenever connectionStatus changes
    console.log("mobileConnectionStatus", connectionStatus, selectedStartup?.name);
  }, [connectionStatus, selectedStartup]);

  const handleButtonClick = () => {
    // Example of updating connection status locally
    setConnectionStatus("Requested"); // Update based on your logic
  };

  if (!selectedStartup) {
    return null; // Handle case where selectedStartup is not defined
  }

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedStartup?.name,
          url: `${window.location.href}/startups/${selectedStartup?.database_info?.startup_id}`
        });
        console.log('Successfully shared');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Web Share API not supported');
    }
  };

  return (
    <div className="mx-6 my-4 flex flex-col gap-2 pb-32">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <div onClick={onBackClick}>
            <FaAngleLeft size={24} />
          </div>
          <div className="uppercase font-medium text-blue-500 text-lg">
            {selectedStartup.name}
          </div>
        </div>

        <div className="flex gap-4 items-center justify-center">

        {/* Share button */}
        <div className="text-gray-500" onClick={handleShareClick}>
        <TbShare2 size={26} />
        </div>

        {/* Connect button */}
        <div>
          <button
            className={`flex justify-center items-center px-4 py-1.5 bg-gray-400 rounded-md text-white font-semibold lg:w-5/12 xl:text-xl xl:w-5/12 ${
              connectionStatus === "Connect"
                ? "hover:bg-yellow-400 cursor-pointer"
                : "cursor-default bg-red-400"
            }`}
            onClick={handleButtonClick} // Handle button click to update status
          >
            {connectionStatus}
          </button>
        </div>

        </div>
      </div>
      <div className="flex flex-col gap-5 leading-7 tracking-wide my-6 mx-3">
        <div>{selectedStartup?.database_info?.startup_description}</div>
        <div className="flex flex-col gap-4 shadow-inner text-sm bg-blue-100 p-4 rounded-lg">
          <div className="flex justify-between gap-3 w-full">
            <div className="flex flex-col w-1/2 leading-7 tracking-wide">
              <div className="font-semibold">Industry</div>
              <div>{selectedStartup?.database_info?.startup_industry}</div>
            </div>
            <div className="flex flex-col w-1/2 leading-7 tracking-wide">
              <div className="font-semibold">Technology</div>
              <div>{selectedStartup?.database_info?.startup_technology}</div>
            </div>
          </div>
          <div className="flex justify-between gap-3 w-full">
            <div className="flex flex-col w-1/2 leading-7 tracking-wide">
              <div className="font-semibold">Country</div>
              <div>{selectedStartup?.database_info?.startup_country}</div>
            </div>
            <div className="flex flex-col w-1/2 leading-7 tracking-wide">
              <div className="font-semibold">Funding Stage</div>
              <div>{selectedStartup?.database_info?.startup_company_stage}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col leading-7 tracking-wide">
          <div className="font-semibold ">Solution</div>
          <div>{selectedStartup?.database_info?.startup_solutions}</div>
        </div>
        <div className="flex flex-col leading-7 tracking-wide">
          <div className="font-semibold">Usecases</div>
          <div>{selectedStartup?.database_info?.startup_usecases}</div>
        </div>
      </div>
    </div>
  );
};

export default StartupProfile;
