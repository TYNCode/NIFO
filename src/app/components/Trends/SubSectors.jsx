import React from "react";
import CurvedLineUp from "./CurvedLineUp";
import CurvedLineDown from "./CurvedLineDown";

const SubSectors = ({ selectedSector, onIndustryClick }) => {
  return (
    <div className="relative h-screen flex flex-col justify-between bg-gray-100 overflow-hidden">
      <div className="flex-grow-0">
        <CurvedLineUp selectedSector={selectedSector} />
      </div>
      <div className="flex-grow-0">
        <CurvedLineDown
          selectedSector={selectedSector}
          onIndustryClick={onIndustryClick}
        />
      </div>
    </div>
  );
};

export default SubSectors;
