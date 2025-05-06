"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSpotlights } from "../redux/features/spotlight/spotlightSlice";
import { encryptURL } from "../utils/shareUtils";
import LeftFrame from "../components/LeftFrame/LeftFrame";
import { FaChevronDown } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const SpotlightPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { spotlights, loading, error } = useAppSelector(
    (state) => state.spotlight
  );

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showWeekDropdown, setShowWeekDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchSpotlights());
  }, [dispatch]);

  const handleViewDetails = (spotlightId) => {
    const encryptedId = encryptURL(spotlightId.toString());
    router.push(`/spotlights/${encryptedId}`);
  };

  const categories = Array.from(
    new Set(spotlights.map((s) => s.spotlight_category).filter(Boolean))
  );
  const weeks = Array.from(
    new Set(spotlights.map((s) => s.spotlight_week).filter(Boolean))
  );

  const filteredSpotlights = spotlights.filter((spotlight) => {
    const matchesCategory = selectedCategory
      ? spotlight.spotlight_category === selectedCategory
      : true;
    const matchesWeek = selectedWeek
      ? spotlight.spotlight_week === selectedWeek
      : true;
    return matchesCategory && matchesWeek;
  });

  return (
    <main className="flex w-full h-screen overflow-hidden">
      <div>
        <LeftFrame />
      </div>

      <div className="flex flex-col w-full bg-[#F4FCFF]">
        <div className="w-[90%] px-6 pt-6 flex justify-between">
          <h1 className="text-2xl text-left font-semibold text-gray-700">
            Startup Innovation Spotlight
          </h1>
          <div className="flex gap-4">
            <div className="relative">
              <div
                className="px-4 py-2 bg-[#2286C0] text-white border rounded-xl text-sm flex items-center justify-between cursor-pointer"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                {selectedCategory || "All Technologies"}{" "}
                <FaChevronDown className="ml-2" />
              </div>
              {showCategoryDropdown && (
                <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-md z-10">
                  <div
                    className="px-4 py-2 text-gray-600 text-sm cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSelectedCategory("");
                      setShowCategoryDropdown(false);
                    }}
                  >
                    All Technologies
                  </div>
                  {categories.map((category, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 text-gray-600 text-sm cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <div
                className="px-4 py-2 bg-white text-[#2286C0] border border-solid border-[#2286C0] rounded-xl text-sm flex items-center justify-between cursor-pointer"
                onClick={() => setShowWeekDropdown(!showWeekDropdown)}
              >
                {selectedWeek || "All Weeks"} <FaChevronDown className="ml-2" />
              </div>
              {showWeekDropdown && (
                <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-md z-10">
                  <div
                    className="px-4 py-2 text-gray-600 text-sm cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSelectedWeek("");
                      setShowWeekDropdown(false);
                    }}
                  >
                    All Weeks
                  </div>
                  {weeks.map((week, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 text-gray-600 text-sm cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSelectedWeek(week);
                        setShowWeekDropdown(false);
                      }}
                    >
                      {week}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-5/6 p-6 relative h-full">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="h-full w-full px-10 mx-10">
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={6}
                centeredSlides={true}
                loop={true}
                className="h-full"
              >
                {filteredSpotlights.map((spotlight) => (
                  <SwiperSlide
                    key={spotlight.id}
                    className="!flex !justify-center !items-center h-full transition-transform duration-300 ease-in-out"
                  >
                    <div className="swiper-zoom-card w-40 h-5/6 bg-white rounded-3xl shadow-sm border border-gray-200 p-5 transition-all duration-300 ease-in-out transform hover:scale-110 hover:z-10 hover:shadow-lg hover:bg-[#F4FCFF] flex flex-col items-center justify-between">
                      <img
                        src={spotlight.logo_url || "/nifo.svg"}
                        alt={spotlight.spotlight_title}
                        className="h-20 w-20 object-contain mb-4"
                      />
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 bg-[#2286C0] rounded-full mb-1"></div>
                        <div className="w-px h-16 bg-gray-300 mb-1"></div>
                        <h2 className="text-center font-semibold text-sm mb-2">
                          {spotlight.spotlight_title}
                        </h2>
                        <div className="w-px h-16 bg-gray-300 mb-1"></div>
                        <div className="h-2 w-2 bg-[#2286C0] rounded-full mb-2"></div>
                      </div>
                      <button
                        className="text-[#2286C0] text-xs font-semibold hover:text-sm"
                        onClick={() => handleViewDetails(spotlight.id)}
                      >
                        View details →
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SpotlightPage;
