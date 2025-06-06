import React, { useState } from "react";
import WebSectors from "./WebSectors";
import WebInCombined from "./WebInCombined";
import WebSubIndustries from "./WebSubIndustries";

const TrendsWeb = () => {
  const [showInCombined, setShowInCombined] = useState(false);
  const [showCircleThree, setShowCircleThree] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedSubIndustry, setSelectedSubIndustry] = useState(null);
  const [highlightedSectorForGrid, setHighlightedSectorForGrid] = useState(null);
  const [highlightedIndustry, setHighlighedIndustry] = useState(null);
  const [highlightedSubIndustry, setHighlightedSubIndustry] = useState(null);
  const [selectedSolutionProviderId, setSelectedSolutionProviderId] = useState(null);
  const [currentCircleView, setCurrentCircleView] = useState("sector");

  const handleSectorClick = (sector) => {
    setSelectedSector(sector);
    setShowInCombined(true);
  };

  const handleWebCircleTwoClick = (industry) => {
    setSelectedIndustry(industry);
    setShowCircleThree(true);
  };

  const handleGoSector = () => {
    setCurrentCircleView("sector");
    setShowInCombined(false);
    setShowCircleThree(false);
    setSelectedSector(null);
    setSelectedIndustry(null);
    setSelectedSubIndustry(null);
    setHighlighedIndustry(null);
    setHighlightedSubIndustry(null);
  };

  const handleExploreClick = (solutionProviderId) => {
    setSelectedSolutionProviderId(solutionProviderId);
  };

  const handleBack = () => {
    setSelectedSolutionProviderId(null);
  };

  return (
    <div className="">
      {showInCombined ? (
        showCircleThree ? (
          <WebSubIndustries
            selectedSector={selectedSector}
            selectedIndustry={selectedIndustry}
            selectedSubIndustry={selectedSubIndustry}
            setSelectedSubIndustry={setSelectedSubIndustry}
            setHighlightedSubIndustry={setHighlightedSubIndustry}
            handleGoSector={handleGoSector}
          />
        ) : (
          <WebInCombined
            selectedSector={selectedSector}
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            highlightedIndustry={highlightedIndustry}
            setHighlighedIndustry={setHighlighedIndustry}
            selectedSolutionProviderId={selectedSolutionProviderId}
            setSelectedSectorProviderId={setSelectedSolutionProviderId}
            handleExploreClick={handleExploreClick}
            handleBack={handleBack}
            handleGoSector={handleGoSector}
            onWebCircleTwoClick={handleWebCircleTwoClick}
            selectedSubIndustry={selectedSubIndustry}
            setSelectedSubIndustry={setSelectedSubIndustry}
          />
        )
      ) : (
        <WebSectors
          handleSectorClick={handleSectorClick}
          selectedSector={selectedSector}
          showIndustryCircle={showInCombined}
          currentCircleView={currentCircleView}
          selectedSolutionProviderId={selectedSolutionProviderId}
          setSelectedSectorProviderId={setSelectedSolutionProviderId}
          highlightedSectorForGrid={highlightedSectorForGrid}
          setHighlightedSectorForGrid={setHighlightedSectorForGrid}
          highlightedIndustry={highlightedIndustry}
          selectedSubIndustry={selectedSubIndustry}
          handleExploreClick={handleExploreClick}
          handleBack={handleBack}
        />
      )}
    </div>
  );
};

export default TrendsWeb;
