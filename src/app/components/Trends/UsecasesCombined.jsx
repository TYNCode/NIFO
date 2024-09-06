import React, { useState } from "react";
import UsecasesArc from "./UsecasesArc";
import Usecases from "./Usecases";

const CombinedComponent = ({
  selectedIndustry,
  selectedTechnology,
  technologyNames,
  onUsecaseClick, // Pass the handler from TrendsMobile
}) => {
  return (
    <div className="flex flex-col justify-between h-screen">
      {/* UsecasesArc at the top */}
      <div className="flex-grow-0">
        <UsecasesArc
          selectedIndustry={selectedIndustry}
          selectedTechnology={selectedTechnology}
          OriginalTechnologyNames={technologyNames}
        />
      </div>

      {/* Usecases component at the bottom */}
      <div className="flex-grow-0 pb-16">
        <Usecases
          selectedIndustry={selectedIndustry}
          selectedTechnology={selectedTechnology}
          onUsecaseClick={onUsecaseClick} // Pass handler to receive selected use case
        />
      </div>
    </div>
  );
};

export default CombinedComponent;
