import React from "react";
import IndustriesUp from "./IndustriesUp";
import IndustriesDown from "./IndustriesDown";

const Industries = ({
  selectedSector,
  selectedIndustry,
  onTechnologyClick,
}) => {
  return (
    <div className="relative h-screen flex flex-col justify-between bg-gray-100">
      {/* IndustriesUp at the top */}
      <div className="flex-grow-0">
        <IndustriesUp selectedIndustry={selectedIndustry} />
      </div>

      {/* IndustriesDown at the bottom */}
      <div className="flex-grow-0">
        <IndustriesDown
          selectedIndustry={selectedIndustry}
          onTechnologyClick={onTechnologyClick}
        />
      </div>
    </div>
  );
};

export default Industries;
