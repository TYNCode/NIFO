import React from "react";
import { LuLayoutList, LuLayoutGrid } from "react-icons/lu";

interface ViewModeToggleProps {
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex bg-white border border-gray-200 rounded-lg p-2 gap-2">
        <button
          onClick={() => onViewModeChange("table")}
          className={`p-2 shadow-md rounded text-sm transition-all duration-200 ${
            viewMode === "table" 
              ? "bg-primary text-white" 
              : "text-black hover:bg-gray-100"
          }`}
          title="Table View"
        >
          <LuLayoutList className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange("grid")}
          className={`p-2 shadow-md rounded text-sm transition-all duration-200 ${
            viewMode === "grid" 
              ? "bg-primary text-white" 
              : "text-black hover:bg-gray-100"
          }`}
          title="Grid View"
        >
          <LuLayoutGrid className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ViewModeToggle;