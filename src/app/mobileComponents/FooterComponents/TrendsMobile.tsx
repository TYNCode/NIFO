import React, { useState, useEffect, useCallback } from "react";
import Sectors from "../../components/Trends/Sectors";
import SubSectors from "../../components/Trends/SubSectors";
import Industries from "../../components/Trends/Industries";
import CombinedComponent from "../../components/Trends/UsecasesCombined";
import Ecosystem from "../../components/Trends/Ecosystem";
import UsecaseDescription from "../../components/Trends/UsecaseDescription";
import LeftFrame from "@/app/components/LeftFrame/LeftFrame";
import MobileHeader from "../MobileHeader";

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

  console.log("selectedUseCase", ecosystemData);

  const handleUsecaseClick = (usecase) => {
    setSelectedUseCase(usecase);
    localStorage.setItem("selectedUseCase", JSON.stringify(usecase));
    setCurrentStep("usecaseDescription");
  };

  const handleEcosystem = ({ selectedUseCase }) => {
    const ecosystemDataToSave = { selectedUseCase };
    setEcosystemData(selectedUseCase);
    localStorage.setItem("ecosystemData", JSON.stringify(selectedUseCase));
    setCurrentStep("ecosystem");
  };

  const handleBackToUsecases = () => {
    setCurrentStep("usecasesCombined");
  };

  const handleBackToUsecaseDescription = () => {
    setCurrentStep("usecaseDescription");
  };

  const handleBackToSubSectors = () => {
    setCurrentStep("subSectors");
  };

  const handleBackToSectors = () => {
    setCurrentStep("sectors");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-screen-sm mx-auto bg-white min-h-screen">
        {currentStep === "ecosystem" ? (
          <Ecosystem
            ecosystemData={ecosystemData}
            handleBack={handleBackToUsecaseDescription}
          />
        ) : currentStep === "usecaseDescription" ? (
          selectedUseCase ? (
            <UsecaseDescription
              selectedUseCase={selectedUseCase}
              handleEcosystem={handleEcosystem}
              handleBack={handleBackToUsecases}
            />
          ) : (
            <div className="p-4 text-center">
              <p className="text-gray-600 mb-4">No use case selected. Please select a use case.</p>
              <button
                onClick={handleBackToUsecases}
                className="text-primary underline"
              >
                Back to Use Cases
              </button>
            </div>
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
            // handleBack={handleBackToSubSectors}
          />
        ) : currentStep === "subSectors" ? (
          <SubSectors
            selectedSector={selectedSector}
            onIndustryClick={handleIndustryClick}
            // handleBack={handleBackToSectors}
          />
        ) : (
          <Sectors onSectorClick={handleSectorClick} />
        )}
      </div>
    </div>
  );
};

export default TrendsMobile;