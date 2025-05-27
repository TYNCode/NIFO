import React, { useState } from "react";
import FirstLeftCircle from "./FirstLeftCircle";
// import FirstRightCircle from "./FirstRightCircle";
import UsecaseGrid from "./UsecaseGrid";
import ExploreSolutionProvider from "./ExploreSolutionProvider";

const WebIndustries = ({
  onWebCircleTwoClick,
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
  highlightedIndustry
}) => {


  return (
    <div className="flex h-screen relative overflow-hidden select-none">
      {currentCircleView === "sector" && (
        <FirstLeftCircle 
        onDotClick={handleSectorClick}
        onSectorHighlight={setHighlightedSectorForGrid} />
      )}

      {/* Replace FirstRightCircle usage if needed */}
      {/* {showIndustryCircle && (
        <FirstRightCircle
          selectedSector={selectedSector}
          onDotClick={onWebCircleTwoClick}
        />
      )} */}

      {/* Conditionally show UsecaseGrid or ExploreSolutionProvider */}
      {!selectedSolutionProviderId ? (
        <UsecaseGrid selectedSector={highlightedSectorForGrid || selectedSector} onExploreClick={handleExploreClick}
        selectedIndustry={highlightedIndustry} />
      ) : (
        <ExploreSolutionProvider
          solutionProviderId={selectedSolutionProviderId}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default WebIndustries;
