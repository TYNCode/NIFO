import React, { useState } from "react";
import Sectors from "../../components/Trends/Sectors";
import SubSectors from "../../components/Trends/SubSectors";
import Industries from "../../components/Trends/Industries";
import CombinedComponent from "../../components/Trends/UsecasesCombined";
import Ecosystem from "../../components/Trends/Ecosystem";
import UsecaseDescription from "../../components/Trends/UsecaseDescription"; // Import UsecaseDescription

const TrendsMobile = ({
  selectedSector,
  selectedIndustry,
  selectedTechnology,
  handleSectorClick,
  handleIndustryClick,
  handleTechnologyClick,
  currentStep,
  setCurrentStep,
}) => {
  const [technologyNames, setTechnologyNames] = useState([]);
  const [ecosystemData, setEcosystemData] = useState([]); // Store startups for Ecosystem
  const [selectedUseCase, setSelectedUseCase] = useState(null); // Track selected use case

  // Handler for when a use case is clicked
  const handleUsecaseClick = (usecase) => {
    setSelectedUseCase(usecase);
    setCurrentStep("usecaseDescription");
  };

  const handleEcosystem = ({ usecase, usecaseDescription, startups }) => {
    setEcosystemData({
      usecase,
      usecaseDescription,
      startups,
    });
    setCurrentStep("ecosystem");
  };

  const handleBackToUsecases = () => {
    setCurrentStep("usecasesCombined");
  };

  return (
    <div>
      {currentStep === "ecosystem" ? (
        <Ecosystem
          usecase={ecosystemData.usecase}
          usecaseDescription={ecosystemData.usecaseDescription}
          startups={ecosystemData.startups}
        />
      ) : currentStep === "usecaseDescription" ? (
        <UsecaseDescription
          usecase={selectedUseCase.usecase}
          usecaseDescription={selectedUseCase.usecaseDescription}
          enhancement={selectedUseCase.Enhancement || ""}
          measureOfImpact={selectedUseCase["Measure of Impact"] || ""}
          startups={selectedUseCase.startups}
          onComplete={handleBackToUsecases}
          handleEcosystem={handleEcosystem}
        />
      ) : currentStep === "usecasesCombined" ? (
        <CombinedComponent
          selectedIndustry={selectedIndustry}
          selectedTechnology={selectedTechnology}
          technologyNames={technologyNames}
          onUsecaseClick={handleUsecaseClick} // Pass handler for use case selection
        />
      ) : currentStep === "industries" ? (
        <Industries
          selectedSector={selectedSector}
          selectedIndustry={selectedIndustry}
          onTechnologyClick={(technology) => {
            handleTechnologyClick(technology);
            setCurrentStep("usecasesCombined");
          }}
          setTechnologyNames={setTechnologyNames}
        />
      ) : currentStep === "subSectors" ? (
        <SubSectors
          selectedSector={selectedSector}
          onIndustryClick={handleIndustryClick}
        />
      ) : (
        <Sectors onSectorClick={handleSectorClick} />
      )}
    </div>
  );
};

export default TrendsMobile;
