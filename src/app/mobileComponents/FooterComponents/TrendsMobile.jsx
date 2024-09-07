import React, { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";
import Sectors from "../../components/Trends/Sectors";
import SubSectors from "../../components/Trends/SubSectors";
import Industries from "../../components/Trends/Industries";
import CombinedComponent from "../../components/Trends/UsecasesCombined";
import Ecosystem from "../../components/Trends/Ecosystem";
import UsecaseDescription from "../../components/Trends/UsecaseDescription";

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
  const [ecosystemData, setEcosystemData] = useState(() => {
    // Retrieve data from localStorage on component mount
    const savedEcosystemData = localStorage.getItem("ecosystemData");
    return savedEcosystemData ? JSON.parse(savedEcosystemData) : [];
  });

  const [selectedUseCase, setSelectedUseCase] = useState(() => {
    // Retrieve data from localStorage on component mount
    const savedUseCase = localStorage.getItem("selectedUseCase");
    return savedUseCase ? JSON.parse(savedUseCase) : null;
  });

  // Handler for when a use case is clicked
  const handleUsecaseClick = (usecase) => {
    setSelectedUseCase(usecase);
    localStorage.setItem("selectedUseCase", JSON.stringify(usecase)); // Save to localStorage
    setCurrentStep("usecaseDescription");
  };

  const handleEcosystem = ({ usecase, usecaseDescription, startups }) => {
    const ecosystemDataToSave = {
      usecase,
      usecaseDescription,
      startups,
    };
    setEcosystemData(ecosystemDataToSave);
    localStorage.setItem("ecosystemData", JSON.stringify(ecosystemDataToSave)); // Save to localStorage
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
        selectedUseCase ? (
          <UsecaseDescription
            usecase={selectedUseCase?.usecase || "No Usecase Available"}
            usecaseDescription={
              selectedUseCase?.usecaseDescription || "No Description Available"
            }
            enhancement={selectedUseCase?.Enhancement || ""}
            measureOfImpact={selectedUseCase?.["Measure of Impact"] || ""}
            startups={selectedUseCase?.startups || [] }
            onComplete={handleBackToUsecases}
            handleEcosystem={handleEcosystem}
          />
        ) : (
          <div>No use case selected. Please select a use case.</div>
        )
      ) : currentStep === "usecasesCombined" ? (
        <CombinedComponent
          selectedIndustry={selectedIndustry}
          selectedTechnology={selectedTechnology}
          technologyNames={technologyNames}
          onUsecaseClick={handleUsecaseClick}
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
