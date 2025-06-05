import React from "react";
import WebIndustries from "./WebIndustries";
import UsecaseGrid from "./UsecaseGrid";
import ExploreUsecase from "./ExploreUsecase";

const WebInCombined = ({
  onWebCircleTwoClick,
  selectedSector,
  handleGoSector,
  selectedIndustry,
  setSelectedIndustry,
  selectedSolutionProviderId,
  setSelectedSectorProviderId,
  handleExploreClick,
  handleBack,
  highlightedIndustry,
  setHighlighedIndustry,
  selectedSubIndustry,
  setSelectedSubIndustry
}) => {
  const handleDotClick = (industryName) => {
    setSelectedIndustry(industryName);
  };

  return (
    <div className="flex h-screen relative overflow-hidden select-none">
      <WebIndustries
        onDotClick={handleDotClick}
        selectedIndustry={selectedIndustry}
        selectedSector={selectedSector}
        handleGoSector={handleGoSector}
        onActiveSubSectorChange={setHighlighedIndustry}
        onWebCircleTwoClick={onWebCircleTwoClick}
      />

      {!selectedSolutionProviderId ? (
        <UsecaseGrid
          selectedSector={selectedSector}
          selectedIndustry={highlightedIndustry}
          selectedSubIndustry={selectedSubIndustry}
          onExploreClick={handleExploreClick}
        />
      ) : (
          <ExploreUsecase
            useCaseId={selectedSolutionProviderId}
            onBack={handleBack}
          />
      )}
    </div>
  );
};

export default WebInCombined;
