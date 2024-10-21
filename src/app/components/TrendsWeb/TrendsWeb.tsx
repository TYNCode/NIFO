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

 
   const handleSectorClick = (sector) => {
     setSelectedSector(sector);
     setShowIndustryCircle(true);
   };

  const handleWebCircleTwoClick = (industry) => {
    setSelectedIndustry(industry); 
    setShowInCombined(true);
  };

  const handleWebTechnologyClick = (technology) => {
    setSelectedTechnology(technology)
    setShowCircleThree(true);
  };

  return (
    <div>
      {showInCombined ? (
        showCircleThree ? (
          <WebUsecases 
          selectedIndustry={selectedIndustry}
          selectedSector = {selectedSector}
          selectedTechnology={selectedTechnology}
          />
        ) : (
          <WebInCombined
            onWebTechnologyClick={handleWebTechnologyClick}
            selectedIndustry={selectedIndustry}
            selectedSector={selectedSector}
          />
        )
      ) : (
        <WebIndustries
          onWebCircleTwoClick={handleWebCircleTwoClick}
          handleSectorClick={handleSectorClick}
          selectedSector={selectedSector}
          showIndustryCircle={showIndustryCircle}
        />
      )}
    </div>
  );
};

export default TrendsWeb;