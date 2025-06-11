import React, { useState, useEffect } from "react";
import Usecases from "./Usecases";

const UsecasesCombined = ({
  selectedSector,
  selectedIndustry,
  selectedSubindustry,
  onUsecaseClick,
  selectedUsecase,
  setSelectedUseCase,
}) => {
  const [sector, setSector] = useState(selectedSector || "");
  const [industry, setIndustry] = useState(selectedIndustry || "");
  const [subindustry, setSubindustry] = useState(selectedSubindustry || "");

  const [sectorOptions, setSectorOptions] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [subindustryOptions, setSubindustryOptions] = useState([]);


  useEffect(() => {
    fetch("https://tyn-server.azurewebsites.net/trends/")
      .then((res) => res.json())
      .then((data) => {
        // Unique sectors
        const sectors = [...new Set(data.map((d) => d.sector))];

        // Industries for selected sector
        const filteredIndustries = data
          .filter((d) => d.sector === sector)
          .map((d) => d.industry);
        const industries = [...new Set(filteredIndustries)];

        // Subindustries for selected sector + industry
        const filteredSubs = data
          .filter((d) => d.sector === sector && d.industry === industry)
          .map((d) => d.sub_industry);
        const subs = [...new Set(filteredSubs)];

        setSectorOptions(sectors);
        setIndustryOptions(industries);
        setSubindustryOptions(subs);
      });
  }, [sector, industry]);

  return (
    <div className="flex flex-col gap-4 p-4 h-[90dvh]">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Sector Dropdown */}
        <select
          className="px-4 py-2 border border-gray-300 rounded"
          value={sector}
          onChange={(e) => {
            setSector(e.target.value);
            setIndustry("");
            setSubindustry("");
          }}
        >
          <option value="">Select Sector</option>
          {sectorOptions.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>

        {/* Industry Dropdown */}
        <select
          className="px-4 py-2 border border-gray-300 rounded"
          value={industry}
          onChange={(e) => {
            setIndustry(e.target.value);
            setSubindustry("");
          }}
          disabled={!sector}
        >
          <option value="">Select Industry</option>
          {industryOptions.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>

        {/* Subindustry Dropdown */}
        <select
          className="px-4 py-2 border border-gray-300 rounded"
          value={subindustry}
          onChange={(e) => setSubindustry(e.target.value)}
          disabled={!industry}
        >
          <option value="">Select Subindustry</option>
          {subindustryOptions.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-grow">
        <Usecases
          selectedSector={sector}
          selectedIndustry={industry}
          selectedSubindustry={subindustry}
          onUsecaseClick={onUsecaseClick}
        />
      </div>
    </div>
  );
};

export default UsecasesCombined;
