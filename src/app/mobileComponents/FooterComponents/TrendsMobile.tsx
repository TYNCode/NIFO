import React, { useState, useCallback, useEffect } from "react";
import Sectors from "../../components/Trends/Sectors";
import SubSectors from "../../components/Trends/SubSectors";
import Industries from "../../components/Trends/Industries";
import UsecasesCombined from "../../components/Trends/UsecasesCombined";
import Ecosystem from "../../components/Trends/Ecosystem";
import UsecaseDescription from "../../components/Trends/UsecaseDescription";
import AddTrendsModal from "../../trends/components/AddTrendsModal";

interface TrendsMobileProps {
  selectedSector?: string;
  selectedIndustry?: string;
  selectedSubIndustry?: string;
  selectedTechnology?: string;
  handleSectorClick?: (sector: string) => void;
  handleIndustryClick?: (industry: string) => void;
  handleTechnologyClick?: (tech: string) => void;
  currentStep: string;
  setCurrentStep: (step: string) => void;
}

const TrendsMobile: React.FC<TrendsMobileProps> = ({
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
  const [technologyNames, setTechnologyNames] = useState<string[]>([]);
  const [ecosystemData, setEcosystemData] = useState<any>(() => {
    const saved = localStorage.getItem("ecosystemData");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedUseCase, setSelectedUseCase] = useState<any>(() => {
    const saved = localStorage.getItem("selectedUseCase");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAddTrendModalOpen, setIsAddTrendModalOpen] = useState(false);

  const handleUsecaseClick = useCallback((usecase: any) => {
    setSelectedUseCase(usecase);
    localStorage.setItem("selectedUseCase", JSON.stringify(usecase));
    setCurrentStep("usecaseDescription");
  }, [setCurrentStep]);

  const handleEcosystem = useCallback(({ selectedUseCase }: { selectedUseCase: any }) => {
    setEcosystemData(selectedUseCase);
    localStorage.setItem("ecosystemData", JSON.stringify(selectedUseCase));
    setCurrentStep("ecosystem");
  }, [setCurrentStep]);

  const handleBackToUsecases = () => setCurrentStep("usecasesCombined");
  const handleBackToUsecaseDescription = () => setCurrentStep("usecaseDescription");

  return (
    <div className="w-full max-w-screen-sm mx-auto bg-white min-h-screen pb-4">
      {/* Add Trend Button */}
      <div className="flex justify-end p-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          onClick={() => setIsAddTrendModalOpen(true)}
        >
          Add Trend
        </button>
      </div>
      <AddTrendsModal
        isOpen={isAddTrendModalOpen}
        onClose={() => setIsAddTrendModalOpen(false)}
        sectorOptions={[]}
        industryOptions={[]}
        subIndustryOptions={[]}
        solutionProviderOptions={[]}
      />
      {/* Trends Header */}
      

      {/* Step Content */}
      {(() => {
        switch (currentStep) {
          case "ecosystem":
            return (
              <Ecosystem
                ecosystemData={ecosystemData}
                handleBack={handleBackToUsecaseDescription}
              />
            );
          case "usecaseDescription":
            return selectedUseCase ? (
              <UsecaseDescription
                selectedUseCase={selectedUseCase}
                handleEcosystem={handleEcosystem}
                handleBack={handleBackToUsecases}
              />
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-600 mb-4">No use case selected. Please select a use case.</p>
                <button onClick={handleBackToUsecases} className="text-primary underline">
                  Back to Use Cases
                </button>
              </div>
            );
          default:
            return (
              <UsecasesCombined
                selectedIndustry={selectedIndustry}
                selectedSubindustry={selectedSubIndustry}
                onUsecaseClick={handleUsecaseClick}
                selectedSector={selectedSector}
                selectedUsecase={selectedUseCase}
                setSelectedUseCase={setSelectedUseCase}
              />
            );
        }
      })()}
    </div>
  );
};

export default TrendsMobile;
