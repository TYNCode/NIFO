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
  selectedSubIndustry,
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

  // 👇 COMMENTED OUT unused steps
  // const handleBackToSubSectors = () => {
  //   setCurrentStep("subSectors");
  // };

  // const handleBackToSectors = () => {
  //   setCurrentStep("sectors");
  // };

  return (
    <div className="w-full max-w-screen-sm mx-auto bg-white">
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
      ) : (
        // Force default to "usecasesCombined"
        <CombinedComponent
          selectedIndustry={selectedIndustry}
          selectedSubindustry={selectedSubIndustry}
          onUsecaseClick={handleUsecaseClick}
          selectedSector={selectedSector}
          selectedUsecase={selectedUseCase}
          setSelectedUseCase={setSelectedUseCase}
        />
      )}
    </div>
  );
};

export default TrendsMobile;
