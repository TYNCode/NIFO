import React from "react";
import FirstLeftCircle from "./FirstLeftCircle";
import UsecaseGrid from "./UsecaseGrid";
import ExploreUsecase from "./ExploreUsecase";

const WebSectors = ({
  handleSectorClick,
  selectedSector,
  showIndustryCircle,
  currentCircleView,
  selectedSolutionProviderId,
  setSelectedSectorProviderId,
  handleExploreClick,
  handleBack,
  highlightedSectorForGrid,
  setHighlightedSectorForGrid,
  highlightedIndustry,
  selectedSubIndustry
}) => {
  return (
    <div className="flex relative overflow-hidden select-none">
      {currentCircleView === "sector" && (
        <FirstLeftCircle
          onDotClick={handleSectorClick}
          onSectorHighlight={setHighlightedSectorForGrid}
        />
      )}

      {!selectedSolutionProviderId ? (
        <UsecaseGrid
          selectedSector={highlightedSectorForGrid || selectedSector}
          selectedIndustry={highlightedIndustry}
          selectedSubIndustry={selectedSubIndustry}
          onExploreClick={handleExploreClick}
        />
      ) : (
          <ExploreUsecase
          onBack={handleBack}
          useCaseId={selectedSolutionProviderId}
        />
      )}
    </div>
  );
};

export default WebSectors;
