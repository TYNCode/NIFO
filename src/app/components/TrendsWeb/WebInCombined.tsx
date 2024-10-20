import React, { useState, useEffect } from "react";
import WebSubIndustries from "./WebSubIndustries";
import WebTechnology from "./WebTechnology";

const WebInCombined = ({ onWebTechnologyClick, selectedIndustry, selectedSector }) => {
  const [showCircleTwo, setShowCircleTwo] = useState(false);

  const handleDotClick = () => {
    setShowCircleTwo(true);
  };

  useEffect(() => {
    console.log("Selected Industry in WebInCombined:", selectedIndustry);
  }, [selectedIndustry]); 

  return (
    <div className="flex h-screen relative overflow-hidden select-none">
      <WebSubIndustries 
      onDotClick={handleDotClick} 
      selectedIndustry={selectedIndustry}
      selectedSector={selectedSector}
      />
      <WebTechnology 
      onDotClick={onWebTechnologyClick} 
      selectedSector={selectedSector}
      selectedIndustry={selectedIndustry}
      />
    </div>
  );
};

export default WebInCombined;
