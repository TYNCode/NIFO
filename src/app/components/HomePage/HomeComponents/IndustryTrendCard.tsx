import React from "react";
import { FaArrowTrendUp } from "react-icons/fa6";

const IndustryTrendsCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaArrowTrendUp className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Industry Trends</h2>
        </div>
        <span className="px-3 py-1 bg-yellow-400 text-white text-xs font-medium rounded-md">
          TYN Verified
        </span>
      </div>

      {/* Logo + Title + Tags */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <span className="text-orange-600 font-bold text-xs">symbio</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">
            AI powered Automation in Traditional assembly line
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-50 text-primary text-xs font-medium rounded">
              AI
            </span>
            <span className="px-2 py-1 bg-blue-50 text-primary text-xs font-medium rounded">
              Automobile
            </span>
            <span className="px-2 py-1 bg-blue-50 text-primary text-xs font-medium rounded">
              Manufacturing
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">
        Ripik.AI is an industrial AI company developing computer vision agents for 
        real-time monitoring in manufacturing sectors like steel, cement, and 
        chemicals, aiming to reduce process variability and enhance operational 
        efficiency.
      </p>

      {/* CTA */}
      <div className="flex justify-end">
        <a
          href="/trends"
          className="text-sm text-primary font-medium hover:underline"
        >
          Explore trends →
        </a>
      </div>
    </div>
  );
};

export default IndustryTrendsCard;
