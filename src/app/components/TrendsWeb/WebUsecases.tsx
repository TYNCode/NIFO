import React, { useState } from "react";
import WebTechUsecase from "./WebTechUsecase";
import EcosystemWeb from "./EcosystemWeb";
import StartupsWeb from "./StartupsWeb";
import Usecase from "./Usecase";
import StartupDetailsWeb from "./StartupDetailsWeb";

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

  const handleStartupDetails = ()=>{
    setCurrentView("startupdetail");
  }

  return (
    <div className="flex h-screen relative overflow-hidden select-none">
      <WebTechUsecase
        selectedIndustry={selectedIndustry}
        selectedSector={selectedSector}
      />

      {currentView === "usecase" && (
        <Usecase
          selectedSector={selectedSector}
          onSelectUsecase={handleSelectUsecase}
          selectedTechnology={selectedTechnology}
          selectedIndustry={selectedIndustry}
        />
      )}

      {currentView === "ecosystem" && (
        <EcosystemWeb
          handleExploreClick={handleExploreEcosystem}
          selectedEcosystem={selectedEcosystem}
        />
      )}

      {currentView === "startups" && (
        <StartupsWeb
          handleEcosystem={handleExploreUsecases}
          handleExploreClick={handleStartupDetails}
          selectedEcosystem={selectedEcosystem}
        />
      )}

      {currentView === "startupdetail" && (
        <StartupDetailsWeb selectedEcosystem={selectedEcosystem} />
      )}
    </div>
  );
};

export default WebUsecases;
