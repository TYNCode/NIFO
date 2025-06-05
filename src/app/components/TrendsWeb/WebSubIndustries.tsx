import React, { useState } from "react";
import ThirdLeftCircle from "./ThirdLeftCircle";
import UsecaseGrid from "./UsecaseGrid";
import ExploreUseCase from "./ExploreUsecase";

const WebSubIndustries = ({
    selectedIndustry,
    selectedSector,
    selectedSubIndustry,
    setSelectedSubIndustry,
    setHighlightedSubIndustry,
    handleGoSector,
}) => {
    const [selectedSolutionProviderId, setSelectedSolutionProviderId] = useState(null);

    const handleExploreClick = (useCaseId) => {
        setSelectedSolutionProviderId(useCaseId); // Set the selected use case ID
    };

    const handleBack = () => {
        setSelectedSolutionProviderId(null); // Return to the list view
    };

    const handleDotClick = (subIndustry) => {
        setSelectedSubIndustry(subIndustry);
    };

    return (
        <div className="flex h-screen relative overflow-hidden select-none">
            <ThirdLeftCircle
                onDotClick={handleDotClick}
                selectedIndustry={selectedIndustry}
                selectedSector={selectedSector}
                handleGoSector={handleGoSector}
                onActiveSubSectorChange={setHighlightedSubIndustry}
            />

            {!selectedSolutionProviderId ? (
                <UsecaseGrid
                    selectedSector={selectedSector}
                    selectedIndustry={selectedIndustry}
                    selectedSubIndustry={selectedSubIndustry}
                    onExploreClick={handleExploreClick}
                />
            ) : (
                <ExploreUseCase
                    useCaseId={selectedSolutionProviderId}
                    onBack={handleBack}
                />
            )}
        </div>
    );
};

export default WebSubIndustries;
