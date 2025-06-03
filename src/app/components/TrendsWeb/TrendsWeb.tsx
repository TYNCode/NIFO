import React, { useState } from "react";
import WebIndustries from "./WebIndustries";
import WebInCombined from "./WebInCombined";
import WebTechUsecase from "./WebTechUsecase";
import WebUsecases from "./WebUsecases";

const TrendsWeb = () => {
  const [showInCombined, setShowInCombined] = useState(false);
  const [showCircleThree, setShowCircleThree] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const [showIndustryCircle, setShowIndustryCircle] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [currentCircleView, setCurrentCircleView] = useState("sector");
  const [highlightedSectorForGrid, setHighlightedSectorForGrid] = useState(null);
  const [highlightedIndustry, setHighlighedIndustry] = useState(null);
  const handleSectorClick = (sector) => {
    setSelectedSector(sector);
    setShowIndustryCircle(true);
    setShowInCombined(true);
  };

  const handleWebCircleTwoClick = (industry) => {
    setSelectedIndustry(industry);
  };

  const handleWebTechnologyClick = (technology) => {
    setSelectedTechnology(technology);
    setShowCircleThree(true);
  };

  const handleGoSector = () => {
    setCurrentCircleView("sector");
    setShowInCombined(false);
    setShowCircleThree(false);
    setShowIndustryCircle(false);
    setHighlighedIndustry(null);
  };

    const [selectedSolutionProviderId, setSelectedSolutionProviderId] = useState(null);
  
    const handleExploreClick = (solutionProviderId) => {
      setSelectedSolutionProviderId(solutionProviderId);
    };
  
    const handleBack = () => {
      setSelectedSolutionProviderId(null);
    };

  return (
    <div>
      {showInCombined ? (
        // showCircleThree ? (
        //   <WebUsecases
        //     selectedIndustry={selectedIndustry}
        //     selectedSector={selectedSector}
        //     selectedTechnology={selectedTechnology}
        //     handleGoSector={handleGoSector}
        //     setSelectedTechnology={setSelectedTechnology}
        //   />
        // ) : (

         ( <WebInCombined
            onWebTechnologyClick={handleWebTechnologyClick}
            selectedIndustry={selectedIndustry}
            selectedSector={selectedSector}
            handleGoSector={handleGoSector}
            setSelectedIndustry={setSelectedIndustry}
            handleBack={handleBack}
            handleExploreClick={handleExploreClick}
            selectedSolutionProviderId={selectedSolutionProviderId}
            setSelectedSectorProviderId={setSelectedSolutionProviderId}
            highlightedIndustry={highlightedIndustry}
            setHighlighedIndustry={setHighlighedIndustry}
          />
        )
      ) : (
        currentCircleView === "sector" && (
          <WebIndustries
            onWebCircleTwoClick={handleWebCircleTwoClick}
            handleSectorClick={handleSectorClick}
            selectedSector={selectedSector}
            showIndustryCircle={showIndustryCircle}
            currentCircleView={currentCircleView}
            handleBack={handleBack}
            handleExploreClick={handleExploreClick}
            selectedSolutionProviderId={selectedSolutionProviderId}
            setSelectedSectorProviderId={setSelectedSolutionProviderId}
            highlightedSectorForGrid={highlightedSectorForGrid}
            setHighlightedSectorForGrid={setHighlightedSectorForGrid}
            highlightedIndustry={highlightedIndustry}
          />
        )
      )}
    </div>
  );
};

export default TrendsWeb;
