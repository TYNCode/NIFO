import React, { useState } from "react";
import WebTechUsecase from "./WebTechUsecase";
import EcosystemWeb from "./EcosystemWeb";
import StartupsWeb from "./StartupsWeb";
import Usecase from "./Usecase";
import StartupDetailsWeb from "./StartupDetailsWeb";

const WebUsecases = ({ selectedIndustry, selectedSector, handleGoSector , selectedTechnology, setSelectedTechnology}) => {
  const [currentView, setCurrentView] = useState("usecase");
  const [selectedEcosystem, setSelectedEcosystem] = useState(null);
  const [selectedStartup, setSelectedStartup] = useState(null);  // For holding the selected startup details

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

  const handleStartupDetails = (startup) => {
    setSelectedStartup(startup);  // Pass the selected startup data
    setCurrentView("startupdetail");
  };

  const handleClose = () => {
    setCurrentView("usecase");
  };

  const handleTechnologyClick = (technology) => {
    setSelectedTechnology(technology); 
    setCurrentView("usecase");
  };

  return (
    <div className="flex h-screen relative select-none">
      <WebTechUsecase
        selectedIndustry={selectedIndustry}
        selectedSector={selectedSector}
        handleGoSector={handleGoSector}
        onTechnologyClick={handleTechnologyClick} 
        selectedTechnology={selectedTechnology}
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
          handleClose={handleClose}
        />
      )}

      {currentView === "startups" && (
        <StartupsWeb
          handleEcosystem={handleExploreUsecases}
          handleExploreClick={handleStartupDetails}  // Pass selected startup on click
          selectedEcosystem={selectedEcosystem}
          handleClose={handleClose}
        />
      )}

      {currentView === "startupdetail" && (
        <StartupDetailsWeb
          selectedStartup={selectedStartup} 
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default WebUsecases;
