import React from "react";
import TodaysSpotlightCard from "./TodaySpotlightCard";
import IndustryTrendsCard from "./IndustryTrendCard";
import ProjectStatusBar from "./ProjectStatusCard";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";

const HomeComponents = () => {
  const router = useRouter();

  const handleCreateProject = () => {
    router.push("/coinnovation");
  };

  return (
    <div className="space-y-3 px-10">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Home</h1>
        <button
          onClick={handleCreateProject}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <FaPlus className="text-sm" />
          Create Project
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaysSpotlightCard />
        <IndustryTrendsCard />
      </div>

      {/* Project Status */}
      <ProjectStatusBar />
    </div>
  );
};

export default HomeComponents;
