import React from "react";
import FirstLeftCircle from "./FirstLeftCircle";
import FirstRightCircle from "./FirstRightCircle";

const WebIndustries = ({
  onWebCircleTwoClick,
  handleSectorClick,
  selectedSector,
  showIndustryCircle,
  currentCircleView
}) => {
  return (
    <div className="flex h-screen relative  overflow-hidden select-none">
      {currentCircleView === "sector" && (
        <FirstLeftCircle onDotClick={handleSectorClick} />
      )}

      {showIndustryCircle && (
        <FirstRightCircle
          selectedSector={selectedSector}
          onDotClick={onWebCircleTwoClick}
        />
      )}
    </div>
  );
};

export default WebIndustries;
