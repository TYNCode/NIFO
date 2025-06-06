import React from "react";
import CurvedLineUp from "./CurvedLineUp";
import CurvedLineDown from "./CurvedLineDown";

const SubSectors = ({ selectedSector, onIndustryClick }) => {
  return (
    <div className="relative h-[90dvh] flex flex-col justify-between overflow-hidden">
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
