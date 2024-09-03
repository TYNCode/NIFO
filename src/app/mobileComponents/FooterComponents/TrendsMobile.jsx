import React from "react";
import Sectors from "../../components/Trends/Sectors";
import SubSectors from "../../components/Trends/SubSectors";
import Industries from "../../components/Trends/Industries";
import UseCasesCombined from "../../components/Trends/UsecasesCombined";

const TrendsMobile = ({
  selectedSector,
  selectedIndustry,
  selectedTechnology,
  handleSectorClick,
  handleIndustryClick,
  handleTechnologyClick,
}) => {
  return (
    <div>
      {selectedTechnology ? (
        <UseCasesCombined
          selectedTechnology={selectedTechnology}
          selectedIndustry={selectedIndustry}
        />
      ) : selectedIndustry ? (
        <Industries
          selectedSector={selectedSector}
          selectedIndustry={selectedIndustry}
          onTechnologyClick={handleTechnologyClick}
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
