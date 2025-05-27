import React, { useState, useEffect } from "react";
import WebSubIndustries from "./WebSubIndustries";
import WebTechnology from "./WebTechnology";
import UsecaseGrid from "./UsecaseGrid";
import ExploreSolutionProvider from "./ExploreSolutionProvider";

const WebInCombined = ({
  onWebTechnologyClick,
  selectedSector,
  handleGoSector,
  selectedIndustry,
  setSelectedIndustry,
  selectedSolutionProviderId,
  setSelectedSectorProviderId,
  handleExploreClick,
  handleBack,
  highlightedIndustry,
  setHighlighedIndustry
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
        onActiveSubSectorChange = {setHighlighedIndustry}
      />
      {/* {selectedIndustry && (
        <WebTechnology
          onDotClick={onWebTechnologyClick}
          selectedSector={selectedSector}
          selectedIndustry={selectedIndustry} 
        />
      )} */}

      {!selectedSolutionProviderId ? (
              <UsecaseGrid selectedSector={ selectedSector}
              selectedIndustry = {highlightedIndustry} onExploreClick={handleExploreClick} />
            ) : (
              <ExploreSolutionProvider
                solutionProviderId={selectedSolutionProviderId}
                onBack={handleBack}
              />
            )}
    </div>
  );
};

export default WebInCombined;
