import React, { useState } from "react";
import UsecasesArc from "./UsecasesArc";
import Usecases from "./Usecases";

const UsecasesCombined = ({
  selectedSector, 
  selectedIndustry,
  selectedTechnology,
  technologyNames,
  onUsecaseClick, 
  selectedUsecase, 
  setSelectedUseCase
}) => {
  return (
    <div className="flex flex-col justify-between h-screen">
      <div className="flex-grow-0">
        <UsecasesArc
          selectedIndustry={selectedIndustry}
          selectedTechnology={selectedTechnology}
          OriginalTechnologyNames={technologyNames}
          selectedSector={selectedSector}
        />
      </div>

      <div className="flex-grow-0 pb-16">
        <Usecases
          selectedIndustry={selectedIndustry}
          selectedTechnology={selectedTechnology}
          onUsecaseClick={onUsecaseClick} 
          selectedSector={selectedSector}
        />
      </div>
    </div>
  );
};

export default UsecasesCombined;
