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

  const handleSectorClick = (sector) => {
    setSelectedSector(sector);
    setShowIndustryCircle(true);
  };

  const handleWebCircleTwoClick = (industry) => {
    setSelectedIndustry(industry);
    setShowInCombined(true);
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
  };

  return (
    <div>
      {showInCombined ? (
        showCircleThree ? (
          <WebUsecases
            selectedIndustry={selectedIndustry}
            selectedSector={selectedSector}
            selectedTechnology={selectedTechnology}
            handleGoSector={handleGoSector}
            setSelectedTechnology={setSelectedTechnology}
          />
        ) : (
          <WebInCombined
            onWebTechnologyClick={handleWebTechnologyClick}
            selectedIndustry={selectedIndustry}
            selectedSector={selectedSector}
            handleGoSector={handleGoSector}
            setSelectedIndustry={setSelectedIndustry}
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
          />
        )
      )}
    </div>
  );
};

export default TrendsWeb;
