"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa";
import { TbShare2 } from "react-icons/tb";
import MobileHeader from "../../mobileComponents/MobileHeader";
import BottomBar from "../../mobileComponents/BottomBar";

const page = () => {
  const params = useParams();

  const [activeSpotlight, setActiveSpotlight] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Spotlight");

  const selectedStartup = {
    name: "Eightfold AI",
    description:
      "Offers AI-driven talent intelligence solutions for talent acquisition, management, and workforce optimization.",
    database_info: {
      startup_id: 126,
      startup_name: "Eightfold AI",
      startup_url: "https://eightfold.ai/",
      startup_analyst_rating: "Gartner-4",
      startup_gsi: null,
      startup_partners: null,
      startup_customers: null,
      startup_usecases:
        "Eightfold AI uses machine learning to provide comprehensive talent intelligence solutions, optimizing workforce management.",
      startup_solutions:
        "Eightfold AI's platform provides AI-driven talent intelligence solutions for talent acquisition, management, and workforce optimization.",
      startup_industry: "Human Resources, Talent Management",
      startup_technology: "AI",
      startup_overview:
        "Eightfold AI offers a talent intelligence platform leveraging AI to transform how enterprises manage and develop their workforce.",
      startup_description:
        "Delivers AI-based solutions for talent management, acquisition, and workforce optimization, driving enterprise growth.",
      startup_company_stage: "Series E",
      startup_country: "USA",
      startup_founders_info: "Ashutosh Garg, Varun Kacholia",
      startup_emails: "info@eightfold.ai",
    },
  };

  const shareContent = `Check out this startup: ${selectedStartup.name} - ${selectedStartup.description}. More details: ${selectedStartup.database_info.startup_url}`;
  const handleShareClick = () => {
    console.log("handle click is done")
    if (navigator.share) {
      navigator
        .share({
          title: selectedStartup.name,
          text: shareContent,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing", error));
    } else {
      alert("Web Share API not supported in your browser.");
    }
  };
  return (
    <div>
      <div>
        <MobileHeader
          activeSpotlight={activeSpotlight}
          setActiveSpotlight={setActiveSpotlight}
        />
      </div>

      {/* comapny profile component  */}
      <div className="mx-6 my-4 flex flex-col gap-2 pb-32">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <div
            // onClick={onBackClick}
            >
              <FaAngleLeft size={24} />
            </div>
            <div className="uppercase font-medium text-blue-500 text-lg">
              {selectedStartup.name}
            </div>
          </div>

          <div className="flex gap-4 items-center justify-center">
            {/* Need to implement share functionhere */}
            {/* Share button */}
            <div className="text-gray-500 cursor-pointer" onClick={handleShareClick}>
              <TbShare2 size={26} />
            </div>

            {/* Connect button */}
            {/* <div>
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
      </div> */}
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
                <div>
                  {selectedStartup?.database_info?.startup_company_stage}
                </div>
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

      <BottomBar setActiveTab={setActiveTab} activeTab={activeTab} />
    </div>
  );
};

export default page;
