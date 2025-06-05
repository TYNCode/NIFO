// app/admin/spotlights/components/SpotlightFilters.tsx

import React from "react";
import { FaChevronDown } from "react-icons/fa";

const ANALYST_OPTIONS = [
  { value: "gartner", label: "Gartner" },
  { value: "mckinsey", label: "McKinsey" },
  { value: "forrester", label: "Forrester" },
];

interface SpotlightFiltersProps {
  selectedAnalyst: string;
  onAnalystChange: (analyst: string) => void;
  filters: { TYNVerified: boolean };
  onFilterToggle: () => void;
  hasActiveFilters: boolean;
  onClearAll: () => void;
  showAnalystDropdown: boolean;
  setShowAnalystDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpotlightFilters: React.FC<SpotlightFiltersProps> = ({
  selectedAnalyst,
  onAnalystChange,
  filters,
  onFilterToggle,
  hasActiveFilters,
  onClearAll,
  showAnalystDropdown,
  setShowAnalystDropdown,
}) => {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex items-center gap-4 xl:gap-6 bg-white rounded-xl p-3 xl:p-4 mt-4 lg:mt-0">
        <div className="relative dropdown-container">
          <button
            onClick={() => setShowAnalystDropdown(!showAnalystDropdown)}
            className="flex items-center gap-2 px-3 w-36 xl:px-4 py-2 bg-blue-100 rounded-lg text-sm text-primary font-medium transition-colors justify-between"
          >
            {selectedAnalyst
              ? ANALYST_OPTIONS.find((opt) => opt.value === selectedAnalyst)?.label || selectedAnalyst
              : "All Analysts"}
            <FaChevronDown className={`text-xs transition-transform ${showAnalystDropdown ? "rotate-180" : ""}`} />
          </button>

          {showAnalystDropdown && (
            <div className="absolute top-full left-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                onClick={() => onAnalystChange("")}
                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-100 first:rounded-t-lg"
              >
                All Analysts
              </button>
              {ANALYST_OPTIONS.map((analyst) => (
                <button
                  key={analyst.value}
                  onClick={() => onAnalystChange(analyst.value)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-blue-100 last:rounded-b-lg"
                >
                  {analyst.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700 font-medium">TYN Verified</span>
          <button
            onClick={onFilterToggle}
            className={`w-12 h-6 rounded-full transition-all duration-200 ${
              filters.TYNVerified ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                filters.TYNVerified ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {hasActiveFilters && (
          <button onClick={onClearAll} className="text-sm text-primary font-medium">
            Clear All
          </button>
        )}
      </div>

      {/* Mobile */}
      <div className="lg:hidden mb-6 bg-white rounded-xl p-4 shadow-sm border">
        <div className="space-y-4">
          <div className="relative dropdown-container">
            <button
              onClick={() => setShowAnalystDropdown(!showAnalystDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
              {selectedAnalyst
                ? ANALYST_OPTIONS.find((opt) => opt.value === selectedAnalyst)?.label || selectedAnalyst
                : "All Analysts"}
              <FaChevronDown className={`text-xs transition-transform ${showAnalystDropdown ? "rotate-180" : ""}`} />
            </button>

            {showAnalystDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => onAnalystChange("")}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 first:rounded-t-lg"
                >
                  All Analysts
                </button>
                {ANALYST_OPTIONS.map((analyst) => (
                  <button
                    key={analyst.value}
                    onClick={() => onAnalystChange(analyst.value)}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 last:rounded-b-lg"
                  >
                    {analyst.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">TYN Verified</span>
            <button
              onClick={onFilterToggle}
              className={`w-12 h-6 rounded-full transition-all duration-200 ${
                filters.TYNVerified ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  filters.TYNVerified ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="w-full py-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SpotlightFilters;
