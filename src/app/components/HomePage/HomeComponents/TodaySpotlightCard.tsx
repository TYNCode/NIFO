import React from "react";
import { FaStar } from "react-icons/fa";
import { useAppSelector } from "@/app/redux/hooks";
import { Spotlight } from "@/app/admin/spotlights/types/spotlights";
import { selectSpotlights } from "@/app/redux/features/spotlight/spotlightSlice";

const TodaysSpotlightCard: React.FC = () => {
  const spotlights = useAppSelector(selectSpotlights);

  const latest = [...spotlights]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

  const spotlightData: Partial<Spotlight> & {
    spotlight_title: string;
    spotlight_category: string;
    problem_address: string;
    logo_url?: string | null;
    is_tyn_verified?: boolean;
  } = latest || {
    spotlight_title: "How SparkBeyond Transforms Problem Solving with AI-Powered Discovery",
    spotlight_category: "AI-Driven Discovery",
    problem_address: "Traditional problem-solving approaches are often constrained by human cognitive biases...",
    logo_url: null,
    is_tyn_verified: true,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaStar className="text-gray-500 w-4 h-4" />
          <h2 className="text-lg font-semibold text-gray-900">Today's spotlight</h2>
        </div>
        {spotlightData.is_tyn_verified && (
          <span className="px-3 py-1 bg-yellow-400 text-white text-xs font-medium rounded-md">
            TYN Verified
          </span>
        )}
      </div>

      {/* Logo and Title */}
      <div className="flex items-start space-x-4 mb-4">
        {spotlightData.logo_url ? (
          <img
            src={spotlightData.logo_url}
            alt="Startup Logo"
            className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-2"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="w-8 h-6 bg-white rounded-sm"></div>
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            {spotlightData.spotlight_title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-50 text-primary text-xs font-medium rounded">
              AI
            </span>
            <span className="px-2 py-0.5 bg-blue-50 text-primary text-xs font-medium rounded">
              {spotlightData.spotlight_category}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {spotlightData.problem_address}
      </p>

      {/* CTA */}
      <div className="flex justify-end">
        <a
          href="/spotlights"
          className="text-sm text-primary font-medium hover:underline"
        >
          Explore spotlights →
        </a>
      </div>
    </div>
  );
};

export default TodaysSpotlightCard;
