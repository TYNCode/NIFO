import React, { useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import Image from "next/image";

const StartupList = ({ startups, handleStartups }) => {
  const [expandedStartupIndex, setExpandedStartupIndex] = useState<
    number | null
  >(null);

  const toggleStartupDescription = (index: number) => {
    setExpandedStartupIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  console.log("startups inside startupList",startups);

  return (
    <div className="grid grid-flow-row gap-4 pl-4 py-2 pb-2">
      {startups.map((startup, startupIndex) => (
        <div
          key={startupIndex}
          className="cursor-pointer"
          onClick={() => toggleStartupDescription(startupIndex)}
        >
          <div className="flex justify-between items-start">
            <div
              className="text-blue-400 underline font-bold text-lg mb-2"
              onClick={() => handleStartups(startup, startupIndex)}
            >
              {startup.name}
            </div>

            <div className="mt-2">
              {expandedStartupIndex === startupIndex ? (
                <FaAngleDown className="text-blue-400" />
              ) : (
                <FaAngleRight className="text-blue-400" />
              )}
            </div>
          </div>

          {startup?.relevance && (
              <div className="text-sm italic text-gray-600">
                <span className="text-black font-semibold">Why: </span>
                {startup.relevance}
              </div>
            )}

          {expandedStartupIndex === startupIndex && (
            <div className="mb-1">
              <div className="text-sm font-semibold my-2">Description:</div>
              <div className="flex justify-center items-center gap-3">
                <div>
                  <Image
                    src={startup?.database_info?.startup_logo}
                    width={300}
                    height={200}
                    alt={startup?.name}
                  />
                </div>
                <div className="text-sm line-clamp-4 overflow-hidden">
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

export default StartupList;
