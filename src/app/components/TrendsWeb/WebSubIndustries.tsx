import React from 'react';
import ThirdLeftCircle from './ThirdLeftCircle';
import UsecaseGrid from './UsecaseGrid';
import ExploreSolutionProvider from './ExploreSolutionProvider';

const WebSubIndustries = ({
    selectedIndustry,
    selectedSector,
    selectedSubIndustry,
    setSelectedSubIndustry,
    setHighlightedSubIndustry,
    selectedSolutionProviderId,
    handleExploreClick,
    handleBack,
    handleGoSector,
}) => {
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
                <ExploreSolutionProvider
                    solutionProviderId={selectedSolutionProviderId}
                    onBack={handleBack}
                />
            )}
        </div>
    );
};

export default WebSubIndustries;
