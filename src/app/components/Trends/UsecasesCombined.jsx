import React from "react";
import UsecasesArc from "./UsecasesArc";
import Usecases from "./Usecases";

const CombinedComponent = ({ selectedIndustry, selectedTechnology }) => {

  console.log("CombinedComponent", selectedIndustry, selectedTechnology)
  return (
    <div className="flex flex-col justify-between h-screen">
      {/* UsecasesArc arc at the top */}
      <div className="flex-grow-0 ">
        <UsecasesArc
          selectedIndustry={selectedIndustry}
          selectedTechnology={selectedTechnology}
        />
      </div>

      {/* Usecases component at the bottom */}
      <div className="flex-grow-0 pb-16">
        <Usecases
          selectedIndustry={selectedIndustry}
          selectedTechnology={selectedTechnology}
        />
      </div>
    </div>
  );
};

export default CombinedComponent;
