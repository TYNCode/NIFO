import React from "react";
import FirstLeftCircle from "./FirstLeftCircle";
import UsecaseGrid from "./UsecaseGrid";
import ExploreSolutionProvider from "./ExploreSolutionProvider";

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
    <div className="flex h-screen relative overflow-hidden select-none">
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
        <ExploreSolutionProvider
          solutionProviderId={selectedSolutionProviderId}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default WebSectors;
