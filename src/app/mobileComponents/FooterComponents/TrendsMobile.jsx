import React, { useState } from "react";
import Sectors from "../../components/Trends/Sectors";
import SubSectors from "../../components/Trends/SubSectors";
import Industries from "../../components/Trends/Industries";
import UseCasesCombined from "../../components/Trends/UsecasesCombined";
import UsecaseDescription from "../../components/Trends/UsecaseDescription";
import Ecosystem from "../../components/Trends/Ecosystem";

const TrendsMobile = ({
  selectedSector,
  selectedIndustry,
  selectedTechnology,
  handleSectorClick,
  handleIndustryClick,
  handleTechnologyClick,
}) => {
  const [technologyNames, setTechnologyNames] = useState([]);
  const [currentStep, setCurrentStep] = useState("trends"); // Track the current step
  const [selectedUseCase, setSelectedUseCase] = useState(null); // Track selected use case

  // Function to handle technology selection and move to UseCasesCombined
  const handleTechnologySelection = (technology) => {
    handleTechnologyClick(technology); // Call the original handler
    setCurrentStep("useCasesCombined"); // Move to UseCasesCombined step
  };

  // Function to handle use case selection and move to UsecaseDescription
  const handleUseCaseSelection = (usecase) => {
    setSelectedUseCase(usecase); // Store the selected use case
    setCurrentStep("usecaseDescription"); // Move to UsecaseDescription step
  };

  // Function to move to the Ecosystem step
  const handleUsecaseDescriptionComplete = () => {
    setCurrentStep("ecosystem"); // Move to Ecosystem step
  };

  // Function to handle exploring the ecosystem
  const handleEcosystem = () => {
    console.log("handleExploreEcosystem called");
  };

  return (
    <div>
      {currentStep === "ecosystem" ? (
        <Ecosystem selectedTechnology={selectedTechnology} />
      ) : currentStep === "usecaseDescription" ? (
        <UsecaseDescription
          selectedTechnology={selectedTechnology}
          selectedUseCase={selectedUseCase} // Pass the selected use case to the description
          onComplete={handleUsecaseDescriptionComplete} // Callback to move to Ecosystem
          handleEcosystem={handleEcosystem} // Pass the explore ecosystem handler
        />
      ) : currentStep === "useCasesCombined" ? (
        <UseCasesCombined
          selectedTechnology={selectedTechnology}
          selectedIndustry={selectedIndustry}
          technologyNames={technologyNames} // Pass technologyNames here
          onUseCaseClick={handleUseCaseSelection} // Trigger transition to UsecaseDescription
        />
      ) : selectedIndustry ? (
        <Industries
          selectedSector={selectedSector}
          selectedIndustry={selectedIndustry}
          onTechnologyClick={handleTechnologySelection} // Trigger transition to UseCasesCombined
          setTechnologyNames={setTechnologyNames} // Pass the updater function here
        />
      ) : selectedSector ? (
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
