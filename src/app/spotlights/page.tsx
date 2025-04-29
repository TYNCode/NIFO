"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSpotlights } from "../redux/features/spotlight/spotlightSlice";
import { encryptURL } from "../utils/shareUtils";
import LeftFrame from "../components/LeftFrame/LeftFrame"; // Update the path based on where LeftFrame is

const SpotlightPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { spotlights, loading, error } = useAppSelector((state) => state.spotlight);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<string>("");

  useEffect(() => {
    dispatch(fetchSpotlights());
  }, [dispatch]);

  const handleViewDetails = (spotlightId: number) => {
    const encryptedId = encryptURL(spotlightId.toString());
    router.push(`/spotlights/${encryptedId}`);
  };

  const categories = Array.from(
    new Set(spotlights.map((s: any) => s.spotlight_category).filter(Boolean))
  );
  const weeks = Array.from(
    new Set(spotlights.map((s: any) => s.spotlight_week).filter(Boolean))
  );

  const filteredSpotlights = spotlights.filter((spotlight: any) => {
    const matchesCategory = selectedCategory ? spotlight.spotlight_category === selectedCategory : true;
    const matchesWeek = selectedWeek ? spotlight.spotlight_week === selectedWeek : true;
    return matchesCategory && matchesWeek;
  });

  return (
    <main className="flex flex-row w-full h-screen">
      {/* Left Sidebar */}
      <div className="">
        <LeftFrame />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full h-full p-6 bg-[#F8FBFF] overflow-y-auto">
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">
          Startup Innovation Spotlight
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="px-4 py-2 bg-white border rounded-md text-gray-600 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Technologies</option>
            {categories.map((category, idx) => (
              <option key={idx} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 bg-white border rounded-md text-gray-600 text-sm"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
          >
            <option value="">All Weeks</option>
            {weeks.map((week, idx) => (
              <option key={idx} value={week}>
                {week}
              </option>
            ))}
          </select>
        </div>

        {/* Spotlights */}
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSpotlights.length > 0 ? (
              filteredSpotlights.map((spotlight: any) => (
                <div
                  key={spotlight.id}
                  className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={spotlight.logo_url || "/nifo.svg"}
                      alt={spotlight.spotlight_title}
                      className="h-12 w-12 object-contain"
                    />
                    <div>
                      <h2 className="font-semibold text-lg">{spotlight.spotlight_title}</h2>
                      {spotlight.spotlight_category && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {spotlight.spotlight_category}
                        </span>
                      )}
                    </div>
                  </div>

                  {spotlight.spotlight_subtitle && (
                    <div className="text-gray-600 text-sm mb-6">
                      {spotlight.spotlight_subtitle}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      className="text-blue-500 text-sm font-semibold flex items-center gap-1 hover:underline"
                      onClick={() => handleViewDetails(spotlight.id)}
                    >
                      View details →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400">
                No spotlights found for selected filters.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default SpotlightPage;
