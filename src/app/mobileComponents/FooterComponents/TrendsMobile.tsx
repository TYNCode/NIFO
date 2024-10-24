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
    const savedEcosystemData = localStorage.getItem("ecosystemData");
    return savedEcosystemData ? JSON.parse(savedEcosystemData) : [];
  });

  const [selectedUseCase, setSelectedUseCase] = useState(() => {
    const savedUseCase = localStorage.getItem("selectedUseCase");
    return savedUseCase ? JSON.parse(savedUseCase) : null;
  });

  const handleUsecaseClick = (usecase) => {
    setSelectedUseCase(usecase);
    setCurrentStep("usecaseDescription");
  };

  const handleEcosystem = ({ selectedUseCase }) => {
    const ecosystemDataToSave = {selectedUseCase};
    setEcosystemData(selectedUseCase);
    setCurrentStep("ecosystem");
  };

  const handleBackToUsecases = () => {
    setCurrentStep("usecasesCombined");
  };

  return (
    <div>
      {currentStep === "ecosystem" ? (
        <Ecosystem
          ecosystemData={ecosystemData}
        />
      ) : currentStep === "usecaseDescription" ? (
        selectedUseCase ? ( 
          <UsecaseDescription
            selectedUseCase={selectedUseCase}
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
          selectedSector={selectedSector}
          selectedUsecase={selectedUseCase}
          setSelectedUseCase={setSelectedUseCase}  
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
