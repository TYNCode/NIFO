import React from "react";
import { FaChartBar } from "react-icons/fa";

const stages = [
  { label: "New", value: 12, percentage: 12, color: "#D1D5DB" },
  { label: "Define", value: 6, percentage: 8, color: "#BFDBFE" },
  { label: "Source", value: 8, percentage: 8, color: "#93C5FD" },
  { label: "Engage", value: 12, percentage: 8, color: "#60A5FA" },
  { label: "Evaluate", value: 19, percentage: 8, color: "#3B82F6" },
  { label: "Finalize", value: 11, percentage: 8, color: "#2563EB" },
  { label: "Completed", value: 20, percentage: 8, color: "#1D4ED8" },
  { label: "Cancelled", value: 15, percentage: 8, color: "#6B7280" },
];

const totalProjects = 50;

const ProjectStatusBar: React.FC = () => {
  const handleViewDashboard = () => {
    window.location.href = "/summary";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 items-center">
          <div className="flex items-center space-x-2 mb-1">
            <FaChartBar className="w-5 h-5 text-primary" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Project Status
            </h2>
          </div>
          <div className="hidden sm:block text-sm text-gray-500">
            Total Projects: {totalProjects}
          </div>
        </div>

        <button
          onClick={handleViewDashboard}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-base rounded-lg font-medium transition-colors"
        >
          View Dashboard
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex h-4 rounded-lg overflow-hidden bg-gray-100">
            {stages.map((stage, index) => (
              <div
                key={index}
                className="h-full"
                style={{
                  width: `${(stage.value / totalProjects) * 100}%`,
                  backgroundColor: stage.color,
                }}
              />
            ))}
          </div>
        </div>

        {/* Stage Labels */}
        <div className="grid grid-cols-8 gap-2">
          {stages.map((stage, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                {stage.percentage}%
              </div>
              <div className="flex items-center justify-center space-x-1 text-xs text-gray-600">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: stage.color }}
                />
                <span>{stage.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout - Vertical List */}
      <div className="md:hidden space-y-3">
        {stages.map((stage, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* Stage Label */}
            <div className="w-20 text-sm font-medium text-gray-700">
              {stage.label}
            </div>
            
            {/* Progress Bar */}
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(stage.value / Math.max(...stages.map(s => s.value))) * 100}%`,
                  backgroundColor: stage.color,
                }}
              />
            </div>
            
            {/* Percentage */}
            <div className="w-12 text-sm font-semibold text-gray-900 text-right">
              {stage.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStatusBar;