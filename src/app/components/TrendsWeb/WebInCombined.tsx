import React, { useState, useEffect } from "react";
import WebSubIndustries from "./WebSubIndustries";
import WebTechnology from "./WebTechnology";

const WebInCombined = ({ onWebTechnologyClick, selectedIndustry }) => {
  const [showCircleTwo, setShowCircleTwo] = useState(false);

  const handleDotClick = () => {
    setShowCircleTwo(true);
  };

  useEffect(() => {
    console.log("Selected Industry in WebInCombined:", selectedIndustry);
  }, [selectedIndustry]); 

  return (
    <div className="flex h-screen relative overflow-hidden select-none">
      <WebSubIndustries onDotClick={handleDotClick} />
      <WebTechnology onDotClick={onWebTechnologyClick} />
    </div>
  );
};

export default WebInCombined;
