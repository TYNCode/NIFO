"use client";
import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
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

  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showSubindustryDropdown, setShowSubindustryDropdown] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch("https://tyn-server.azurewebsites.net/trends/");
        const data = await res.json();

        const normalize = (arr) => [...new Set(arr.filter(Boolean))];

        setSectorOptions(normalize(data.map((d) => d.sector)));
        setIndustryOptions(
          normalize(
            data.filter((d) => d.sector === sector).map((d) => d.industry)
          )
        );
        setSubindustryOptions(
          normalize(
            data
              .filter((d) => d.sector === sector && d.industry === industry)
              .map((d) => d.sub_industry)
          )
        );
      } catch (err) {
        console.error("Error fetching dropdown options:", err);
      }
    };

    fetchOptions();
  }, [sector, industry]);

  const Dropdown = ({
    label,
    selected,
    options,
    onSelect,
    showDropdown,
    setShowDropdown,
    disabled,
  }) => (
    <div className="relative w-full">
      <button
        disabled={disabled}
        onClick={() => setShowDropdown(!showDropdown)}
        className={`w-full flex items-center justify-between px-4 py-2 rounded-md border border-gray-300 text-sm font-medium ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-primary hover:bg-primary/10"
        }`}
      >
        {selected || label}
        <FaChevronDown
          className={`text-xs transition-transform ${showDropdown ? "rotate-180" : ""}`}
        />
      </button>
      {showDropdown && (
        <div className="absolute top-full left-0 z-10 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 max-h-60 overflow-auto">
          <button
            onClick={() => {
              onSelect("");
              setShowDropdown(false);
            }}
            className="w-full text-left text-sm px-4 py-2 hover:bg-blue-50 first:rounded-t-md"
          >
            {label}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onSelect(opt);
                setShowDropdown(false);
              }}
              className="w-full text-left text-sm px-4 py-2 hover:bg-blue-50"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4 h-[90dvh]">
      <div className="text-xl font-semibold pt-2 text-primary">Trends</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Dropdown
          label="All Sectors"
          selected={sector}
          options={sectorOptions}
          onSelect={(val) => {
            setSector(val);
            setIndustry("");
            setSubindustry("");
          }}
          showDropdown={showSectorDropdown}
          setShowDropdown={setShowSectorDropdown}
        />
        <Dropdown
          label="All Industries"
          selected={industry}
          options={industryOptions}
          onSelect={(val) => {
            setIndustry(val);
            setSubindustry("");
          }}
          showDropdown={showIndustryDropdown}
          setShowDropdown={setShowIndustryDropdown}
          disabled={!sector}
        />
        <Dropdown
          label="All Subindustries"
          selected={subindustry}
          options={subindustryOptions}
          onSelect={setSubindustry}
          showDropdown={showSubindustryDropdown}
          setShowDropdown={setShowSubindustryDropdown}
          disabled={!industry}
        />
      </div>

      <div className="flex-grow mt-4">
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
