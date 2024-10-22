import React, { useState, useEffect } from "react";
import WebSubIndustries from "./WebSubIndustries";
import WebTechnology from "./WebTechnology";

const WebInCombined = ({
  onWebTechnologyClick,
  selectedSector,
  handleGoSector,
  selectedIndustry,
  setSelectedIndustry
}) => {
 
  const handleDotClick = (subSectorName) => {
    setSelectedIndustry(subSectorName);
  };

  return (
    <div className="flex h-screen relative overflow-hidden select-none">
      <WebSubIndustries
        onDotClick={handleDotClick} 
        selectedIndustry={selectedIndustry} 
        selectedSector={selectedSector}
        handleGoSector={handleGoSector}
      />
      {selectedIndustry && (
        <WebTechnology
          onDotClick={onWebTechnologyClick}
          selectedSector={selectedSector}
          selectedIndustry={selectedIndustry} 
        />
      )}
    </div>
  );
};

export default WebInCombined;
