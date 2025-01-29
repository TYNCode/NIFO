import Image from "next/image";
import React, { useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";

const RenderStartup = ({ message, handleSendStartupData }) => {
  const [expandedStartupIndex, setExpandedStartupIndex] = useState<
    number | null
  >(null);
  const renderSolutionOrchestration = () => {
    return (
      <div>
        {message?.response?.steps?.map((step, index) => (
          <div key={index}>
            {" "}
            <div className="flex gap-2 m-2 mt-4">
              <div>Step: {step?.step_number}</div>
              <div>{step?.step_description}</div>
            </div>
            {step?.startups?.map((startup, sIndex) => (
              <div
                key={sIndex}
                className="grid grid-cols-3 mt-4 rounded shadow-md p-2 bg-blue-100 cursor-pointer"
                onClick={() => handleSendStartupData(startup, message)}
              >
                <div className="text-sm">{startup?.name}</div>
                <div className="text-sm col-span-2">{startup?.description}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const handleExpandedStartupIndex = (index: number) => {
    setExpandedStartupIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  const renderOtherCategories = () => {
    const startups = message?.response?.startups
    console.log("startupsss--->",startups?.sort((a:any,b:any)=> b.relevancy_score - a.relevancy_score))
    if (!startups || startups?.length === 0) return null;
    return (
      <div className="flex flex-col gap-3">
        {startups.map((startup: any, index: number) => (
          <div
            key={index}
            className={`flex flex-col gap-1 cursor-pointer ${
              startup?.database_info ? "bg-blue-100 shadow-md py-4" : "py-1"
            } px-4  rounded-md`}
            onClick={
              startup?.database_info
                ? () => handleSendStartupData(startup, message)
                : undefined
            }
          >
            <div className="flex  justify-between">
              <div
                className={`text-base font-semibold  ${
                  startup?.database_info ? "text-blue-400" : ""
                }`}
              >
                {startup?.name}
              </div>
              <div
                className=""
                onClick={(e) =>{
                   e.stopPropagation();
                   handleExpandedStartupIndex(index)
                  }}
              >
                {expandedStartupIndex === index ? (
                  <FaAngleDown
                    className={`text-base font-semibold  ${
                      startup?.database_info ? "text-blue-400" : ""
                    }`}
                    size={24}
                  />
                ) : (
                  <FaAngleRight
                    className={`text-base font-semibold  ${
                      startup?.database_info ? "text-blue-400" : ""
                    }`}
                    size={24}
                  />
                )}
              </div>
            </div>

            <div className="text-sm italic">
              Why :{" "}
              <span className="font-light text-gray-600 pr-32">
                {startup?.relevance}
              </span>
            </div>

            {expandedStartupIndex === index && (
              <div className="mb-1">
                <div className="text-sm font-semibold my-2">Description:</div>
                <div className="flex justify-center items-center gap-3">
                  {startup?.database_info?.startup_logo && (
                    <div>
                      <Image
                        src={startup?.database_info?.startup_logo}
                        width={100}
                        height={100}
                        alt={startup?.name}
                      />
                    </div>
                  )}
                  <div className="text-sm line-clamp-4 overflow-hidden pr-20">
                    {startup.description}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {message?.response?.category == "business problem(solution orchestration)"
        ? renderSolutionOrchestration()
        : renderOtherCategories()}
    </>
  );
};

export default RenderStartup;
