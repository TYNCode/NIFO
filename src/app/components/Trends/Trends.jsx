import React, { useState } from "react";
import Sectors from "./Sectors";
import SubSectors from "./SubSectors";
import Industries from "./Industries";
import UseCasesCombined from "./UsecasesCombined"; // Assuming this is your next component

const Trends = () => {
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState(null);

  const handleSectorClick = (sectorName) => {
    setSelectedSector(sectorName); // Set the selected sector when a sector is clicked
  };

  const handleIndustryClick = (industryName) => {
    setSelectedIndustry(industryName); // Set the selected industry when an industry is clicked
  };

  const handleTechnologyClick = (technologyName) => {
    setSelectedTechnology(technologyName); // Set the selected technology when clicked
  };

  return (
    <div>
      {selectedTechnology ? (
        <UseCasesCombined selectedTechnology={selectedTechnology} selectedIndustry={selectedIndustry} />
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

export default Trends;
