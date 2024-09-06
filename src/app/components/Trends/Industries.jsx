import React from "react";
import IndustriesUp from "./IndustriesUp";
import IndustriesDown from "./IndustriesDown";

const Industries = ({
  selectedSector,
  selectedIndustry,
  onTechnologyClick,
  setTechnologyNames, // Add this prop
}) => {
  const handleTechnologyUpdate = (technologies) => {
    setTechnologyNames(technologies); // Pass the technologies up
  };

  return (
    <div className="relative h-screen flex flex-col justify-between bg-gray-100 overflow-hidden">
      {/* IndustriesUp at the top */}
      <div className="flex-grow-0">
        <IndustriesUp selectedIndustry={selectedIndustry} />
      </div>

      {/* IndustriesDown at the bottom */}
      <div className="flex-grow-0">
        <IndustriesDown
          selectedIndustry={selectedIndustry}
          onTechnologyClick={onTechnologyClick}
          onTechnologiesUpdate={handleTechnologyUpdate} // Pass down the handler
        />
      </div>
    </div>
  );
};

export default Industries;
