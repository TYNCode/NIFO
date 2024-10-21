import React, { useState } from "react";
import WebTechUsecase from "./WebTechUsecase";
import EcosystemWeb from "./EcosystemWeb";
import StartupsWeb from "./StartupsWeb";
import Usecase from "./Usecase";

const WebUsecases = ({selectedIndustry , selectedSector , selectedTechnology}) => {
  const [currentView, setCurrentView] = useState("usecase"); 
  const [selectedEcosystem, setSelectedEcosystem] = useState(null);

  const handleExploreEcosystem = () => {
    setCurrentView("startups");
  };

  const handleExploreUsecases = () => {
    setCurrentView("ecosystem");
  };

  const handleSelectUsecase = (ecosystem) => {
    setSelectedEcosystem(ecosystem); 
    setCurrentView("ecosystem"); 
  };

  return (
    <div className="flex h-screen relative overflow-hidden select-none">
      <WebTechUsecase
        selectedIndustry={selectedIndustry}
        selectedSector={selectedSector}
      />

      {currentView === "usecase" && (
        <Usecase
          onSelectUsecase={handleSelectUsecase}
          selectedTechnology={selectedTechnology}
        />
      )}

      {currentView === "ecosystem" && (
        <EcosystemWeb
          handleExploreClick={handleExploreEcosystem}
          selectedEcosystem={selectedEcosystem}
        />
      )}

      {currentView === "startups" && (
        <StartupsWeb handleEcosystem={handleExploreUsecases} />
      )}
    </div>
  );
};

export default WebUsecases;
