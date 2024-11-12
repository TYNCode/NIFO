import React from "react";
import IndustriesUp from "./IndustriesUp";
import IndustriesDown from "./IndustriesDown";

const Industries = ({
  selectedSector,
  selectedIndustry,
  onTechnologyClick,
  setTechnologyNames, 
}) => {

  const handleTechnologyUpdate = (technologies) => {
    setTechnologyNames(technologies); 
  };

  return (
    <div className="relative h-[100dvh] flex flex-col justify-between bg-gray-100 overflow-hidden">
      <div className="flex-grow-0">
        <IndustriesUp
        selectedIndustry={selectedIndustry}
        selectedSector={selectedSector} 
      />
      </div>

      <div className="flex-grow-0">
        <IndustriesDown
          selectedSector={selectedSector}
          selectedIndustry={selectedIndustry}
          onTechnologyClick={onTechnologyClick}
          onTechnologiesUpdate={handleTechnologyUpdate}
        />
      </div>
    </div>
  );
};

export default Industries;
